import {getPlayerHealthPercentage} from '../game/utils-state.js'
/**
 * Conditions decide whether a card can be played or not.
 * @typedef {Object} Condition — all other props will be passed to the condition as well
 * @prop {string} type
 * @prop {string=} cardType
 * @prop {number=} percentage
 */

/** returns number — if all cards in your hand are of the same type */
export function onlyType(state, condition) {
	return state.hand.every((card) => card.type === condition.cardType)
}

/** @returns boolean  - true if hp is ABOVE condition.percentage */
export function healthPercentageAbove(state, condition) {
	return getPlayerHealthPercentage(state) > condition.percentage
}

/** @returns boolean - true if hp is below condition.percentage */
export function healthPercentageBelow(state, condition) {
	return getPlayerHealthPercentage(state) < condition.percentage
}

/**
 * Validates a list of conditions on a game state.
 * @param {Array.<{type: string}>} conditions
 * @param {object} state
 * @returns {boolean}
 */
export function conditionsAreValid(conditions, state) {
	let isValid = true
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
 * @param {object} card
 * @param {object} state
 * @returns {boolean}
 */
export function canPlay(card, state) {
	if (!state) return false
	const cardIsInHand = Boolean(state.hand.find((c) => c.id === card.id))
	const enoughEnergy = state.player.currentEnergy >= card.energy
	const allowedToPlay = conditionsAreValid(card.conditions, state)
	return cardIsInHand && enoughEnergy && allowedToPlay
}

const allConditions = {
	onlyType,
	healthPercentageAbove,
	healthPercentageBelow,
}

export default allConditions
