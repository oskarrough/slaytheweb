import produce from '../web_modules/immer.js'
import {createCard} from './cards.js'
import {shuffle, getTargets /*, range*/} from './utils.js'
import powers from './powers.js'

// The idea is that we have one big object with game state. Whenever we want to change something, we call an "action" from this file. Each action takes two arguments: 1) the current state, 2) an object of arguments.

// This is the big object of game state. Everything should start here.
function createNewGame() {
	return {
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
			powers: {}
		}
		// dungeon : {}
	}
}

// By default a new game doesn't come with a dungeon. You have to set one explicitly. Look in dungeon-encounters.js for inspiration.
function setDungeon(state, dungeon) {
	return produce(state, draft => {
		if (!dungeon) throw new Error('Missing a dungeon?')
		draft.dungeon = dungeon
	})
}

// Draws a "starter" deck to your discard pile. Normally you'd run this as you start the game.
function addStarterDeck(state) {
	const deck = [
		createCard('Defend'),
		createCard('Defend'),
		createCard('Defend'),
		createCard('Strike'),
		createCard('Strike'),
		createCard('Strike'),
		createCard('Strike'),
		createCard('Bash'),
		createCard('Thunderclap'),
		createCard('Flourish')
	]
	return produce(state, draft => {
		draft.deck = deck
		draft.drawPile = shuffle(deck)
	})
}

// Move X cards from deck to hand.
function drawCards(state, amount = 5) {
	if (typeof amount !== 'number') amount = 5
	return produce(state, draft => {
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
const addCardToHand = (state, {card}) =>
	produce(state, draft => {
		draft.hand.push(card)
	})

// Discard a single card from your hand.
const discardCard = (state, {card}) =>
	produce(state, draft => {
		draft.hand = state.hand.filter(c => c.id !== card.id)
		draft.discardPile.push(card)
	})

// Discard your entire hand.
const discardHand = state =>
	produce(state, draft => {
		draft.hand.forEach(card => {
			draft.discardPile.push(card)
		})
		draft.hand = []
	})

// The funky part of this action is the `target` argument. It needs to be a special type of string:
// Either "player" to target yourself, or "enemyx", where "x" is the index of the monster starting from 0. See utils.js#getTargets
function playCard(state, {card, target}) {
	target = target ? target : card.target
	if (target === 'enemy') throw new Error('Did you mean "enemy0" or "all enemies"?')
	if (!card) throw new Error('No card to play')
	if (state.player.currentEnergy < card.energy) throw new Error('Not enough energy to play card')
	if (!target || typeof target !== 'string')
		throw new Error(`Wrong target to play card: ${target},${card.target}`)
	let newState = discardCard(state, {card})
	newState = produce(newState, draft => {
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
		if (newState.player.powers.weak) amount = Math.floor(amount * 0.75)
		newState = removeHealth(newState, {target: newTarget, amount})
	}
	if (card.powers) newState = applyCardPowers(newState, {target, card})
	return newState
}

// See the note on `target` above.
function addHealth(state, {target, amount}) {
	return produce(state, draft => {
		const targets = getTargets(draft, target)
		targets.forEach(t => {
			t.currentHealth = t.currentHealth + amount
		})
	})
}

// See the note on `target` above.
const removeHealth = (state, {target, amount}) => {
	return produce(state, draft => {
		const targets = getTargets(draft, target)
		// console.log('removing health', targets, amount)
		targets.forEach(t => {
			// Adjust damage if the monster is vulnerable.
			if (t.powers.vulnerable) {
				amount = powers.vulnerable.use(amount)
			}
			// Take account for block.
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

// Used by playCard. Applies each power on the card to?
function applyCardPowers(state, {card, target}) {
	return produce(state, draft => {
		Object.entries(card.powers).forEach(([name, stacks]) => {
			if (card.target === 'player') {
				// Add powers that target player.
				const newStacks = (draft.player.powers[name] || 0) + stacks
				draft.player.powers[name] = newStacks
			} else if (card.target === 'all enemies') {
				// Add powers that target all enemies.
				draft.dungeon.rooms[draft.dungeon.index].monsters.forEach(monster => {
					const newStacks = (monster.powers[name] || 0) + stacks
					monster.powers[name] = newStacks
				})
			} else if (target) {
				// const t = getTargets(draft, target)
				const index = target.split('enemy')[1]
				const t = draft.dungeon.rooms[state.dungeon.index].monsters[index]
				// console.log(target, t)
				const newStacks = (t.powers[name] || 0) + stacks
				t.powers[name] = newStacks
			}
		})
	})
}

// Decrease all (player's + monster's) power stacks by one.
function decreasePowerStacks(state) {
	function decrease(powers) {
		Object.entries(powers).forEach(([name, stacks]) => {
			if (stacks > 0) powers[name] = stacks - 1
		})
	}
	return produce(state, draft => {
		decrease(draft.player.powers)
		state.dungeon.rooms[state.dungeon.index].monsters.forEach(monster => {
			decrease(monster.powers)
		})
	})
}

function endTurn(state) {
	let newState = discardHand(state)
	if (state.player.powers.regen) {
		newState = produce(newState, draft => {
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
	newState = decreasePowerStacks(newState)
	newState = takeMonsterTurn(newState)
	newState = newTurn(newState)
	return newState
}

// Draws new cards, reset energy, remove player block, check powers
function newTurn(state) {
	let newState = drawCards(state)

	return produce(newState, draft => {
		draft.player.currentEnergy = 3
		draft.player.block = 0
	})
}

function reshuffleAndDraw(state) {
	const nextState = produce(state, draft => {
		draft.hand = []
		draft.discardPile = []
		draft.drawPile = draft.deck
	})
	return drawCards(nextState)
}

// Runs the "intent" for each monster in the current room
function takeMonsterTurn(state) {
	return produce(state, draft => {
		draft.dungeon.rooms[draft.dungeon.index].monsters.forEach(monster => {
			monster.block = 0

			// If dead don't do anything..
			if (monster.currentHealth < 1) return

			// Get current intent.
			const intent = monster.intents[monster.nextIntent || 0]
			if (!intent) return

			// Apply block
			if (intent.block) {
				monster.block = monster.block + intent.block
			}
			// Deal damage
			if (intent.damage) {
				var newHp = removeHealth(draft, {
					target: 'player',
					amount: intent.damage
					// amount: shuffle(range(5, monster.damage - 2))[0]
				}).player.currentHealth
				draft.player.currentHealth = newHp
			}
			if (intent.vulnerable) {
				draft.player.powers.vulnerable = (draft.player.powers.vulnerable || 0) + intent.vulnerable
			}
			if (intent.weak) {
				draft.player.powers.weak = (draft.player.powers.weak || 0) + intent.weak
			}
			// Increment for next turn..
			if (monster.nextIntent === monster.intents.length - 1) {
				monster.nextIntent = 0
			} else {
				monster.nextIntent++
			}
		})
	})
}

function goToNextRoom(state) {
	let nextState = reshuffleAndDraw(state)
	return produce(nextState, draft => {
		const number = state.dungeon.index
		if (number === state.dungeon.rooms.length - 1) {
			throw new Error('You have reached the end of the dungeon. Congratulations.')
		}
		draft.dungeon.index = number + 1
	})
}

export default {
	addCardToHand,
	addHealth,
	addStarterDeck,
	applyCardPowers,
	createNewGame,
	discardCard,
	discardHand,
	drawCards,
	endTurn,
	goToNextRoom,
	playCard,
	removeHealth,
	reshuffleAndDraw,
	setDungeon,
	takeMonsterTurn
}
