export default {
	name: 'Bludgeon',
	type: 'attack',
	energy: 3,
	target: 'enemy',
	damage: 32,
	description: 'Deal 32 Damage.',
	image: 'alice-holds-the-white-king.jpg',
}

export const upgrade = (card) => {
	return {
		...card,
		damage: 42,
		description: 'Deal 42 Damage.',
	}
}
