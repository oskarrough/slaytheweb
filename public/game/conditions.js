// Conditions that decide whether a card can be played or not.

// Returns true if all cards in your hand are of the same type.
export function onlyType(state, condition) {
	return state.hand.every((card) => card.type === condition.cardType)
}

function healthPercentage(state) {
	return (state.player.currentHealth / state.player.maxHealth) * 100
}

// Returns true if hp is below condition.percentage
export function healthPercentageBelow(state, condition) {
	return healthPercentage(state) < condition.percentage
}

// Returns true if hp is above condition.percentage
export function healthPercentageAbove(state, condition) {
	return healthPercentage(state) > condition.percentage
}
