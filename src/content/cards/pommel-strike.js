export default {
	name: 'Pommel Strike',
	type: 'attack',
	energy: 1,
	target: 'enemy',
	description: 'Deal 9 damage. Draw 1 card.',
	image: '8.jpg',
	damage: 9,
	actions: [
		{
			type: 'drawCards',
			parameter: {
				amount: 1,
			},
		},
	],
}

export const upgrade = (card) => {
	const a = card.actions.find((action) => action.type === 'drawCards')
	a.parameter.amount = 2
	return {
		...card,
		damage: 10,
		description: 'Deal 10 damage. Draw 2 cards',
	}
}
