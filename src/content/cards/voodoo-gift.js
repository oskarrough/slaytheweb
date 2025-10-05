export default {
	name: 'Voodoo Gift',
	energy: 0,
	type: 'attack',
	target: 'enemy',
	description: "Deal damage equal to target's Vulnerable and Weak and remove the debuffs.",
	image: 'voodoo-education.png',
	actions: [
		{
			type: 'dealDamageEqualToWeak',
		},
		{
			type: 'dealDamageEqualToVulnerable',
		},
		{
			type: 'setPower',
			parameter: {
				power: 'weak',
				amount: 0,
			},
		},
		{
			type: 'setPower',
			parameter: {
				power: 'vulnerable',
				amount: 0,
			},
		},
	],
}

export const upgrade = (card) => {
	// remove the "reset of monster power"
	card.actions = [
		{
			type: 'dealDamageEqualToWeak',
		},
		{
			type: 'dealDamageEqualToVulnerable',
		},
	]
	return {
		...card,
		damage: 9,
		description: `${card.description} but without resets.`,
	}
}
