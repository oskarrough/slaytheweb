export default {
	name: 'Blue Bash',
	type: 'attack',
	energy: 1,
	target: 'enemy',
	description: 'Apply 5 blue, deal that much damage.',
	image: 'clasha.png',
	damage: 0,
    powers: {
		blue: 5,
	},
	actions: [

		{
			type: 'dealDamageEqualToBlue',
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
			type: 'dealDamageEqualToBlue',
		},
	]
	return {
		...card,
		energy: 0,
	}
}
