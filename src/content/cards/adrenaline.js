export default {
	name: 'Adrenaline',
	type: 'skill',
	energy: 0,
	damage: 0,
	target: 'player',
	exhaust: true,
	actions: [
		{
			type: 'addEnergyToPlayer',
			parameter: {
				amount: 1,
			},
		},
		{
			type: 'drawCards',
			parameter: {
				amount: 2,
			},
		},
	],
	description: 'Gain 2 Energy. Draw 2 cards. Exhaust',
	image: 'serpentine-dancer.jpg',
}

export const upgrade = (card) => {
	const a = card.actions.find((action) => action.type === 'addEnergyToPlayer')
	a.parameter.amount = 2
	return {
		...card,
		block: 10,
		description: 'Gain 2 Energy. Draw 2 cards. Gain 10 block. Exhaust',
	}
}
