export default {
	name: 'Red Bash',
	type: 'attack',
	energy: 1,
	target: 'enemy',
	description: 'Apply 5 red, deal that much damage.',
	image: 'clasha.png',
	damage: 0,
    powers: {
		red: 5,
	},
	actions: [

		{
			type: 'dealDamageEqualToRed',
		},

		{
			type: 'setPower',
			parameter: {
				power: 'red',
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
	]
	return {
		...card,
		energy: 0,
	}
}
