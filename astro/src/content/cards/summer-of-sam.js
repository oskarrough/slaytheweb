export default {
	name: 'Summer of Sam',
	type: 'skill',
	energy: 1,
	target: 'player',
	description: 'Gain 1 Health. Draw 2 Cards if your health is below 50%.',
	image: 'bare-feet-of-god.jpg',
	actions: [
		{
			type: 'addHealth',
			parameter: {
				amount: 1,
			},
		},
		{
			type: 'drawCards',
			parameter: {
				amount: 2,
			},
			conditions: [
				{
					type: 'healthPercentageBelow',
					percentage: 50,
				},
			],
		},
	],
}

export const upgrade = (card) => {
	// An example of how to upgrade a local action.
	const a = card.actions.find((action) => action.type === 'addHealth')
	a.parameter.amount = 2
	return {
		...card,
		description: 'Gain 2 Health. Draw 2 Cards if your health is below 50%.',
	}
}
