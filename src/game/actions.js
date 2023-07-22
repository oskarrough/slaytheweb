import {produce} from 'immer'
import {createCard, CardTargets} from './cards.js'
import {clamp, shuffle} from './utils.js'
import {getTargets, getCurrRoom} from './utils-state.js'
import powers from './powers.js'
import {dungeonWithMap} from '../content/dungeon-encounters.js'
import {conditionsAreValid} from './conditions.js'
import {isDungeonCompleted} from './utils-state.js'

// Without this, immer.js will throw an error if our `state` is modified outside of an action.
// While in theory a good idea, we're not there yet. It is a useful way to spot modifications
// of the game state that should not be there.
// setAutoFreeze(false)

// In Slay the Web, we have one big object with game state.
// Whenever we want to change something, call an "action" from this file.
// Each action takes two arguments: 1) the current state, 2) an object of arguments.

/**
 * @typedef {object} State
 * @prop {number} turn
 * @prop {Array} deck
 * @prop {Array} drawPile
 * @prop {Array} hand
 * @prop {Array} discardPile
 * @prop {Array} exhaustPile
 * @prop {Player} player
 * @prop {Object} dungeon
 * @prop {Number} createdAt
 * @prop {Number} endedAt
 * @prop {Boolean} won
 */

/**
 * @typedef {object} Player
 * @prop {number} currentEnergy
 * @prop {number} maxEnergy
 * @prop {number} currentHealth
 * @prop {number} maxHealth
 * @prop {number} block
 * @prop {Object} powers
 */

/**
 * @template T
 * @callback ActionFn
 * @param {State} state - first argument must be the state object
 * @param {T} [props]
 * @returns {State} returns a new state object
 */

/**
 * This is the big object of game state. Everything starts here.
 * @returns {State}
 */
function createNewState() {
	return {
		turn: 1,
		deck: [],
		drawPile: [],
		hand: [],
		discardPile: [],
		exhaustPile: [],
		player: {
			maxEnergy: 3,
			currentEnergy: 3,
			maxHealth: 72,
			currentHealth: 72,
			block: 0,
			powers: {},
		},
		dungeon: {},
		createdAt: new Date().getTime(),
		endedAt: undefined,
		won: false,
	}
}

/**
 * By default a new game doesn't come with a dungeon. You have to set one explicitly. Look in dungeon-encounters.js for inspiration.
 * @param {State} state
 * @param {import('./dungeon.js').Dungeon} [dungeon]
 * @returns {State}
 */
function setDungeon(state, dungeon) {
	if (!dungeon) dungeon = dungeonWithMap()
	state.dungeon = dungeon
	return state
	// return produce(state, (draft) => {
	// 	draft.dungeon = dungeon
	// })
}

/**
 * Draws a "starter" deck to your discard pile. Normally you'd run this as you start the game.
 * @param {State} state
 * @returns {State}
 */
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

/**
 * Move X cards from deck to hand.
 * @type {ActionFn<{amount: number}>}
 */
