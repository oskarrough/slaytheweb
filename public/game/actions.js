import produce from '../web_modules/immer.js'
import {createCard} from './cards.js'
import {shuffle, getMonster} from './utils.js'
import powers from './powers.js'

// The idea is that we have one big object with game state. Whenever we want to change something, we call an "action" from this file. Each action takes two arguments: 1) the current state, 2) an object of arguments.

// This is the big object of game state. Everything should start here.
function createNewGame() {
	return {
		drawPile: [],
		hand: [],
		discardPile: [],
		player: {
			maxEnergy: 3,
			currentEnergy: 3,
			maxHealth: 100,
			currentHealth: 100,
			block: 0,
			powers: {}
		}
		// dungeon : {}
	}
}

// By default a new game doesn't come with a dungeon. You have to set one explicitly. Look in dungeon-encounters.js for inspiration.
const setDungeon = (state, dungeon) =>
	produce(state, draft => {
		if (!dungeon) throw new Error('Missing a dungeon?')
		draft.dungeon = dungeon
	})

// Draws a "starter" deck to your discard pile. Normally you'd run this as you start the game.
function drawStarterDeck(state) {
	const deck = [
		createCard('Defend'),
		createCard('Defend'),
		createCard('Defend'),
		createCard('Strike'),
		createCard('Strike'),
		createCard('Strike'),
		createCard('Strike'),
		createCard('Strike'),
		createCard('Bash'),
		createCard('Flourish')
	]
	return produce(state, draft => {
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

const addCardToHand = (state, {card}) =>
	produce(state, draft => {
		draft.hand.push(card)
	})

// Discard a single card from hand.
const discardCard = (state, {card}) =>
	produce(state, draft => {
		draft.hand = state.hand.filter(c => c.id !== card.id)
		draft.discardPile.push(card)
	})

// Discard entire hand.
const discardHand = state =>
	produce(state, draft => {
		draft.hand.forEach(card => {
			draft.discardPile.push(card)
		})
		draft.hand = []
	})

// The funky part of this action is the `target` argument. It needs to be a special type of string. Either "player" to target yourself, or "enemyx", where "x" is the index of the monster starting from 0. See utils.js#getMonster
function playCard(state, {card, target}) {
	if (!target) target = card.target
	if (!card) throw new Error('No card to play')
	if (state.player.currentEnergy < card.energy) throw new Error('Not enough energy to play card')
	if (!target || typeof target !== 'string') throw new Error(`Wrong target to play card: ${target}`)
	let newState = discardCard(state, {card})
	newState = produce(newState, draft => {
		// Use energy
		draft.player.currentEnergy = newState.player.currentEnergy - card.energy
		// Block is expected to always target the player.
		if (card.block) {
			draft.player.block = newState.player.block + card.block
		}
	})
	if (card.damage) newState = removeHealth(newState, {target, amount: card.damage})
	if (card.powers) newState = applyCardPowers(newState, {card})
	return newState
}

function addHealth(state, {target, amount}) {
	return produce(state, draft => {
		const monster = getMonster(draft, target)
		monster.currentHealth = monster.currentHealth + amount
	})
}

const removeHealth = (state, {target, amount}) => {
	return produce(state, draft => {
		const monster = getMonster(draft, target)
		// Adjust damage if the monster is vulnerable.
		if (monster.powers.vulnerable) {
			amount = powers.vulnerable.use(amount)
		}
		const newHp = monster.currentHealth - amount
		monster.currentHealth = newHp
	})
}

function applyCardPowers(state, {card}) {
	return produce(state, draft => {
		Object.entries(card.powers).forEach(([name, stacks]) => {
			// Add powers that target player.
			if (card.target === 'player') {
				const newStacks = (state.player.powers[name] || 0) + stacks
				draft.player.powers[name] = newStacks
			}
			// Add powers that target an enemy.
			if (card.target === 'enemy') {
				state.dungeon.rooms[state.dungeon.index].monsters.forEach(monster => {
					const newStacks = (monster.powers[name] || 0) + stacks
					// @todo for now we just apply to one
					draft.dungeon.rooms[state.dungeon.index].monsters[0].powers[name] = newStacks
				})
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

// Ending a turn means 1) discarding your hand 2) drawing new cards and 3) resetting different state things.
function endTurn(state) {
	let newState = discardHand(state)
	newState = drawCards(newState)
	// aka "endofturnhook"
	newState = decreasePowerStacks(newState)
	return produce(newState, draft => {
		// Reset energy and block
		draft.player.currentEnergy = 3
		draft.player.block = 0

		// @todo avoid hardcoding individual powers.
		if (state.player.powers.regen) {
			let amount = powers.regen.use(state.player.powers.regen)
			let x = addHealth(newState, {
				target: 'player',
				amount
			})
			draft.player.currentHealth = x.player.currentHealth
		}
	})
}

function goToNextRoom(state) {
	return produce(state, draft => {
		const number = state.dungeon.index
		if (number === state.dungeon.rooms.length - 1) {
			throw new Error('Already at last room')
		}
		draft.dungeon.index = number + 1
	})
}

export default {
	applyCardPowers,
	createNewGame,
	drawStarterDeck,
	drawCards,
	addCardToHand,
	discardCard,
	discardHand,
	playCard,
	endTurn,
	addHealth,
	removeHealth,
	setDungeon,
	goToNextRoom
}
