import produce from '../web_modules/immer.js'
import {createCard} from './cards.js'
import {shuffle, getTargets, getCurrRoom, clamp} from './utils.js'
import powers from './powers.js'
import {dungeonWithMap} from '../content/dungeon-encounters.js'

// Without this, immer.js will throw an error if our `state` is modified outside of an action.
// While in theory a good idea, we're not there yet. It is a useful way to spot modifications
// of the game state that should not be there.
// setAutoFreeze(false)

// In Slay the Web, we have one big object with game state.
// Whenever we want to change something, call an "action" from this file.
// Each action takes two arguments: 1) the current state, 2) an object of arguments.

// This is the big object of game state. Everything starts here.
function createNewGame() {
	return {
		turn: 1,
		deck: [],
		drawPile: [],
		hand: [],
		discardPile: [],
		player: {
			maxEnergy: 3,
			currentEnergy: 3,
			maxHealth: 72,
			currentHealth: 72,
			block: 0,
			powers: {},
		},
		dungeon: false,
	}
}

// By default a new game doesn't come with a dungeon. You have to set one explicitly. Look in dungeon-encounters.js for inspiration.
function setDungeon(state, dungeon) {
	if (!dungeon) dungeon = dungeonWithMap()
	state.dungeon = dungeon
	return state
	// return produce(state, (draft) => {
	// 	draft.dungeon = dungeon
	// })
}

// Draws a "starter" deck to your discard pile. Normally you'd run this as you start the game.
function addStarterDeck(state) {
	const deck = [
		createCard('Defend'),
		createCard('Defend'),
		createCard('Defend'),
		createCard('Defend'),
		createCard('Strike'),
		createCard('Strike'),
		createCard('Strike'),
		createCard('Strike'),
		createCard('Strike'),
		createCard('Bash'),
	]
	return produce(state, (draft) => {
		draft.deck = deck
		draft.drawPile = shuffle(deck)
	})
}

// Move X cards from deck to hand.
function drawCards(state, options) {
	const amount = options ? options.amount : 5
	return produce(state, (draft) => {
		// When there aren't enough cards to draw, we recycle all cards from the discard pile to the draw pile. Should we shuffle?
		if (state.drawPile.length < amount) {
			draft.drawPile = state.drawPile.concat(state.discardPile)
			draft.drawPile = shuffle(draft.drawPile)
			draft.discardPile = []
		}
		const newCards = draft.drawPile.slice(0, amount)
		// Take the first X cards from deck and add to hand and remove them from the deck.
		draft.hand = draft.hand.concat(newCards)
		for (let i = 0; i < amount; i++) {
			draft.drawPile.shift()
		}
	})
}

// Adds a card (from nowhere) directly to your hand.
function addCardToHand(state, {card}) {
	return produce(state, (draft) => {
		draft.hand.push(card)
	})
}

// Discard a single card from your hand.
function discardCard(state, {card}) {
	return produce(state, (draft) => {
		draft.hand = state.hand.filter((c) => c.id !== card.id)
		draft.discardPile.push(card)
	})
}

// Discard your entire hand.
function discardHand(state) {
	return produce(state, (draft) => {
		draft.hand.forEach((card) => {
			draft.discardPile.push(card)
		})
		draft.hand = []
	})
}

// Discard a single card from your hand.
function removeCard(state, {card}) {
	return produce(state, (draft) => {
		draft.deck = state.deck.filter((c) => c.id !== card.id)
	})
}

/**
 * Upgrades a card.
 * @param {*} object state
 * @param {card} object props {card}
 * @returns state
 */
function upgradeCard(state, {card}) {
	return produce(state, (draft) => {
		draft.deck.find((c) => c.id === card.id).upgrade()
	})
}

// The funky part of this action is the `target` argument. It needs to be a special type of string:
// Either "player" to target yourself, or "enemyx", where "x" is the index of the monster starting from 0. See utils.js#getTargets
function playCard(state, {card, target}) {
	if (!target) target = card.target
	if (typeof target !== 'string')
		throw new Error(`Wrong target to play card: ${target},${card.target}`)
	if (target === 'enemy') throw new Error('Did you mean "enemy0" or "all enemies"?')
	if (!card) throw new Error('No card to play')
	if (state.player.currentEnergy < card.energy) throw new Error('Not enough energy to play card')
	let newState = discardCard(state, {card})
	newState = produce(newState, (draft) => {
		// Use energy
		draft.player.currentEnergy = newState.player.currentEnergy - card.energy
		// Block is expected to always target the player.
		if (card.block) {
			draft.player.block = newState.player.block + card.block
		}
	})
	if (card.damage) {
		// This should be refactored, but when you play an attack card that targets all enemies,
		// we prioritize this over the actual enemy where you dropped the card.
		const newTarget = card.target === 'all enemies' ? card.target : target
		let amount = card.damage
		if (newState.player.powers.weak) amount = powers.weak.use(amount)
		newState = removeHealth(newState, {target: newTarget, amount})
	}
	if (card.powers) newState = applyCardPowers(newState, {target, card})
	if (card.use) newState = card.use(newState, {target, card})
	return newState
}

