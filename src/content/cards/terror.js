export default {
	name: 'Terror',
	type: 'skill',
	energy: 1,
	damage: 0,
	target: 'enemy',
	powers: {
		vulnerable: 99,
	},
	description: 'Apply 99 Vulnerable. Exhaust.',
	image: '2.jpg',
	exhaust: true,
}

export const upgrade = (card) => {
	return {
		...card,
		energy: 0,
	}
}
