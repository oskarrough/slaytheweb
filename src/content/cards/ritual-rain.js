export default {
	name: 'Ritual Rain',
	type: 'skill',
	energy: 2,
	target: 'player',
	description: 'Dispel your Weaknesses and Vulnerabilities.',
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
		description: 'Dispel your Weaknesses and Vulnerabilities. Gain 10 Block.',
		block: 10,
	}
}
