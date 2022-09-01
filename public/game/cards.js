import {uuid} from './utils.js'
import actionMethods from './actions.js'
import * as conditionMethods from './conditions.js'
import cards from '../content/cards.js'

/*
	This file contains the logic to create cards.
	While cards are described in an object form, they are always converted to a class equivalent.

	You can find cards themselves in content/cards.js

	Cards can deal DAMAGE with the `damage` property.
	Cards can apply BLOCK with the `block` property.
	Cards can apply POWERS with the `powers` object. Powers are hardcoded in the game actions, but feel free to add more.
	Cards can _optionally_ define a list of `actions`. These actions will be run, in defined order, when the card is played.
	In the same way, you can define a list of `conditions` that have to pass for the card to be playable.
	You can even add conditions directly on your actions.
*/

/**
 * @typedef {Object} CardAction - allows the card to run all defined actions
 * @prop {string} type - name of the action to call. See game/actions.js
 * @prop {Object} [parameter] - props to pass to the action
 * @prop {Array.<Condition>} [conditions] - list of conditions
 */

/**
 * @typedef {Object} Condition — all other props will be passed to the condition as well
 * @prop {string} type
 */

/**
 * @typedef {string} CardType
 */
export const CardTypes = {
	attack: 'attack',
	skill: 'skill',
	power: 'power',
	status: 'status',
	curse: 'curse',
}

/**
 * @typedef CARDPOWERS
 * @prop {number=} regen
 * @prop {number=} vulnerable
 * @prop {number=} weak
 */

/**
 * @typedef CARD
 * @prop {string} name
 * @prop {string} description
 * @prop {string} image
 * @prop {number} energy
 * @prop {number} [damage]
 * @prop {number} [block]
 * @prop {CardType} type
 * @prop {TargetTypes} target
 * color = [RED, GREEN, BLUE, PURPLE, COLORLESS, CURSE]
 * rarity = [BASIC, SPECIAL, COMMON, UNCOMMON, RARE, CURSE]
 *
 * @prop {CARDPOWERS} [powers]
 * @prop {Array.<CardAction>} [actions]
 * @prop {Array.<Condition>} [conditions]
 * @prop {Function} [use]
 * @prop {*} upgrade
 */

/**
 * @typedef {string} TargetTypes
 * @param {string} player
 */
export const TargetTypes = {
	player: 'player',
	enemy: 'enemy',
	'all enemies': 'all enemies',
	// @todo? [NONE, SELF_AND_ENEMY, ALL]
}

/**
 * All cards extend this class.
 * @typedef CARD_CLASS
 * @type CARD
 */
export class Card {
	/** @param {CARD} props */
	constructor(props) {
		this.id = uuid()
		this.name = props.name
		this.type = CardTypes[props.type]
		this.energy = props.energy
		this.target = TargetTypes[props.target]
		this.damage = props.damage
		this.block = props.block
		this.powers = props.powers
		this.description = props.description
		this.conditions = props.conditions
		this.actions = props.actions
		this.image = props.image
		this.upgraded = false
		if (props.upgrade) this.upgrade = props.upgrade
	}
	/**
	 * Runs through a list of actions and return the updated state.
	 * Called when the card is played.
	 * You CAN overwrite it, just make sure to return a new state.
	 * @param {object} state
	 * @param {object} props
	 * @prop {string} props.target
	 * @prop {object} props.card
	 * @returns {object} state
	 */
	use(state, {target, card}) {
		if (!this.actions) return state
		let newState = state
		this.actions.forEach((action) => {
			// Don't run action if it has an invalid condition.
			if (action.conditions && !checkConditions(action.conditions, state)) {
				return newState
			}
			// Make sure the action is called with a target.
			if (!action.parameter) action.parameter = {}
			// Prefer the target you dropped the card on.
			action.parameter.target = target
			action.parameter.card = card
			// Run the action
			newState = actionMethods[action.type](newState, action.parameter)
		})
		return newState
	}
	canPlay(state) {
		return checkConditions(this.conditions, state)
	}
	upgrade() {
		if (this.upgraded) return
		// this.name = 'Name+', this.damage = 666
		// etc...
	}
}

/**
 * @param {Array.<Condition>} conditions
 * @param {object} state
 * @returns {boolean} true if at least one condition fails on the state
 */
function checkConditions(conditions, state) {
	let boolean = false
	conditions.forEach((condition) => {
		if (!boolean && conditionMethods[condition.type]) {
			boolean = conditionMethods[condition.type](state, condition)
		}
	})
	return boolean
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
 * @returns {CARD_CLASS}
 */
export function createCard(name) {
	const baseCard = findCard(name)
	if (!baseCard) throw new Error(`Card not found: ${name}`)
	return new Card(baseCard)
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
