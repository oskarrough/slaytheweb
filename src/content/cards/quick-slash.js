export default {
	name: 'Quick Slash',
	type: 'attack',
	energy: 1,
	target: 'enemy',
	description: 'Deal 8 damage. Draw 1 card.',
	image: '8.jpg',
	damage: 8,
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
	return {
		...card,
		damage: 12,
		description: 'Deal 12 damage. Draw 1 card.',
	}
}