function drawCards(state, options) {
	const amount = options?.amount ? options.amount : 5
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

/**
 * Adds a card (from nowhere) directly to your hand.
 * @type {ActionFn<{card: import('./cards.js').CARD}>}
 */
function addCardToHand(state, {card}) {
	return produce(state, (draft) => {
		draft.hand.push(card)
	})
}

/**
 * Discard a single card from your hand.
 * @type {ActionFn<{card: import('./cards.js').CARD}>}
 */
function discardCard(state, {card}) {
	return produce(state, (draft) => {
		draft.hand = state.hand.filter((c) => c.id !== card.id)
		if (card.exhaust) {
			draft.exhaustPile.push(card)
		} else {
			draft.discardPile.push(card)
		}
	})
}

// function exhaustCard(state, {card}) {
// 	return produce(state, (draft) => {
// 		draft.hand = state.hand.filter((c) => c.id !== card.id)
// 	})
// }

/**
 * Discard all cards in your hand.
 * @type {ActionFn<{}>}
 */
function discardHand(state) {
	return produce(state, (draft) => {
		draft.hand.forEach((card) => {
			draft.discardPile.push(card)
		})
		draft.hand = []
	})
}

/**
 * Discard a single card from your hand.
 * @type {ActionFn<{card: object}>}
 */
function removeCard(state, {card}) {
	return produce(state, (draft) => {
		draft.deck = state.deck.filter((c) => c.id !== card.id)
	})
}

/**
 * Upgrades a card.
 * @type {ActionFn<{card: object}>}
 */
function upgradeCard(state, {card}) {
	return produce(state, (draft) => {
		const index = draft.deck.findIndex((c) => c.id === card.id)
		draft.deck[index] = createCard(card.name, true)
	})
}

/**
 * Play a card
 * The funky part of this action is the `target` argument. It needs to be a special type of string:
 * Either "player" to target yourself, or "enemyx", where "x" is the index of the monster starting from 0. See utils.js#getTargets
 * @type {ActionFn<{card: object, target?: string}>}
 */
function playCard(state, {card, target}) {
	if (!target) target = card.target
	if (typeof target !== 'string')
		throw new Error(`Wrong target to play card: ${target},${card.target}`)
	if (target === 'enemy') throw new Error('Wrong target, did you mean "enemy0" or "allEnemies"?')
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
	if (card.type === 'attack' || card.damage) {
		// This should be refactored, but when you play an attack card that targets all enemies,
		// we prioritize this over the actual enemy where you dropped the card.
		const newTarget = card.target === CardTargets.allEnemies ? card.target : target
		let amount = card.damage
		if (newState.player.powers.strength) {
			amount = amount + powers.strength.use(newState.player.powers.strength)
		}
		if (newState.player.powers.weak) {
			amount = powers.weak.use(amount)
		}
		newState = removeHealth(newState, {target: newTarget, amount})
	}
	if (card.powers) newState = applyCardPowers(newState, {target, card})
	// if (card.use) newState = card.use(newState, {target, card})
	newState = useCardActions(newState, {target, card})
	return newState
}

/**
 * Runs through a list of actions and return the updated state.
 * Called when the card is played.
 * You CAN overwrite it, just make sure to return a new state.
 * @type {ActionFn<{card: object, target?: string}>}
 */
export function useCardActions(state, {target, card}) {
	if (!card.actions) return state
	let newState = state
	card.actions.forEach((action) => {
		// Don't run action if it has an invalid condition.
		if (action.conditions && !conditionsAreValid(state, action.conditions)) {
			return newState
		}
		if (!action.parameter) action.parameter = {}

		// Make sure the action is called with a target, preferably the target you dropped the card on.
		action.parameter.target = target

		// Run the action (and add the `card` to the parameters
		newState = allActions[action.type](newState, {...action.parameter, card})
	})
	return newState
}

/**
 * Adds health to a "target". Will stay between 0 and target.maxHealth.
 * @type {ActionFn<{target: string, amount: number}>}
 */
function addHealth(state, {target, amount}) {
	return produce(state, (draft) => {
		const targets = getTargets(draft, target)
		targets.forEach((t) => {
			t.currentHealth = clamp(t.currentHealth + amount, 0, t.maxHealth)
		})
	})
}

/**
 * Adds regen to the player equal to the amount of damage dealt to all enemies.
 * @type {ActionFn<{card: import('./cards.js').CARD}>}
 */
function addRegenEqualToAllDamage(state, {card}) {
	if (!card) throw new Error('missing card!')
	return produce(state, (draft) => {
		const room = getCurrRoom(state)
		const aliveMonsters = room.monsters.filter((monster) => monster.currentHealth > 0)
		const {regen = 0} = state.player.powers
		const totalDamage = aliveMonsters.length * card.damage
		draft.player.powers.regen = totalDamage + regen
	})
}

/**
 * Removes any weak or vulnerable powers from the player.
 * @type {ActionFn<{}>}
 */
const removePlayerDebuffs = (state) => {
	return produce(state, (draft) => {
		draft.player.powers.weak = 0
		draft.player.powers.vulnerable = 0
	})
}

/**
 * Adds energy to the player
 * @type {ActionFn<{amount?: number}>}
 */
function addEnergyToPlayer(state, props) {
	const amount = props?.amount ? props.amount : 1
	return produce(state, (draft) => {
		draft.player.currentEnergy = draft.player.currentEnergy + amount
	})
}

/**
 * Removes health from a target, respecting vulnerable and block.
 * @type {ActionFn<{target: string, amount: number}>}
 */
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
			if (target === 'player' && t.currentHealth < 1) {
				draft.endedAt = new Date().getTime()
			}
		})
	})
}

