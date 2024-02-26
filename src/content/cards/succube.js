// Succube.js
export default {
	name: 'Succube',
	type: 'attack',
	energy: 3,
	target: 'allEnemies',
	description: 'Deal 2 damage to ALL enemies and suck it into life.',
	image: 'succube.png',
	damage: 2,
	actions: [
		{
			type: 'addRegenEqualToAllDamage',
		},
	],
}

export const upgrade = (card) => ({
	...card,
	name: 'High Succube+',
	damage: 3,
	description: 'Deal 3 damage to ALL enemies and suck it into life.',
})
