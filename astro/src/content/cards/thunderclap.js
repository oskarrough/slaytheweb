export default {
	name: 'Thunderclap',
	type: 'attack',
	energy: 1,
	damage: 4,
	target: 'allEnemies',
	powers: {
		vulnerable: 1,
	},
	description: 'Deal 4 Damage. Apply 1 Vulnerable to all enemies.',
	image: '4.jpg',
}

export const upgrade = (card) => {
	return {
		...card,
		damage: 6,
		description: 'Deal 6 Damage. Apply 1 Vulnerable to all enemies.',
	}
}
