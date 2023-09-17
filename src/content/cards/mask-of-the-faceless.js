export default {
	name: 'Mask of the Faceless',
	type: 'skill',
	energy: 0,
	target: 'player',
	description: 'Gain 1 energy point',
	image: 'mask-of-the-faceless.png',
	damage: 0,
	actions: [
		{
			type: 'addEnergyToPlayer',
			parameter: {
				amount: 1,
			},
		},
	],
}

export const upgrade = (card) => {
	return {
		...card,
		block: 5,
		description: 'Gain 1 energy point and 5 block.',
	}
}
