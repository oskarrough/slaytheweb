export default {
	name: 'Ritual Rain',
	type: 'skill',
	energy: 2,
	target: 'player',
	description: 'Remove your Weaknesses and Vulnerabilities.',
	image: 'ritual-rain.png',
	damage: 0,
	actions: [
		{
			type: 'removePlayerDebuffs',
		},
	],
}

export const upgrade = (card) => {
	return {
		...card,
		name: 'Eventual Rain',
		description: 'Remove your weaknesses and vulnerabilities. Gain 10 Block.',
		block: 10,
	}
}
