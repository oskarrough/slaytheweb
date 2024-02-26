// SuckerPunch.js
export default {
	name: 'Sucker Punch',
	type: 'attack',
	energy: 1,
	damage: 7,
	target: 'enemy',
	powers: {
		weak: 1,
	},
	description: 'Deal 7 damage. Apply 1 Weak.',
	image: 'manicule.jpg',
}

export const upgrade = (card) => ({
	...card,
	damage: 8,
	powers: {
		weak: 2,
	},
	description: 'Deal 8 damage. Apply 2 Weak.',
})
