export default {
	name: 'Bulwark',
	type: 'skill',
	energy: 2,
	target: 'player',
	block: 16,
	description: 'Gain 16 Block.',
	image: 'shield.png',
}

export const upgrade = (card) => {
	return {
		...card,
		block: 20,
		description: 'Gain 20 Block.',
	}
}
