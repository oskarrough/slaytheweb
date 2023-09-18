// SoulDrain.js
export default {
	name: 'Soul Drain',
	type: 'attack',
	energy: 1,
	target: 'allEnemies',
	description: 'Drain 3 Health into Weakness and Vulnerability.',
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
		name: 'Lower Soul Drain',
		powers: {
			weak: 4,
			vulnerable: 4,
		},
		description: 'Drain 4 Health into Weakness and Vulnerability.',
	}
}
