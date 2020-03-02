import produce from '../web_modules/immer.js'
import {createCard} from './cards.js'
import {shuffle} from './utils.js'
import powers from './powers.js'

// The idea is that we have one big object with game state. Whenever we want to change something, we call an "action" from this file. Each action takes two arguments: 1) the current state, 2) an object of arguments.

// This is the big object of game state. Everything should start here.
function createNewGame() {
	return {
		hand: [],
		drawPile: [],
		discardPile: [],
		player: {
			maxEnergy: 3,
			currentEnergy: 3,
			maxHealth: 100,
			currentHealth: 100,
			block: 0,
			powers: {}
		},
		monster: {
			maxHealth: 42,
			currentHealth: 42,
			powers: {}
		}
	}
}

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

function playCard(state, {card}) {
	if (!card) throw new Error('No card to play')
	if (state.player.currentEnergy < card.energy) throw new Error('Not enough energy to play card')
	// Move card from hand to discard pile.
	let newState = discardCard(state, {card})
	newState = produce(newState, draft => {
		// Use energy
		draft.player.currentEnergy = newState.player.currentEnergy - card.energy
		// Block
		if (card.block) {
			draft.player.block = newState.player.block + card.block
		}
		// Damage
		if (card.damage) {
			draft.monster.currentHealth = removeHealth(newState, {
				target: 'monster',
				amount: card.damage
			}).monster.currentHealth
		}
	})
	// Powers
	if (card.powers) newState = applyCardPowers(newState, {card})
	return newState
}

function applyCardPowers(state, {card}) {
	return produce(state, draft => {
		Object.keys(card.powers).forEach(powerName => {
			let stacks = card.powers[powerName]
			if (card.target === 'self') {
				const newStacks = (state.player.powers[powerName] || 0) + stacks
				draft.player.powers[powerName] = newStacks
			}
			if (card.target === 'enemy') {
				const newStacks = (state.monster.powers[powerName] || 0) + stacks
				draft.monster.powers[powerName] = newStacks
			}
		})
	})
}

function addHealth(state, {target, amount}) {
	return produce(state, draft => {
		draft[target].currentHealth = state[target].currentHealth + amount
	})
}

const removeHealth = (state, {target, amount}) => {
	if (state[target].powers.vulnerable) {
		amount = powers.vulnerable.use(amount)
	}
	return produce(state, draft => {
		draft[target].currentHealth = state[target].currentHealth - amount
	})
}

// Ending a turn means 1) discarding your hand 2) drawing new cards and 3) resetting different state things.
function endTurn(state) {
	let newState = discardHand(state)
	newState = drawCards(newState)
	// aka "endofturnhook"
	newState = decreasePowerStacks(newState)

	newState = produce(newState, draft => {
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
	return newState
}

// Decrease all power stacks by one.
function decreasePowerStacks(state) {
	function decrease(powers) {
		Object.entries(powers).forEach(([name, stacks]) => {
			if (stacks > 0) powers[name] = stacks - 1
		})
	}
	return produce(state, draft => {
		decrease(draft.player.powers)
		decrease(draft.monster.powers)
	})
}

export default {
	addHealth,
	removeHealth,
	applyCardPowers,
	createNewGame,
	drawStarterDeck,
	drawCards,
	addCardToHand,
	discardCard,
	discardHand,
	playCard,
	endTurn
}

// ## Console Commands

// ### Anytime

// * `gold add [amount]` gain gold
// * `gold lose [amount]` lose gold
// * `potion [pos] [id]` gain specified potion in specified slot (0, 1, or 2)
// * `hp add [amount]` heal amount
// * `hp remove [amount]` hp loss
// * `maxhp add [amount]` gain max hp
// * `maxhp remove [amount]` lose max hp
// * `debug [true/false]` sets `Settings.isDebug`

// ### During Combat

// * `draw [num]` draw cards
// * `energy add [amount]` gain energy
// * `energy inf` toggles infinite energy
// * `energy remove [amount]` lose energy
// * `hand add [id] {cardcount} {upgrades}` add card to hand with (optional: integer # of times to add the card) (optional: integer # of upgrades)
// * `hand remove all` exhaust entire hand
// * `hand remove [id]` exhaust card from hand
// * `kill all` kills all enemies in the current combat
// * `kill self` kills your character
// * `power [id] [amount]` bring up a targetting reticle to apply amount stacks of a power to either the player or an enemy

// ### Outside of Combat

// * `fight [name]` enter combat with the specified encounter
// * `event [name]` start event with the specified name

// ### Anytime

// * `gold add [amount]` gain gold
// * `gold lose [amount]` lose gold
// * `info toggle` Settings.isInfo
// * `potion [pos] [id]` gain specified potion in specified slot (0, 1, or 2)
// * `hp add [amount]` heal amount
// * `hp remove [amount]` hp loss
// * `maxhp add [amount]` gain max hp
// * `maxhp remove [amount]` lose max hp
// * `debug [true/false]` sets `Settings.isDebug`

// ### Relics

// * `relic add [id]` generate relic
// * `relic list` logs all relic pools
// * `relic remove [id]` lose relic

// ### Deck Modification

// * `deck add [id] {cardcount} {upgrades}` add card to deck (optional: integer # of times you want to add this card) (optional: integer # of upgrades)
// * `deck remove [id]` remove card from deck
// * `deck remove all` remove all cards from deck
