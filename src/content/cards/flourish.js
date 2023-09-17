const flourish = {
	name: 'Flourish',
	type: 'skill',
	energy: 2,
	target: 'player',
	description: 'Gain 5 Regen. Can only be played if your health is below 50%.',
	image: '5.jpg',
	powers: {
		regen: 5,
	},
	conditions: [
		{
			type: 'healthPercentageBelow',
			percentage: 50,
		},
	],
}

export default flourish

export const upgrade = (card) => {
	const a = card.conditions.find((action) => action.type === 'healthPercentageBelow')
	a.percentage = 75
	return {
		...card,
		description: 'Gain 5 Regen. Can only be played if your health is below 75%.',
	}
}
