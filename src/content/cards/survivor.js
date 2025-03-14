export default {
	name: 'Survivor',
	type: 'skill',
	energy: 1,
	block: 8,
	target: 'player',
	description: 'Gain 8 Block.',
	image: 'ritual-rain.png',
	damage: 0,
}

export const upgrade = (card) => {
	return {
		...card,
		description: 'Gain 11 Block.',
		block: 11,
	}
}
