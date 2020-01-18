import {uuid} from './utils.js'

export const cards = [
	{name: 'Bash', cost: 2, type: 'Attack', effects: 'Deal 8 damage. Apply 2 Vulnerable.'},
	{name: 'Defend', cost: 1, type: 'Skill', effects: 'Gain 5 Block.'},
	{name: 'Strike', cost: 1, type: 'Attack', effects: 'Deal 6 Damage.'},
	{name: 'Body Slam', cost: 1, type: 'Attack', effects: 'Deal Damage equal to your Block'},
	{
		name: 'Clash',
		cost: 0,
		type: 'Attack',
		effects: 'Can only be played if every card in your hand is an Attack. Deal 14 damage.'
	},
	{name: 'Cleave', cost: 1, type: 'Attack', effects: 'Deal 8 damage to ALL enemies.'},
	{name: 'Iron Wave', cost: 1, type: 'Skill', effects: 'Gain 5 Block. Deal 5 damage.'},
	{name: 'Flex', cost: 0, type: 'Skill', effects: 'Gain 2 Strength.'},
	{name: 'Sucker Punch', cost: 1, type: 'Attack', effects: 'Deal 7 damage. Apply 1 Weak.'}
]

// export default {cards, pickCard}

export class Card {
	constructor(props) {
		// console.log(props)
		// this.target = [ENEMY, ALL_ENEMY, SELF, NONE, SELF_AND_ENEMY, ALL]
		// this.type = [ATTACK, SKILL, POWER, STATUS, CURSE]
		// this.color = [RED, GREEN, BLUE, PURPLE, COLORLESS, CURSE]
		// this.rarity = [BASIC, SPECIAL, COMMON, UNCOMMON, RARE, CURSE]
		this.id = uuid()
		this.name = props.name
		this.cost = props.cost
		this.type = props.type
		this.effects = props.effects
	}
	use() {
		console.log('use', this.effects)
	}
}
