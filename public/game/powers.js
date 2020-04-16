class Power {
	constructor({type, target, use}) {
		this.type = type
		this.target = target
		this.use = use
	}
	use() {
		return null
	}
}

// Targets with regen heal an amount of healthpoints equal to regen stacks.
export const regen = new Power({
	type: 'buff',
	target: 'player',
	use: (stacks) => stacks,
})

// Vulnerable targets take 50% more damage.
export const vulnerable = new Power({
	type: 'debuff',
	use: (dmg) => Math.floor(dmg * 1.5),
})

// Weakened targets deal 25% less damage.
export const weak = new Power({
	type: 'debuff',
	use: (dmg) => Math.floor(dmg * 0.75),
})

export default {regen, vulnerable, weak}
