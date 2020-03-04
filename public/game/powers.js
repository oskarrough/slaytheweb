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

// When played: apply to player
// When end turn:  reduce stacks + do your thing e.g. add health
export const regen = new Power({
	type: 'buff',
	target: 'player',
	use: stacks => stacks
})

export const vulnerable = new Power({
	type: 'debuff',
	target: 'enemy',
	use: dmg => dmg * 2
})

// export const weak = new Power({
// 	type: 'debuff',
// 	use: (amount) => amount * 2
// })

export default {regen, vulnerable}
