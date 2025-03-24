export default {
	name: 'Die Die Die',
	type: 'attack',
	energy: 1,
	damage: 13,
	target: 'allEnemies',
	description: 'Deal 13 damage to ALL enemies. Exhaust.',
	image: 'vernal-equinox.jpg',
	exhaust: true,
}

export const upgrade = (card) => ({
	...card,
	damage: 17,
	description: 'Deal 17 damage to ALL enemies. Exhaust.',
})
