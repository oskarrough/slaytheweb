// Clash.js
export default {
	name: 'Clash',
	type: 'attack',
	energy: 0,
	damage: 14,
	target: 'enemy',
	conditions: [
		{
			type: 'onlyType',
			cardType: 'attack',
		},
	],
	description: 'Can only be played if every card in your hand is an Attack. Deal 14 damage.',
	image: 'h-sperling-horrified.jpg',
}

export const upgrade = (card) => ({
	...card,
	damage: 17,
	description: 'Can only be played if every card in your hand is an Attack. Deal 17 damage.',
})
