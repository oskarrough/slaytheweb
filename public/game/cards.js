import {uuid} from './utils.js'

// type = [ATTACK, SKILL, POWER, STATUS, CURSE]
// target = [ENEMY, ALL_ENEMY, PLAYER, NONE, SELF_AND_ENEMY, ALL]
// this.color = [RED, GREEN, BLUE, PURPLE, COLORLESS, CURSE]
// this.rarity = [BASIC, SPECIAL, COMMON, UNCOMMON, RARE, CURSE]

// A list of all the cards we have.
export const cards = [
	{
		name: 'Defend',
		type: 'Skill',
		energy: 1,
		block: 5,
		target: 'player',
		description: 'Gain 5 Block.'
	},
	{
		name: 'Strike',
		type: 'Attack',
		energy: 1,
		target: 'enemy',
		damage: 6,
		description: 'Deal 6 Damage.'
	},
	{
		name: 'Bash',
		type: 'Attack',
		energy: 2,
		damage: 8,
		target: 'enemy',
		powers: {
			vulnerable: 2
		},
		description: 'Deal 8 damage. Apply 2 Vulnerable.'
	},
	{
		name: 'Clash',
		type: 'Attack',
		energy: 0,
		damage: 14,
		target: 'enemy',
		description: 'Can only be played if every card in your hand is an Attack. Deal 14 damage.'
	},
	{
		name: 'Cleave',
		type: 'Attack',
		energy: 1,
		damage: 8,
		target: 'all enemies',
		description: 'Deal 8 damage to ALL enemies.'
	},
	{
		name: 'Iron Wave',
		type: 'Skill',
		energy: 1,
		damage: 5,
		block: 5,
		target: 'self and enemy',
		description: 'Gain 5 Block. Deal 5 damage.'
	},
	{
		name: 'Sucker Punch',
		type: 'Attack',
		energy: 1,
		damage: 7,
		target: 'enemy',
		powers: {
			weak: 1
		},
		description: 'Deal 7 damage. Apply 1 Weak.'
	},
	{
		name: 'Thunderclap',
		type: 'Attack',
		energy: 1,
		damage: 5,
		target: 'all enemies',
		powers: {
			vulnerable: 1
		},
		description: 'Deal 5 damage to all enemies. Apply 1 Vulnerable to all enemies.'
	},
	{
		name: 'Flourish',
		type: 'Skill',
		energy: 2,
		target: 'player',
		description: 'Gain 5 regen.',
		powers: {
			regen: 5
		}
	}
	// {name: 'Flex', energy: 0, type: 'Skill', description: 'Gain 2 Strength.'},
	// {name: 'Body Slam', energy: 1, type: 'Attack', description: 'Deal Damage equal to your Block'},
]

export class Card {
	constructor(props) {
		this.id = uuid()
		this.name = props.name
		this.energy = props.energy
		this.type = props.type
		this.target = props.target
		this.damage = props.damage
		this.block = props.block
		this.powers = props.powers
		this.description = props.description
	}
}

// Turns the plain object cards into a class-based one.
export function createCard(name) {
	const baseCard = cards.find(card => card.name === name)
	if (!baseCard) throw new Error(`Card not found: ${name}`)
	return new Card(baseCard)
}
