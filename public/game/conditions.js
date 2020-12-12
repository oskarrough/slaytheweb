// Returns true if all cards in your hand are of the same type.
function onlyType(state, condition) {
	return state.hand.some((card) => {
		return card.type !== condition.cardType
	})
}

// Returns true if hp is below condition.percentage
function healthPercentageBelow(state, condition) {
	const player = state.player
	const percentage = (player.currentHealth / player.maxHealth) * 100
	return percentage < condition.percentage
}

// Returns true if hp is above condition.percentage
function healthPercentageAbove(state, condition) {
	const player = state.player
	const percentage = (player.currentHealth / player.maxHealth) * 100
	return percentage > condition.percentage
}

export default {
	onlyType,
	healthPercentageBelow,
	healthPercentageAbove,
}
