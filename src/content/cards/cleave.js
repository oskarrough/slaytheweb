export default {
	name: 'Cleave',
	type: 'attack',
	energy: 1,
	damage: 8,
	target: 'allEnemies',
	description: 'Deal 8 damage to all enemies.',
	image: 'vernal-equinox.jpg',
}

export const upgrade = (card) => ({
	...card,
	damage: 11,
	description: 'Deal 11 damage to all enemies.',
})
