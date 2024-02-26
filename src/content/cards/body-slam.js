export default {
	name: 'Body Slam',
	energy: 1,
	type: 'attack',
	target: 'enemy',
	description: 'Deal damage equal to your Block.',
	image: 'fallback.jpg',
	actions: [
		{
			type: 'dealDamageEqualToBlock',
		},
	],
}

export const upgrade = (card) => {
	return {
		...card,
		energy: 0,
	}
}
