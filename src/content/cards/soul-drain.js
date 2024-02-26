// SoulDrain.js
export default {
	name: 'Soul Drain',
	type: 'attack',
	energy: 1,
	target: 'allEnemies',
	description: 'Apply 3 Weak and Vulnerability to ALL enemies. Drains 3 Health from you.',
	image: 'soul-drain.png',
	damage: 0,
	powers: {
		weak: 3,
		vulnerable: 3,
	},
	actions: [
		{
			type: 'removeHealth',
			parameter: {
				amount: 3,
				target: 'player',
			},
		},
	],
}

export const upgrade = (card) => {
	const a = card.actions.find((action) => action.type === 'removeHealth')
	a.parameter.amount = 4
	return {
		...card,
		powers: {
			weak: 4,
			vulnerable: 4,
		},
		description: 'Apply 4 Weak and Vulnerability to ALL enemies. Drains 3 Health from you.',
	}
}
