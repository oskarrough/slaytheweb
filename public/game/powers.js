class Power {
	constructor({type, target, use, name, description}) {
		this.type = type
		this.target = target
		this.use = use
		this.name = name
		this.description = description
	}
	// Each power usually does one thing. This method describes what. Needs to return a number.
	use() {
		return null
	}
}

export const regen = new Power({
	type: 'buff',
	name: 'Regen',
	target: 'player',
	use: (stacks) => stacks,
	description: 'Heals an amount of health points equal to Regen stacks',
})

export const vulnerable = new Power({
	type: 'debuff',
	name: 'Vulnerable',
	use: (dmg) => Math.floor(dmg * 1.5),
	description: 'Takes 50% more damage while Vulnerable',
})

export const weak = new Power({
	type: 'debuff',
	name: 'Weak',
	use: (dmg) => Math.floor(dmg * 0.75),
	description: 'Weakened targets deal 25% less damage',
})

export default {regen, vulnerable, weak}
