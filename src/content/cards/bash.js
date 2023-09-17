export default {
	name: 'Bash',
	type: 'attack',
	energy: 2,
	damage: 8,
	target: 'enemy',
	image: 'apteryx-mantelli.jpg',
	powers: {
		vulnerable: 2,
	},
	description: 'Deal 8 damage. Apply 2 Vulnerable.',
}

export const upgrade = (card) => {
	return {
		...card,
		damage: 10,
		description: 'Deal 10 Block. Apply 3 Vulnerable',
		powers: {
			vulnerable: 3,
		},
	}
}
