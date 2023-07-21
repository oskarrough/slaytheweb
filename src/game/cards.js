import {uuid} from './utils.js'
import cards from '../content/cards.js'

// This file contains the logic to create cards.
// While cards are described in plain object form, they are always converted to a class equivalent.
// The actual cards belong in content/cards.js.

/** @enum {string} */
export const CardTypes = {
	attack: 'attack',
	skill: 'skill',
	power: 'power',
	status: 'status',
	curse: 'curse',
}

/** @enum {string} - must be either "player", "enemyx" (where x is the index) or "allEnemies" */
export const CardTargets = {
	player: 'player',
	enemy: 'enemy',
	allEnemies: 'allEnemies',
}

/**
 * @typedef {object} CARDPOWERS
 * @prop {number=} regen
 * @prop {number=} vulnerable
 * @prop {number=} weak
 */

/**
 * All cards extend this class.
 * @typedef CARD
 * @prop {string=} id
 * @prop {string} name
 * @prop {string} description
 * @prop {string} image
 * @prop {number} energy
 * @prop {CardTypes} type - specifies the type of card
 * @prop {number} [damage] - damages the target.
 * @prop {number} [block] - applies block to the target.
 * @prop {CardTargets} target - a special "target" string to specify which targets the card affects.
 * color = [RED, GREEN, BLUE, PURPLE, COLORLESS, CURSE]
 * rarity = [BASIC, SPECIAL, COMMON, UNCOMMON, RARE, CURSE]
 * @prop {boolean} exhaust - whether the card will exhaust when played.
 *
 * @prop {CARDPOWERS} [powers] - Cards can apply POWERS with the `powers` object. Powers are hardcoded in the game actions, but feel free to add more.
 * @prop {Array<CardAction>} [actions] - Cards can _optionally_ define a list of `actions`. These actions will be run, in defined order, when the card is played.
 * @prop {Array<{type: string}>} [conditions] - In the same way, you can define a list of `conditions` that have to pass for the card to be playable. You can even add conditions directly on your actions.
 * @prop {Function} [use]
 */

/**
 * @typedef {Object} CardAction - allows the card to run all defined actions
 * @prop {string} type - name of the action to call. See game/actions.js
 * @prop {Object} [parameter] - props to pass to the action
 * @prop {Array<{type: string}>} [conditions] - list of conditions
 */

export class Card {
	/** @param {CARD} props */
	constructor(props) {
		this.id = uuid()
		this.name = props.name
		this.type = CardTypes[props.type]
		this.energy = props.energy
		this.target = CardTargets[props.target]
		this.damage = props.damage
		this.block = props.block
		this.powers = props.powers
		this.description = props.description
		this.conditions = props.conditions
		this.actions = props.actions
		this.image = props.image
		this.upgraded = false
		this.exhaust = props.exhaust
	}
}

/**
 * Returns the POJO card definition. Not to be confused with createCard().
 * @param {string} name
 * @returns {CARD}
 */
function findCard(name) {
	return cards.find((card) => card.name === name)
}

/**
 * Creates a new card. Turns a plain object card into a class-based one.
 * We do this so we can define the cards without using class syntax.
 * @param {string} name - exact name of the Card
 * @returns {CARD}
 */
export function createCard(name, upgrade) {
	let baseCard = findCard(name)
	if (!baseCard) throw new Error(`Card not found: ${name}`)

	if (upgrade) {
		baseCard = Object.assign({}, baseCard)
		baseCard.upgrade()
	}

	const {...obj} = new Card(baseCard)
	return obj
}

/**
 * Returns {amount} of random cards from a {list}
 * @param {array} list - collection of POJO cards
 * @param {number} amount - how many
 * @returns {array} results
 */
export function getRandomCards(list, amount) {
	const cardNames = list.map((card) => card.name)
	let results = []
	for (let i = 0; i < amount; i++) {
		const randomIndex = Math.floor(Math.random() * cardNames.length)
		const name = cardNames[randomIndex]
		const card = createCard(name)
		results.push(card)
	}
	return results
}

/**
 * Returns X random, nicer and unique cards.
 * @param {number} [amount]
 * @returns {Array.<CARD>}
 */
export function getCardRewards(amount = 3) {
	// Remove boring cards from rewards.
	const niceCards = cards
		.filter((card) => card.name !== 'Strike')
		.filter((card) => card.name !== 'Defend')
	// List of random card rewards.
	const rewards = []
	while (rewards.length < amount) {
		const card = getRandomCards(niceCards, 1)[0]
		// Avoid duplicates
		const isDuplicate = Boolean(rewards.find((c) => c.name === card.name))
		if (!isDuplicate) {
			rewards.push(card)
		}
	}
	return rewards
}
