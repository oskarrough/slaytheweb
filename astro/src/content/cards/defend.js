export default {
	name: 'Defend',
	type: 'skill',
	energy: 1,
	target: 'player',
	block: 5,
	description: 'Gain 5 Block.',
	image: 'angel-messenger.jpg',
}

export const upgrade = (card) => {
	return {
		...card,
		block: 8,
		description: 'Gain 8 Block.',
	}
}
