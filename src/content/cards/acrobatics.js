export default {
	name: 'Acrobatics',
	type: 'skill',
	energy: 1,
	damage: 0,
	target: 'player',
	actions: [
		{
			type: 'drawCards',
			parameter: {
				amount: 2,
			},
		},
	],
	description: 'Draw 2 cards.',
	image: 'serpentine-dancer.jpg',
}

export const upgrade = (card) => {
	const a = card.actions.find((action) => action.type === 'drawCards')
	a.parameter.amount = 3
	return {
		...card,
		description: 'Draw 3 cards.',
	}
}
