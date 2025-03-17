export default {
	name: 'Blue Strike',
	type: 'attack',
	energy: 1,
	damage: 5,
	target: 'enemy',
	description: 'Deal 5 Damage. Apply 3 blue.',
	image: '2.jpg',
	powers: {
		blue: 3,
	},
}

export const upgrade = (card) => {
	return {
		...card,
		damage: 7,
		description: 'Deal 7 Damage. Apply 5 blue.',
		powers: {
			blue: 5,
		},
	}
}
