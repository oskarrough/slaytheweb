export default {
	name: 'Dash',
	type: 'attack',
	energy: 2,
	damage: 10,
	block: 10,
	target: 'enemy',
	description: 'Gain 10 block. Deal 10 Damage',
	image: '4.jpg',
}

export const upgrade = (card) => {
	return {
		...card,
		damage: 13,
		block: 13,
		description: 'Gain 13 block. Deal 13 Damage',
	}
}
