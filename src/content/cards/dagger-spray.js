export default {
	name: 'Dagger Spray',
	type: 'attack',
	energy: 1,
	damage: 4,
	damage: 4,
	target: 'allEnemies',
	description: 'Deal 4 damage to all enemies, TWICE.',
	image: 'vernal-equinox.jpg',
}

export const upgrade = (card) => ({
	...card,
	damage: 6,
	description: 'Deal 4 damage to all enemies, TWICE.',
})
