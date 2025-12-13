export default {
	name: 'Shiv This',
	type: 'skill',
	energy: 1,
	target: 'player',
	description: 'Discard 2 random cards. Add 3 Shivs to your hand.',
	image: 'h-sperling-horrified.jpg',
	actions: [
		{type: 'discardRandomCards', parameter: {amount: 2}},
		{type: 'createAndAddCardToHand', parameter: {cardName: 'Shiv'}},
		{type: 'createAndAddCardToHand', parameter: {cardName: 'Shiv'}},
		{type: 'createAndAddCardToHand', parameter: {cardName: 'Shiv'}},
	],
}

export const upgrade = (card) => {
	return {
		...card,
		energy: 0,
		description: 'Discard 2 random cards. Add 3 Shivs to your hand.',
	}
}