/**
 * Sets the health of a target
 * @type {ActionFn<{target: CardTargets, amount: number}>}
 */
const setHealth = (state, {target, amount}) => {
	return produce(state, (draft) => {
		getTargets(draft, target).forEach((t) => {
			t.currentHealth = amount
		})
	})
}

/**
 * Used by playCard. Applies each power on the card to?
 * @type {ActionFn<{card: import('./cards.js').CARD, target: CardTargets}>}
 */
function applyCardPowers(state, {card, target}) {
	return produce(state, (draft) => {
		Object.entries(card.powers).forEach(([name, stacks]) => {
			// Add powers that target player.
			if (card.target === CardTargets.player) {
				draft.player.powers[name] = (draft.player.powers[name] || 0) + stacks
			}

			// Add powers that target all enemies.
			else if (card.target === CardTargets.allEnemies) {
				draft.dungeon.graph[draft.dungeon.y][draft.dungeon.x].room.monsters.forEach((monster) => {
					if (monster.currentHealth < 1) return
					monster.powers[name] = (monster.powers[name] || 0) + stacks
				})
			}

			// Add powers to a specific enemy.
			else if (target) {
				const index = target.split('enemy')[1]
				const monster = draft.dungeon.graph[draft.dungeon.y][draft.dungeon.x].room.monsters[index]
				if (monster.currentHealth < 1) return
				monster.powers[name] = (monster.powers[name] || 0) + stacks
			}
		})
	})
}

/**
 * Helper to decrease all power stacks by one.
 * @param {import('./cards.js').CardPowers} powers
 */
function _decreasePowers(powers) {
	Object.entries(powers).forEach(([name, stacks]) => {
		if (stacks > 0) powers[name] = stacks - 1
	})
}

/**
 * Decrease player's power stacks..
 * @type {ActionFn<{}>}
 */
function decreasePlayerPowerStacks(state) {
	return produce(state, (draft) => {
		_decreasePowers(draft.player.powers)
	})
}

/**
 * Decrease monster's power stacks.
 * @type {ActionFn<{}>}
 */
function decreaseMonsterPowerStacks(state) {
	return produce(state, (draft) => {
		getCurrRoom(draft).monsters.forEach((monster) => {
			_decreasePowers(monster.powers)
		})
	})
}

/**
 * End the current turn. This does many things..
 * @type {ActionFn<{}>}
 */
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
	const isDead = newState.player.currentHealth < 0
	const didWin = isDungeonCompleted(newState)
	const gameOver = isDead || didWin
	newState = produce(newState, (draft) => {
		if (didWin) draft.won = true
		if (gameOver) {
			draft.endedAt = new Date().getTime()
		}
	})
	if (!gameOver) newState = newTurn(newState)
	return newState
}

/**
 * Draws new cards, reset energy, remove player block, check powers.
 * @type {ActionFn<{}>}
 */
function newTurn(state) {
	let newState = drawCards(state)

	return produce(newState, (draft) => {
		draft.turn++
		draft.player.currentEnergy = 3
		draft.player.block = 0
	})
}

/**
 * Ends an encounter. Called after making a map move. Why?
 * @type {ActionFn<{}>}
 */
