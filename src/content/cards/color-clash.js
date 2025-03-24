export default {
	name: 'Color Clash',
	type: 'attack',
	energy: 1,
	target: 'enemy',
	description: 'Deal damage equal to red and blue plus three.',
	image: 'clasha.png',
	damage: 3,
	actions: [
		{
			type: 'dealDamageEqualToRed',
		},
		{
			type: 'dealDamageEqualToBlue',
		},
		{
			type: 'setPower',
			parameter: {
				power: 'red',
				amount: 0,
			},
		},
		{
			type: 'setPower',
			parameter: {
				power: 'blue',
				amount: 0,
			},
		},
	],
}

export const upgrade = (card) => {
	// remove the "reset of monster power"
	card.actions = [
		{
			type: 'dealDamageEqualToRed',
		},
		{
			type: 'dealDamageEqualToBlue',
		},
	]
	return {
		...card,
		energy: 0,
	}
}
