// Succube.js
export default {
	name: 'Slice',
	type: 'attack',
	energy: 0,
	damage: 6,
	target: 'enemy',
	description: 'Deal 6 damage.',
	image: 'manicule.jpg',
}

export const upgrade = (card) => {
	return {
		...card,
		damage: 9,
		description: 'Deal 9 damage.',
	}
}
