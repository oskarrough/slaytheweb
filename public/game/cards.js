import {uuid} from './utils.js'

export const cards = [
	{
		name: 'Bash',
		energy: 2,
		type: 'Attack',
		damage: 8,
		vulnerable: 2,
		effects: 'Deal 8 damage. Apply 2 Vulnerable.'
	},
	{
		name: 'Defend',
		energy: 1,
		type: 'Skill',
		block: 5,
		effects: 'Gain 5 Block.'
	},
	{
		name: 'Strike',
		energy: 1,
		type: 'Attack',
		damage: 6,
		effects: 'Deal 6 Damage.'
	},
	{
		name: 'Clash',
		energy: 0,
		type: 'Attack',
		damage: 14,
		effects: 'Can only be played if every card in your hand is an Attack. Deal 14 damage.'
	},
	{
		name: 'Cleave',
		energy: 1,
		type: 'Attack',
		damage: 8,
		target: 'all',
		effects: 'Deal 8 damage to ALL enemies.'
	},
	{
		name: 'Iron Wave',
		energy: 1,
		type: 'Skill',
		damage: 5,
		block: 5,
		effects: 'Gain 5 Block. Deal 5 damage.'
	},
	{
		name: 'Sucker Punch',
		energy: 1,
		type: 'Attack',
		damage: 7,
		weak: 1,
		effects: 'Deal 7 damage. Apply 1 Weak.'
	}
	// {name: 'Flex', energy: 0, type: 'Skill', effects: 'Gain 2 Strength.'},
	// {name: 'Body Slam', energy: 1, type: 'Attack', effects: 'Deal Damage equal to your Block'},
]

export class Card {
	constructor(props) {
		// console.log(props)
		// this.target = [ENEMY, ALL_ENEMY, SELF, NONE, SELF_AND_ENEMY, ALL]
		// this.type = [ATTACK, SKILL, POWER, STATUS, CURSE]
		// this.color = [RED, GREEN, BLUE, PURPLE, COLORLESS, CURSE]
		// this.rarity = [BASIC, SPECIAL, COMMON, UNCOMMON, RARE, CURSE]
		this.id = uuid()
		this.name = props.name
		this.energy = props.energy
		this.type = props.type
		this.effects = props.effects
		if (props.damage) this.damage = props.damage
		if (props.block) this.block = props.block
	}
	use() {
		console.log('use', this.effects)
	}
}

// Turns the plain object cards into a class-based one.
export function createCard(name) {
	const baseCard = cards.find(card => card.name === name)
	if (!baseCard) throw new Error(`Card not found: ${name}`)
	return new Card(baseCard)
}