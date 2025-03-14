export default {
	name: 'Blue Defend',
	type: 'skill',
	energy: 1,
	block: 5,
	target: 'enemy',
	description: 'Gain 5 block. Apply 3 blue.',
	image: '2.jpg',
	powers: {
		blue: 3,
	},
}

export const upgrade = (card) => {
	return {
		...card,
		block: 7,
		description: 'Gain 7 block. Apply 5 blue.',
		powers: {
			blue: 5,
		},
	}
}
