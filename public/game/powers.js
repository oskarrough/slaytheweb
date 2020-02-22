class Power {
	constructor({type, stacks, use}) {
		this.type = type
		this.stacks = stacks || 0
		this.use = use
	}

	use() {
		return null
	}
}

// Regen is applied immediately to "self"
// Regen needs to run its action after ending a turn
export const regen = new Power({
	type: 'buff',
	stacks: 4,
	target: 'self',
	use(health) {
		this.stacks = this.stacks - 1
		return health + this.stacks + 1
	}
})

export const vulnerable = new Power({
	type: 'debuff',
	target: 'enemy',
	use: dmg => dmg * 2
})

// export const weak = new Power({type: 'debuff', use: (amount) => amount * 2})

export default {
	regen,
	vulnerable
	// weak
}
