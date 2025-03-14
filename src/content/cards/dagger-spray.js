export default {
	name: 'Dagger Spray',
	type: 'attack',
	energy: 1,
	damage: 8,
	target: 'allEnemies',
	description: 'Deal 4 damage to all enemies, TWICE.',
	image: 'vernal-equinox.jpg',
}

export const upgrade = (card) => ({
	...card,
	damage: 12,
	description: 'Deal 6 damage to all enemies, TWICE.',
})
