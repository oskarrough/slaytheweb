class Card {
	constructor() {
		// this.setState({
		// 	id,
		// 	name,
		// 	energy,
		// 	damage,
		// 	block,
		// 	image
		// })
	}
}

const cards = [
	{name: 'Bash', energy: 2, type: 'Attack', effects: 'Deal 8 damage. Apply 2 Vulnerable.'},
	{name: 'Defend', energy: 1, type: 'Skill', effects: 'Gain 5 Block.'},
	{name: 'Strike', energy: 1, type: 'Attack', effects: 'Deal 6 Damage.'},
	{name: 'Body Slam', energy: 1, type: 'Attack', effects: 'Deal Damage equal to your Block'},
	{name: 'Clash', energy: 0, type: 'Attack', effects: 'Can only be played if every card in your hand is an Attack. Deal 14 damage.'},
	{name: 'Cleave', energy: 1, type: 'Attack', effects: 'Deal 8 damage to ALL enemies.'},
	{name: 'Iron Wave', energy: 1, type: 'Skill', effects: 'Gain 5 Block. Deal 5 damage.'},
	{name: 'Flex', energy: 0, type: 'Skill', effects: 'Gain 2 Strength.'},
	{name: 'Sucker Punch', energy: 1, type: 'Attack', effects: 'Deal 7 damage. Apply 1 Weak.'}
]

export default {cards}