function endEncounter(state) {
	const nextState = produce(state, (draft) => {
		draft.hand = []
		draft.discardPile = []
		draft.exhaustPile = []
		draft.drawPile = shuffle(draft.deck)
	})
	return drawCards(nextState)
}

/** @type {ActionFn<{}>} Run all monster intents in current room. */
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

/** @type {ActionFn<number>} Runs the "intent" for a single monster (index) in the current room. */
function takeMonsterTurn(state, monsterIndex) {
	return produce(state, (draft) => {
		const room = getCurrRoom(draft)
		const monster = room.monsters[monsterIndex]
		// Reset block at start of turn.
		monster.block = 0
		// If dead don't do anything..
		if (monster.currentHealth < 1) return

		/**		if (monster.powers.poison)
		{
			state = removeHealth(state, {monster, powers.poison.use(monster.powers.poison)})
			--hurt monster?!
		}*/

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
			if (updatedPlayer.currentHealth < 1) {
				draft.endedAt = new Date().getTime()
			}
		}

		if (intent.vulnerable) {
			draft.player.powers.vulnerable = (draft.player.powers.vulnerable || 0) + intent.vulnerable + 1
		}

		if (intent.weak) {
			draft.player.powers.weak = (draft.player.powers.weak || 0) + intent.weak + 1
		}
	})
}

/**
 * Adds a card to the deck.
 * @type {ActionFn<{card: import('./cards.js').CARD}>}
 */
function addCardToDeck(state, {card}) {
	return produce(state, (draft) => {
		draft.deck.push(card)
	})
}

/**
 * Records a move on the dungeon map.
 * @type {ActionFn<{move: {x: number, y: number}}}
 */
function move(state, {move}) {
	let nextState = endEncounter(state)

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
 * @type {ActionFn<{target: CardTargets}}
 */
function dealDamageEqualToBlock(state, {target}) {
	if (state.player.block) {
		const block = state.player.block
		return removeHealth(state, {target, amount: block})
	}
}

/**
 * Deals damage to "target" equal to the amount of vulnerable on the target.
 * @type {ActionFn<{target: CardTargets}>}
 */
function dealDamageEqualToVulnerable(state, {target}) {
	return produce(state, (draft) => {
		getTargets(draft, target).forEach((t) => {
			if (t.powers.vulnerable) {
				const amount = t.currentHealth - t.powers.vulnerable
				t.currentHealth = amount
			}
		})
		return draft
	})
}

/**
 * Deals damage to "target" equal to the amount of vulnerable on the target.
 * @type {ActionFn<{target: CardTargets}>}
 */
function dealDamageEqualToWeak(state, {target}) {
	return produce(state, (draft) => {
		getTargets(draft, target).forEach((t) => {
			if (t.powers.weak) {
				const amount = t.currentHealth - t.powers.weak
				t.currentHealth = amount
			}
		})
		return draft
	})
}

/**
 * Sets a single power on a specific target
 * @type {ActionFn<{target: CardTargets, power: string, amount: number}>}
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
 * @type {ActionFn<{room: import('./dungeon-rooms.js').Room, choice: string, reward: import('./cards.js').CARD}>}
 */
function makeCampfireChoice(state, {choice, reward}) {
	return produce(state, (draft) => {
		const room = getCurrRoom(draft)
		room.choice = choice
		room.reward = reward
	})
}

/**
 * A cheat code. Sets the health of all monsters in the dungeon to 1.
 * @type {ActionFn<{}>}
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

const allActions = {
	addCardToDeck,
	addCardToHand,
	addEnergyToPlayer,
	addHealth,
	addRegenEqualToAllDamage,
	addStarterDeck,
	applyCardPowers,
	createNewState,
	dealDamageEqualToBlock,
	dealDamageEqualToVulnerable,
	dealDamageEqualToWeak,
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
	removePlayerDebuffs,
	setDungeon,
	setHealth,
	setPower,
	takeMonsterTurn,
	upgradeCard,
	endEncounter,
}

export default allActions
