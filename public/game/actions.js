import {createCard} from './cards.js'
import produce from '../web_modules/immer.js'

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
			block: 0
		},
		monster: {
			maxHealth: 42,
			currentHealth: 42
		}
	}
}

function drawStarterDeck({state}) {
	const deck = [
		createCard('Bash'),
		createCard('Defend'),
		createCard('Defend'),
		createCard('Defend'),
		createCard('Defend'),
		createCard('Strike'),
		createCard('Strike'),
		createCard('Strike'),
		createCard('Strike')
	]
	return produce(state, draft => {
		draft.drawPile = deck
	})
}

// Move X cards from deck to hand
function drawCards({state, amount = 4}) {
	return produce(state, draft => {
		const newCards = state.drawPile.slice(0, amount)
		// Take the first X cards from deck and add to hand
		draft.hand = draft.hand.concat(newCards)
		// and remove them from deck
		for (let i = 0; i < amount; i++) {
			draft.drawPile.shift()
		}
	})
}

// Discard a single card from hand.
const discardCard = ({state, card}) =>
	produce(state, draft => {
		// console.log(state.hand)
		draft.hand = state.hand.filter(c => c.id !== card.id)
		draft.discardPile.push(card)
	})

// Discard entire hand.
const discardHand = ({state}) =>
	produce(state, draft => {
		draft.hand.forEach(card => {
			draft.discardPile.push(card)
		})
		draft.hand = []
	})

function playCard({state, card}) {
	if (!card) throw new Error('No card to play')
	if (state.player.currentEnergy < card.cost) throw new Error('Not enough energy to play card')
	return produce(state, draft => {
		// Move card from hand to discard pile.
		draft.hand = state.hand.filter(c => c.id !== card.id)
		draft.discardPile.push(card)
		// And play it...
		draft.player.currentEnergy = state.player.currentEnergy - card.cost
		// not sure about this way...
		if (card.damage) {
			// changeHealth({state, target: 'monster', amount: card.damage})
			draft.monster.currentHealth = state.monster.currentHealth - card.damage
		}
		if (card.block) {
			draft.player.block = state.player.block + card.block
		}
		// card.use()
	})
}

function changeHealth({state, target, amount}) {
	// if (target !== ('player' || 'monster')) throw new Error(`Invalid target: ${target}`)
	return produce(state, draft => {
		draft[target].currentHealth = state[target].currentHealth + amount
	})
}

function endTurn({state}) {
	const newState = discardHand({state})
	return produce(newState, draft => {
		// reset energy and block
		draft.player.currentEnergy = 3
		draft.player.block = 0
		// @todo move cards from hand to bottom of drawpile
		// @todo draw again
	})
}

export default {
	createNewGame,
	drawStarterDeck,
	drawCards,
	discardCard,
	discardHand,
	playCard,
	endTurn,
	changeHealth
}

// ### Deck Modification

// * `deck add [id] {cardcount} {upgrades}` add card to deck (optional: integer # of times you want to add this card) (optional: integer # of upgrades)
// * `deck remove [id]` remove card from deck
// * `deck remove all` remove all cards from deck

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
