class Power {
	constructor({type}) {
		this.type = type
	}
}

// Buffs
export const regen = new Power({type: 'buff'})

// Debuffs
export const vulnerable = new Power({type: 'debuff'})
export const weak = new Power({type: 'debuff'})

export default {
	regen,
	vulnerable,
	weak
}
