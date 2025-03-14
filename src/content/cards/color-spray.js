export default {
	name: 'Color Spray',
	type: 'attack',
	energy: 0,
	target: 'allEnemies',
	description: 'Apply 1 red AND blue to ALL enemies.',
	image: '2.jpg',
	powers: {
		blue: 1,
		red: 1,
	},
}

export const upgrade = (card) => {
	return {
		...card,
		description: 'Apply 2 red AND blue to ALL enemies.',
		powers: {
			blue: 2,
			red: 2,
		},
	}
}
