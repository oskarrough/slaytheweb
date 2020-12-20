import {uuid} from './utils.js'
import actionMethods from './actions.js'
import * as conditionMethods from './conditions.js'
import cards from '../content/cards.js'

/*
	This file contains the logic to create cards.
	While cards are described in an object form, they are always converted to a class equivalent.

	You can find cards themselves in content/cards.js

	Cards can _optionally_ define an array of actions named `actions`. These actions will be run when the card is played.
	In the same way, you can define a list of `conditions` that have to pass for the card to be playable.
	Your "actions" actions can ALSO define a list of conditions.
*/

// All cards extend this class.
/*
this.card = {
	name: enum,
	type: enum, // [ATTACK, SKILL, POWER, STATUS, CURSE]
	energy: number,
	target: enum, // [player, enemy, all enemies] @todo? [NONE, SELF_AND_ENEMY, ALL]
	description: string,
	powers: {
		regen: number,
		vulnerable: number,
		weak: number
	},
	actions: [
		type: enum,
		parameter: object,
		condition: condition
	]
	conditions: [
		{
			type: enum
			.. more optinal props
		}
	]
}
color = [RED, GREEN, BLUE, PURPLE, COLORLESS, CURSE]
rarity = [BASIC, SPECIAL, COMMON, UNCOMMON, RARE, CURSE]
*/
export class Card {
	constructor(props) {
		this.id = uuid()
		this.name = props.name
		this.type = props.type
		this.energy = props.energy
		this.target = props.target
		this.damage = props.damage
		this.block = props.block
		this.powers = props.powers
		this.description = props.description
		this.conditions = props.conditions
		this.actions = props.actions
		if (props.upgrade) this.upgrade = props.upgrade
	}
	// Runs through a list of actions and return the updated state.
	// Called when the card is played. Use it for more advanced cards.
	use(state, {target /*, card*/}) {
		if (!this.actions) return state
		let newState = state
		this.actions.forEach((action) => {
			// Don't run action if it has an invalid condition.
			if (action.conditions && !canPlay(action.conditions, state)) {
				return newState
			}
			// Make sure the action is called with a target.
			if (!action.parameter) action.parameter = {}
			action.parameter.target = target
			// Run the action
			newState = actionMethods[action.type](newState, action.parameter)
		})
		return newState
	}
	canPlay(state) {
		return canPlay(this.conditions, state)
	}
	upgrade() {
		if (this.upgraded) return
		// this.name = 'Name+', this.damage = 666
		// etc...
	}
}

// Returns false if at least one condition fails
function canPlay(conditions, state) {
	let boolean = false
	conditions.forEach((condition) => {
		if (!boolean && conditionMethods[condition.type]) {
			boolean = conditionMethods[condition.type](state, condition)
		}
	})
	return boolean
}

// Turns a plain object card into a class-based one.
// We do this so we can define the cards without using class syntax.
export function createCard(name) {
	const baseCard = cards.find((card) => card.name === name)
	if (!baseCard) throw new Error(`Card not found: ${name}`)
	return new Card(baseCard)
}

// Returns X amount of random cards.
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

// Returns X random, nicer and unique cards.
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
