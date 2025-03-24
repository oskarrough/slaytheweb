export default {
	name: 'Shiv',
	type: 'attack',
	energy: 0,
	target: 'enemy',
	damage: 4,
	description: 'Deal 4 damage. Exhaust.',
	image: 'sword.png',
}

export const upgrade = (card) => {
	return {
		...card,
		damage: 6,
		description: 'Deal 6 damage. Exhaust.',
	}
}