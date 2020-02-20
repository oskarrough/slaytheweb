import {uuid} from './utils.js'

// A list of all the cards we have.
export const cards = [
	{
		name: 'Defend',
		energy: 1,
		type: 'Skill',
		block: 5,
		description: 'Gain 5 Block.'
	},
	{
		name: 'Strike',
		energy: 1,
		type: 'Attack',
		damage: 6,
		description: 'Deal 6 Damage.'
	},
	{
		name: 'Bash',
		energy: 2,
		type: 'Attack',
		damage: 8,
		vulnerable: 2,
		description: 'Deal 8 damage. Apply 2 Vulnerable.'
	},
	{
		name: 'Clash',
		energy: 0,
		type: 'Attack',
		damage: 14,
		description: 'Can only be played if every card in your hand is an Attack. Deal 14 damage.'
	},
	{
		name: 'Cleave',
		energy: 1,
		type: 'Attack',
		damage: 8,
		target: 'all',
		description: 'Deal 8 damage to ALL enemies.'
	},
	{
		name: 'Iron Wave',
		energy: 1,
		type: 'Skill',
		damage: 5,
		block: 5,
		description: 'Gain 5 Block. Deal 5 damage.'
	},
	{
		name: 'Sucker Punch',
		energy: 1,
		type: 'Attack',
		damage: 7,
		weak: 1,
		description: 'Deal 7 damage. Apply 1 Weak.'
	}
	// {name: 'Flex', energy: 0, type: 'Skill', description: 'Gain 2 Strength.'},
	// {name: 'Body Slam', energy: 1, type: 'Attack', description: 'Deal Damage equal to your Block'},
]

export class Card {
	constructor(props) {
		this.id = uuid()
		this.name = props.name
		this.energy = props.energy
		// this.type = [ATTACK, SKILL, POWER, STATUS, CURSE]
		this.type = props.type
		this.description = props.description
		if (props.damage) this.damage = props.damage
		if (props.block) this.block = props.block
		if (props.vulnerable) this.vulnerable = props.vulnerable
		// this.target = [ENEMY, ALL_ENEMY, SELF, NONE, SELF_AND_ENEMY, ALL]
		// this.color = [RED, GREEN, BLUE, PURPLE, COLORLESS, CURSE]
		// this.rarity = [BASIC, SPECIAL, COMMON, UNCOMMON, RARE, CURSE]
	}
	use() {
		console.log('use', this.description)
	}
}

// Turns the plain object cards into a class-based one.
export function createCard(name) {
	const baseCard = cards.find(card => card.name === name)
	if (!baseCard) throw new Error(`Card not found: ${name}`)
	return new Card(baseCard)
}
