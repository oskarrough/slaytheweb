export default {
	name: 'Intimidate',
	type: 'skill',
	energy: 0,
	damage: 0,
	target: 'allEnemies',
	powers: {
		weak: 1,
	},
	description: 'Apply 1 Weak to ALL enemies. Exhaust.',
	image: 'poured-millions-of-bubbles.jpg',
	exhaust: true,
}

export const upgrade = (card) => {
	card.powers.weak = 2
	return {
		...card,
		description: 'Apply 2 Weak to ALL enemies. Exhaust.',
	}
}