// See the note on `target` above.
function addHealth(state, {target, amount}) {
	return produce(state, (draft) => {
		const targets = getTargets(draft, target)
		targets.forEach((t) => {
			t.currentHealth = clamp(t.currentHealth + amount, 0, t.maxHealth)
		})
	})
}

function addRegenEqualToAllDamage(state, {card}) {
	return produce(state, (draft) => {
		const room = getCurrRoom(state)
		const aliveMonsters = room.monsters.filter((monster) => {
			return monster.currentHealth > 0
		})
		const {regen = 0} = state.player.powers
		const totalDamage = aliveMonsters.length * card.damage
		draft.player.powers.regen = totalDamage + regen
	})
}

const removePlayerDebuffs = (state, { target, amount }) => {
	return produce(state, (draft) => {
		draft.player.powers.weak = 0
		draft.player.powers.vulnerable = 0
  })
}

function addEnergyToPlayer(state) {
	return produce(state, (draft) => {
		/* draft.player.maxEnergy = draft.player.maxEnergy + 1 */
		draft.player.currentEnergy = draft.player.currentEnergy + 1
	})
}

// See the note on `target` above.
const removeHealth = (state, {target, amount}) => {
	return produce(state, (draft) => {
		getTargets(draft, target).forEach((t) => {
			if (t.powers.vulnerable) amount = powers.vulnerable.use(amount)
			let amountAfterBlock = t.block - amount
			if (amountAfterBlock < 0) {
				t.block = 0
				t.currentHealth = t.currentHealth + amountAfterBlock
			} else {
				t.block = amountAfterBlock
			}
		})
	})
}
const removePlayerHealth = (state, {
	target,
	amount,
}) => {
	target = 'player'
	return removeHealth(state, {target, amount})
}

/**
 * Sets the health of a target
 * @param {Object} state
 * @param {target: string, amount: number} props
 * @returns state
 */
const setHealth = (state, {target, amount}) => {
	return produce(state, (draft) => {
		getTargets(draft, target).forEach((t) => {
			t.currentHealth = amount
		})
	})
}

// Used by playCard. Applies each power on the card to?
function applyCardPowers(state, {card, target}) {
	return produce(state, (draft) => {
		Object.entries(card.powers).forEach(([name, stacks]) => {
			if (card.target === 'player') {
				// Add powers that target player.
				const newStacks = (draft.player.powers[name] || 0) + stacks
				draft.player.powers[name] = newStacks
			} else if (card.target === 'all enemies') {
				// Add powers that target all enemies.
				draft.dungeon.graph[draft.dungeon.y][draft.dungeon.x].room.monsters.forEach((monster) => {
					if (monster.currentHealth < 1) return
					const newStacks = (monster.powers[name] || 0) + stacks
					monster.powers[name] = newStacks
				})
			} else if (target) {
				// const t = getTargets(draft, target)
				const index = target.split('enemy')[1]
				const monster = draft.dungeon.graph[draft.dungeon.y][draft.dungeon.x].room.monsters[index]
				if (monster.currentHealth < 1) return
				const newStacks = (monster.powers[name] || 0) + stacks
				monster.powers[name] = newStacks
			}
		})
	})
}

// Helper to decrease all power stacks by one.
function _decreasePowers(powers) {
	Object.entries(powers).forEach(([name, stacks]) => {
		if (stacks > 0) powers[name] = stacks - 1
	})
}

// Decrease player's power stacks.
function decreasePlayerPowerStacks(state) {
	return produce(state, (draft) => {
		_decreasePowers(draft.player.powers)
	})
}

// Decrease monster's power stacks.
function decreaseMonsterPowerStacks(state) {
	return produce(state, (draft) => {
		getCurrRoom(draft).monsters.forEach((monster) => {
			_decreasePowers(monster.powers)
		})
	})
}

function endTurn(state) {
	let newState = discardHand(state)
	if (state.player.powers.regen) {
		newState = produce(newState, (draft) => {
			let amount = powers.regen.use(newState.player.powers.regen)
			let newHealth
			// Don't allow regen to go above max health.
			if (newState.player.currentHealth + amount > newState.player.maxHealth) {
				newHealth = newState.player.maxHealth
			} else {
				newHealth = addHealth(newState, {target: 'player', amount}).player.currentHealth
			}
			draft.player.currentHealth = newHealth
		})
	}
	newState = playMonsterActions(newState)
	newState = decreasePlayerPowerStacks(newState)
	newState = decreaseMonsterPowerStacks(newState)
	newState = newTurn(newState)
	return newState
}

// Draws new cards, reset energy, remove player block, check powers
function newTurn(state) {
	let newState = drawCards(state)

	return produce(newState, (draft) => {
		draft.turn++
		draft.player.currentEnergy = 3
		draft.player.block = 0
	})
}

