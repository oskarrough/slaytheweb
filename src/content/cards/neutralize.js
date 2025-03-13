export default {
	name: 'Neutralize',
	type: 'attack',
	energy: 0,
	damage: 3,
	target: 'enemy',
	image: 'apteryx-mantelli.jpg',
	powers: {
		weak: 1,
	},
	description: 'Deal 3 damage. Apply 1 Weak.',
}

export const upgrade = (card) => {
	return {
		...card,
		damage: 4,
		description: 'Deal 4 damage. Apply 2 Weak',
		powers: {
			weak: 2,
		},
	}
}
