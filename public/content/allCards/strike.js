export default {
		name: 'Strike',
		type: 'attack',
		energy: 1,
		target: 'enemy',
		damage: 6,
		description: 'Deal 6 Damage.',
		image: 'the-angel-of-death.jpg',
		upgrade() {
			this.damage = 9
			this.upgraded = true
			this.name = 'Strike+'
			this.description = 'Deal 9 Damage.'
		},
	}