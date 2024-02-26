export default {
	name: 'Iron Wave',
	type: 'attack',
	energy: 1,
	damage: 5,
	block: 5,
	target: 'enemy',
	description: 'Deal 5 damage. Gain 5 Block.',
	image: 'henry-stares-back.jpg',
}

export const upgrade = (card) => ({
	...card,
	damage: 7,
	block: 7,
	description: 'Deal 7 damage. Gain 7 Block.',
})
