export default {
	name: 'Strike',
	type: 'attack',
	energy: 1,
	target: 'enemy',
	damage: 6,
	description: 'Deal 6 damage.',
	image: 'the-angel-of-death.jpg',
}

export const upgrade = (card) => {
	return {
		...card,
		damage: 9,
		description: 'Deal 9 damage.',
	}
}
