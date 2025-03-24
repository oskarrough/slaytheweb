export default {
	name: 'Bandage',
	type: 'skill',
	energy: 0,
	target: 'player',
	description: 'Heal 5 HP. Exhaust.',
	image: 'soul-drain.png',
	damage: 0,
	exhaust: true,
	actions: [
		{
			type: 'addHealth',
			parameter: {
				amount: 5,
				target: 'player',
			},
		},
	],
}

export const upgrade = (card) => {
	return {
		...card,
		exhaust: false,
		description: 'Heal 5 HP.',
	}
}
