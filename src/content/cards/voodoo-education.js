export default {
	name: 'Voodoo Education',
	energy: 0,
	type: 'attack',
	target: 'enemy',
	description: "Deal Damage equal to target's Vulnerable and Weak and remove the debuffs.",
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
		name: 'Voodoo Gift',
		description: card.description + ' but without resets.',
	}
}
