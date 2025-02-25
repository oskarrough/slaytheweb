import {uuid} from '../utils.js'
import {cards, cardUpgrades} from '../content/cards.js'

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
 * @typedef {object} CardPowers
 * @prop {number=} regen
 * @prop {number=} vulnerable
 * @prop {number=} weak
 */

/**
 * @typedef {object} CardAction - allows the card to run all defined actions
 * @prop {string} type - name of the action to call. See game/actions.js
 * @prop {object} [parameter] - props to pass to the action
 * @prop {Array<{type: string}>} [conditions] - list of conditions
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
 * @prop {boolean=} exhaust - whether the card will exhaust when played.
 * @prop {boolean=} upgraded
 * @prop {CardPowers} [powers] - Cards can apply POWERS with the `powers` object. Powers are hardcoded in the game actions, but feel free to add more.
 * @prop {Array<CardAction>} [actions] - Cards can _optionally_ define a list of `actions`. These actions will be run, in defined order, when the card is played.
 * @prop {Array<{type: string}>} [conditions] - In the same way, you can define a list of `conditions` that have to pass for the card to be playable. You can even add conditions directly on your actions.
 */

export class Card {
	/** @param {CARD} props */
	constructor(props) {
		this.id = uuid()
		this.name = props.name
		this.type = CardTypes[props.type]
		this.energy = props.energy
		this.target = CardTargets[props.target]
		this.damage = props.damage || 0
		this.block = props.block || 0
		this.powers = props.powers
		this.description = props.description
		this.conditions = props.conditions
		this.actions = props.actions
		this.image = props.image
		this.upgraded = props.upgraded || false
		this.exhaust = props.exhaust || false
	}
}

/**
 * Creates a new card. Turns a plain object card into a class-based one.
 * Very important, we clone the object. Otherwise, all cards would share the same object.
 * We do this so we can define the cards without using class syntax.
 * @param {string} name - exact name of the Card
 * @param {boolean} [shouldUpgrade] - whether to upgrade the card
 * @returns {CARD} a new card
 */
export function createCard(name, shouldUpgrade) {
	if (name.includes('+')) {
		// If it's in the map, use that, otherwise remove the + and set shouldUpgrade
		const baseName = upgradeNameMap[name] || name.replace('+', '')
		return createCard(baseName, true)
	}

	let card = cards.find((card) => card.name === name)
	if (!card) throw new Error(`Card not found: ${name}`)

	if (shouldUpgrade) {
		const upgradeFn = cardUpgrades[name]
		card = upgradeFn(card)
		card.upgraded = true
		if (!card.name.includes('+')) card.name += '+'
	} else {
		// Clone it.
		card = {...card}
	}
	return new Card(card)
}

const upgradeNameMap = {}

// Build the map automatically from cards and their upgrade functions
cards.forEach((card) => {
	const upgradeFn = cardUpgrades[card.name]
	if (upgradeFn) {
		const upgradedCard = upgradeFn(card)
		if (upgradedCard.name !== card.name + '+') {
			upgradeNameMap[upgradedCard.name] = card.name
		}
	}
})

/**
 * Returns X random cards from a list of cards.
 * @param {Array} list - collection of POJO cards
 * @param {number} amount - how many
 * @returns {Array} results
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
 * @returns {Array.<CARD>} a list of cards
 */
export function getCardRewards(amount = 3) {
	// Remove boring cards from rewards.
	const niceCards = cards.filter((card) => card.name !== 'Strike').filter((card) => card.name !== 'Defend')
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
