export default {
	name: 'Backflip',
	type: 'skill',
	energy: 1,
	target: 'player',
	block: 5,
	description: 'Gain 5 block, draw 2 cards.',
	image: 'bare-feet-of-god.jpg',
	actions: [
		{
			type: 'drawCards',
			parameter: {
				amount: 2,
			},
		},
	],
}

export const upgrade = (card) => {
	return {
		...card,
		block: 8,
		description: 'Gain 8 block, draw 2 cards.',
	}
}
