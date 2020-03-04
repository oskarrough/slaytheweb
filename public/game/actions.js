import produce from '../web_modules/immer.js'
import {createCard} from './cards.js'
import {shuffle, getMonster} from './utils.js'
import powers from './powers.js'
import {createSimpleDungeon} from './dungeon-encounters.js'

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

// By default a new game doesn't come with a dungeon. Use this to set one.
function setDungeon(state, {dungeon} = {}) {
	// Default to the "simple" dungeon encounter.
	if (!dungeon) dungeon = createSimpleDungeon()
	return produce(state, draft => {
		draft.dungeon = dungeon
	})
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

function playCard(state, {card, target}) {
	if (!target) target = card.target
	if (!card) throw new Error('No card to play')
	if (state.player.currentEnergy < card.energy) throw new Error('Not enough energy to play card')
	if (!target || typeof target !== 'string') throw new Error(`Wrong target to play card: ${target}`)

	// Move card from hand to discard pile.
	let newState = discardCard(state, {card})

	newState = produce(newState, draft => {
		// Use energy
		draft.player.currentEnergy = newState.player.currentEnergy - card.energy

		// Block is expected to always target the player.
		if (card.block) {
			draft.player.block = newState.player.block + card.block
		}
	})

	// Deal damage to target.
	if (card.damage) {
		newState = removeHealth(newState, {target, amount: card.damage})
	}

	// Powers
	if (card.powers) newState = applyCardPowers(newState, {card})

	return newState
}

// The `target` argument should be a string. See utils.js#getMonster
function addHealth(state, {target, amount}) {
	const monster = getMonster(state, target)
	return produce(state, draft => {
		getMonster(draft, target).currentHealth = monster.currentHealth + amount
	})
}

const removeHealth = (state, {target, amount}) => {
	const monster = getMonster(state, target)
	// Adjust damage if the monster is vulnerable.
	if (monster.powers.vulnerable) {
		amount = powers.vulnerable.use(amount)
	}

	return produce(state, draft => {
		getMonster(draft, target).currentHealth = monster.currentHealth - amount
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
				state.dungeon.rooms[state.dungeon.roomNumber].monsters.forEach(monster => {
					const newStacks = (monster.powers[name] || 0) + stacks
					// @todo for now we just apply to one
					draft.dungeon.rooms[state.dungeon.roomNumber].monsters[0].powers[name] = newStacks
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
		state.dungeon.rooms[state.dungeon.roomNumber].monsters.forEach(monster => {
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
	setDungeon
}

// Additional actions to consider copy/pasted from sts base mod

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
