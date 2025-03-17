export default {
	name: 'Backstab',
	energy: 0,
	damage: 11,
	type: 'attack',
	target: 'enemy',
	description: 'Deal 11 damage, exhaust.',
	image: 'fallback.jpg',
	exhaust: true,
}

export const upgrade = (card) => {
	return {
		...card,
		damage: 15,
		description: 'Deal 15 damage, exhaust.',
	}
}
