// @todo implement posion before using this card

export default {
	name: 'Deadly Poison',
	type: 'attack',
	energy: 1,
	damage: 0,
	target: 'enemy',
	powers: {
		poison: 5,
	},
	description: 'Apply 5 poison.',
	image: '6.jpg',
}

export const upgrade = (card) => {
	return {
		...card,
		powers: {
			poison: 7,
		},

		description: 'Apply 7 Poison',
	}
}
