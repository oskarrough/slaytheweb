export default {
	name: 'Bludgeon',
	type: 'attack',
	energy: 3,
	target: 'enemy',
	damage: 24,
	description: 'Deal 24 Damage.',
	image: 'alice-holds-the-white-king.jpg',
}

export const upgrade = (card) => {
	return {
		...card,
		damage: 36,
		description: 'Deal 36 Damage.',
	}
}
