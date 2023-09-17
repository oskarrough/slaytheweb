export default {
	name: 'Adrenaline',
	type: 'skill',
	energy: 0,
	damage: 0,
	target: 'player',
	actions: [
		{
			type: 'drawCards',
			parameter: {
				amount: 2,
			},
		},
		{
			type: 'addEnergyToPlayer',
			parameter: {
				amount: 1,
			},
		},
	],
	description: 'Gain 1 Energy. Draw 2 cards. Exhaust.',
	image: 'serpentine-dancer.jpg',
	exhaust: true,
}

export const upgrade = (card) => {
	const a = card.actions.find((action) => action.type === 'addEnergyToPlayer')
	a.parameter.amount = 2
	return {
		...card,
		description: 'Gain 2 Energy. Draw 2 Cards. Exhaust.',
	}
}
