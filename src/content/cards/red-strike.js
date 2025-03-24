export default {
	name: 'Red Strike',
	type: 'attack',
	energy: 1,
	damage: 5,
	target: 'enemy',
	description: 'Deal 5 Damage. Apply 3 red.',
	image: 'sworda.png',
	powers: {
		red: 3,
	},
}

export const upgrade = (card) => {
	return {
		...card,
		damage: 7,
		description: 'Deal 7 Damage. Apply 5 red.',
		powers: {
			red: 5,
		},
	}
}
