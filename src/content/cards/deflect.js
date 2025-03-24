export default {
	name: 'Deflect',
	energy: 0,
	type: 'skill',
	target: 'player',
	damage: 0,
	block: 4,
	description: 'Gain 4 Block.',
	image: 'voodoo-education.png',
}

export const upgrade = (card) => {
	return {
		...card,
		block: 7,
		description: 'Gain 7 Block.',
	}
}
