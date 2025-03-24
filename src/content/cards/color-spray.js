export default {
	name: 'Color Spray',
	type: 'attack',
	energy: 0,
	target: 'allEnemies',
	description: 'Apply 2 red AND blue to ALL enemies.',
	image: 'color.png',
	powers: {
		blue: 2,
		red: 2,
	},
}

export const upgrade = (card) => {
	return {
		...card,
		description: 'Apply 2 red AND blue to ALL enemies. Also apply 1 vulnerable.',
		powers: {
			blue: 2,
			red: 2,
			vulnerable: 1,
		},
	}
}
