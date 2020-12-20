// All our cards.
export default [
	{
		name: 'Defend',
		type: 'Skill',
		energy: 1,
		block: 5,
		target: 'player',
		description: 'Gain 5 Block.',
		upgrade() {
			this.block = 8
			this.upgraded = true
			this.name = 'Defend+'
			this.description = 'Gain 8 Block.'
		},
	},
	{
		name: 'Strike',
		type: 'Attack',
		energy: 1,
		target: 'enemy',
		damage: 6,
		description: 'Deal 6 Damage.',
		upgrade() {
			this.damage = 9
			this.upgraded = true
			this.name = 'Strike+'
			this.description = 'Deal 9 Damage.'
		},
	},
	{
		name: 'Bash',
		type: 'Attack',
		energy: 2,
		damage: 8,
		target: 'enemy',
		powers: {
			vulnerable: 2,
		},
		description: 'Deal 8 damage. Apply 2 Vulnerable.',
		upgrade() {
			this.damage = 10
			this.upgraded = true
			this.name = 'Bash+'
			this.powers.vulnerable = 3
			this.description = 'Deal 10 Damage. Apply 3 Vulnerable'
		},
	},
	{
		name: 'Clash',
		type: 'Attack',
		energy: 0,
		damage: 14,
		target: 'enemy',
		conditions: [
			{
				type: 'onlyType',
				cardType: 'Attack',
			},
		],
		description: 'Can only be played if every card in your hand is an Attack. Deal 14 damage.',
	},
	{
		name: 'Cleave',
		type: 'Attack',
		energy: 1,
		damage: 8,
		target: 'all enemies',
		description: 'Deal 8 damage to ALL enemies.',
		upgrade() {
			this.damage = 11
			this.upgraded = true
			this.name = 'Cleave+'
			this.description = 'Deal 11 Damage to ALL enemies.'
		},
	},
	{
		name: 'Iron Wave',
		type: 'Attack',
		energy: 1,
		damage: 5,
		block: 5,
		target: 'enemy',
		description: 'Deal 5 damage. Gain 5 Block.',
		upgrade() {
			this.damage = 7
			this.block = 7
			this.upgraded = true
			this.name = 'Iron Wave+'
			this.description = 'Deal 7 Damage. Gain 7 Block.'
		},
	},
	{
		name: 'Sucker Punch',
		type: 'Attack',
		energy: 1,
		damage: 7,
		target: 'enemy',
		powers: {
			weak: 1,
		},
		description: 'Deal 7 Damage. Apply 1 Weak.',
		upgrade() {
			this.damage = 8
			this.upgraded = true
			this.name = 'Sucker Punch+'
			this.powers.weak = 2
			this.description = 'Deal 8 Damage. Apply 2 Weak'
		},
	},
	{
		name: 'Thunderclap',
		type: 'Attack',
		energy: 1,
		damage: 4,
		target: 'all enemies',
		powers: {
			vulnerable: 1,
		},
		description: 'Deal 4 Damage. Apply 1 Vulnerable to all enemies.',
	},
	{
		name: 'Flourish',
		type: 'Skill',
		energy: 2,
		target: 'player',
		description: 'Gain 5 Regen. Can only be played if your health is below 50%.',
		powers: {
			regen: 5,
		},
		conditions: [
			{
				type: 'healthPercentageBelow',
				percentage: 50,
			},
		],
		/*
		// Not implemented. Playing around with syntax
		condition(state) {
			const percentage = state.player.currentHealth / state.player.maxHealth * 100
			return percentage < 50
		},*/
	},
	{
		name: 'Summer of Sam',
		type: 'Skill',
		energy: 0,
		target: 'player',
		description: 'Gain 1 Health. Draw 2 Cards if your health is below 50%.',
		actions: [
			{
				type: 'addHealth',
				parameter: {
					amount: 1,
				},
			},
			{
				type: 'drawCards',
				parameter: {
					amount: 2,
				},
				conditions: [
					{
						type: 'healthPercentageBelow',
						percentage: 50,
					},
				],
			},
		],
	},
	{
		name: 'Body Slam',
		energy: 1,
		type: 'Attack',
		target: 'enemy',
		description: 'Deal Damage equal to your Block',
		actions: [
			{
				type: 'dealDamageEqualToBlock',
			},
		],
		upgrade() {
			this.energy = 0
			this.name = 'Body Slam+'
		},
	},
	// {name: 'Flex', energy: 0, type: 'Skill', description: 'Gain 2 Strength.'},
]
