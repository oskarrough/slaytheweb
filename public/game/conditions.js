/**
 * Conditions that decide whether a card can be played or not.
 * @typedef {Object} Condition — all other props will be passed to the condition as well
 * @prop {string} type
 */

/**
 * Returns true if at least one condition fails on the state
 * @param {Array.<Condition>} conditions
 * @param {object} state
 * @returns boolean
 */
export function checkConditions(conditions, state) {
	let boolean = false
	conditions.forEach((condition) => {
		if (!boolean && allConditions[condition.type]) {
			boolean = allConditions[condition.type](state, condition)
		}
	})
	return boolean
}

/** returns number — if all cards in your hand are of the same type */
export function onlyType(state, condition) {
	return state.hand.every((card) => card.type === condition.cardType)
}

/** returns number */
function getPlayerHealthPercentage(state) {
	return (state.player.currentHealth / state.player.maxHealth) * 100
}

/** @returns boolean  - true if hp is ABOVE condition.percentage */
export function healthPercentageAbove(state, condition) {
	return getPlayerHealthPercentage(state) > condition.percentage
}

/** @returns boolean - true if hp is below condition.percentage */
export function healthPercentageBelow(state, condition) {
	return getPlayerHealthPercentage(state) < condition.percentage
}

const allConditions = {
	onlyType,
	healthPercentageAbove,
	healthPercentageBelow,
}

export default allConditions