function reshuffleAndDraw(state) {
	const nextState = produce(state, (draft) => {
		draft.hand = []
		draft.discardPile = []
		draft.drawPile = shuffle(draft.deck)
	})
	return drawCards(nextState)
}

// Run all monster intents in current room.
function playMonsterActions(state) {
	const room = getCurrRoom(state)
	if (!room.monsters) return state
	// For each monster, take turn, get state, pass to next monster.
	let nextState = state
	room.monsters.forEach((monster, index) => {
		nextState = takeMonsterTurn(nextState, index)
	})
	return nextState
}

// Runs the "intent" for a single monster (index) in the current room.
function takeMonsterTurn(state, monsterIndex) {
	return produce(state, (draft) => {
		const room = getCurrRoom(draft)
		const monster = room.monsters[monsterIndex]
		// Reset block at start of turn.
		monster.block = 0

		// If dead don't do anything..
		if (monster.currentHealth < 1) return

		// Get current intent.
		const intent = monster.intents[monster.nextIntent || 0]
		if (!intent) return

		// Increment for next turn..
		if (monster.nextIntent === monster.intents.length - 1) {
			monster.nextIntent = 0
		} else {
			monster.nextIntent++
		}

		// Run the intent..
		if (intent.block) {
			monster.block = monster.block + intent.block
		}

		if (intent.damage) {
			let amount = intent.damage
			if (monster.powers.weak) amount = powers.weak.use(amount)
			const updatedPlayer = removeHealth(draft, {target: 'player', amount}).player
			draft.player.block = updatedPlayer.block
			draft.player.currentHealth = updatedPlayer.currentHealth
		}

		if (intent.vulnerable) {
			draft.player.powers.vulnerable = (draft.player.powers.vulnerable || 0) + intent.vulnerable + 1
		}

		if (intent.weak) {
			draft.player.powers.weak = (draft.player.powers.weak || 0) + intent.weak + 1
		}
	})
}

function rewardPlayer(state, {card}) {
	return produce(state, (draft) => {
		draft.deck.push(card)
	})
}

// Records a move on the map.
function move(state, {move}) {
	let nextState = reshuffleAndDraw(state)

	return produce(nextState, (draft) => {
		// Clear temporary powers, energy and block on player.
		draft.player.powers = {}
		draft.player.currentEnergy = 3
		draft.player.block = 0
		draft.dungeon.graph[move.y][move.x].didVisit = true
		draft.dungeon.pathTaken.push({x: move.x, y: move.y})
		draft.dungeon.x = move.x
		draft.dungeon.y = move.y
		// if (number === state.dungeon.rooms.length - 1) {
		// 	throw new Error('You have reached the end of the dungeon. Congratulations.')
		// }
	})
}

/**
 * Deals damage to a target equal to the current player's block.
 * @param {obj} state
 * @param {target: string} props
 * @returns state
 */
function dealDamageEqualToBlock(state, {target}) {
	const block = state.player.block
	return removeHealth(state, {target, amount: block})
}

/**
 * Sets a single power on a specific target
 * @param {obj} state
 * @param {Object} props
 * @param {string} props.target
 * @param {string} props.power
 * @param {number} props.amount
 * @returns state
 */
function setPower(state, {target, power, amount}) {
	return produce(state, (draft) => {
		getTargets(draft, target).forEach((target) => {
			target.powers[power] = amount
		})
	})
}

/**
 * Stores a campfire choice on the room (useful for stats and whatnot)
 * @param {object} state
 * @param {object} props
 * @param {object} props.room a dungeon room
 * @param {string} props.choice enum of the campfire choices
 * @param {object} props.reward card
 * @returns
 */
function makeCampfireChoice(state, {choice, reward}) {
	return produce(state, (draft) => {
		const room = getCurrRoom(draft)
		room.choice = choice
		room.reward = reward
	})
}

/**
 * Sets the health of all monsters in the dungeon to 1.
 * @param {object} state
 * @returns state
 */
function iddqd(state) {
	console.log('iddqd')
	return produce(state, (draft) => {
		draft.dungeon.graph.forEach((floor) => {
			floor.forEach((node) => {
				if (!node.room || !node.room.monsters) return
				node.room.monsters.forEach((monster) => {
					monster.currentHealth = 1
				})
			})
		})
	})
}

export default {
	addCardToHand,
	addHealth,
	addRegenEqualToAllDamage,
	addEnergyToPlayer,
	addStarterDeck,
	applyCardPowers,
	createNewGame,
	dealDamageEqualToBlock,
	discardCard,
	discardHand,
	drawCards,
	endTurn,
	iddqd,
	makeCampfireChoice,
	move,
	playCard,
	removeCard,
	removeHealth,
	removePlayerHealth,
	removePlayerDebuffs,
	reshuffleAndDraw,
	rewardPlayer,
	setDungeon,
	setHealth,
	setPower,
	takeMonsterTurn,
	upgradeCard,
}
