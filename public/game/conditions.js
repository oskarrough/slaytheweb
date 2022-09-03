/**
 * Conditions decide whether a card can be played or not.
 * @typedef {Object} Condition — all other props will be passed to the condition as well
 * @prop {string} type
 */

/**
 * Returns true if at least one condition fails on the state
 * @param {Array.<Condition>} conditions
 * @param {object} state
 * @returns {boolean}
 */
export function conditionsAreValid(conditions, state) {
	let isValid = true
	if (conditions) {
		conditions.forEach((condition) => {
			if (!isValid && allConditions[condition.type]) {
				isValid = allConditions[condition.type](state, condition)
			}
		})
	}
	return isValid
}

/**
 * Returns true if the card can be played
 * @param {object} state
 * @param {object} card
 * @returns {boolean}
 */
export function canPlay(card, state) {
	if (!state) return false
	const cardIsInHand = Boolean(state.hand.find((c) => c.id === card.id))
	const enoughEnergy = state.player.currentEnergy >= card.energy
	const allowedToPlay = conditionsAreValid(card.conditions, state)
	console.log({cardIsInHand, enoughEnergy, allowedToPlay})
	return cardIsInHand && enoughEnergy && allowedToPlay
}

/** returns number */
function getPlayerHealthPercentage(state) {
	return (state.player.currentHealth / state.player.maxHealth) * 100
}

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

const allConditions = {
	onlyType,
	healthPercentageAbove,
	healthPercentageBelow,
}

export default allConditions
