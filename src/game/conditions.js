import {getPlayerHealthPercentage} from './utils-state.js'

/** @typedef {import('./actions.js').State} State */
/** @typedef {import('./cards.js').CARD} Card */

/**
 * Conditions decide whether a card can be played or not.
 * @typedef {object} Condition — all other props will be passed to the condition as well
 * @prop {string} type
 * @prop {string=} cardType
 * @prop {number=} percentage
 */

/**
 * @callback ConditionFn
 * @param {State} State
 * @param {Condition} condition
 * @returns {boolean}
 */

/**
 * Returns true if all cards in your hand are of the same type as condition.cardType
 * @type {ConditionFn}
 */
export function onlyType(state, condition) {
	return state.hand.every((card) => card.type === condition.cardType)
}

/**
 * Returns true if player health is above condition.percentage
 * @type {ConditionFn}
 */
export function healthPercentageAbove(state, condition) {
	return getPlayerHealthPercentage(state) > condition.percentage
}

/**
 * Returns true if player health is below condition.percentage
 * @type {ConditionFn}
 */
export function healthPercentageBelow(state, condition) {
	return getPlayerHealthPercentage(state) < condition.percentage
}

/**
 * Returns true if all conditions are valid on a certain game state.
 * @param {State} state
 * @param {Array.<Condition>} conditions
 * @returns {boolean}
 */
export function conditionsAreValid(state, conditions) {
	const isValid = true
	if (conditions) {
		return conditions.every((condition) => {
			const cond = allConditions[condition.type]
			return cond(state, condition)
		})
	}
	return isValid
}

/**
 * Returns true if the card can be played. Checks whether the card is in hand, you have enough energy and any conditions are all valid.
 * @param {State} state
 * @param {Card} card
 * @returns {boolean}
 */
export function canPlay(state, card) {
	if (!state?.hand) return false
	const cardIsInHand = Boolean(state.hand.find((c) => c.id === card.id))
	const enoughEnergy = state.player.currentEnergy >= card.energy
	const allowedToPlay = conditionsAreValid(state, card.conditions)
	return cardIsInHand && enoughEnergy && allowedToPlay
}

const allConditions = {
	onlyType,
	healthPercentageAbove,
	healthPercentageBelow,
}

export default allConditions
