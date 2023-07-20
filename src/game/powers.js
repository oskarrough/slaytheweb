/**
 * The type of a power
 * @typedef POWER
 * @property {string} name
 * @property {string} description
 * @property {string} type
 * @property {string=} target
 * @property {Function=} use
 */

// Class representing a power.
class Power {
	/**
	 * @param {POWER} power - The base power to create a class from
	 */
	constructor(power) {
		const {name, description, type, target, use} = power
		this.name = name
		this.description = description
		this.type = type
		this.target = target
		this.use = use
	}
}

export const regen = new Power({
	type: 'buff',
	name: 'Regen',
	description: 'Heals an amount of health points equal to Regen stacks',
	target: 'player',
	use: (stacks) => stacks,
})

export const poison = new Power({
	type: 'debuff',
	name: 'Poison',
	description: 'Hurts equal to poison stacks (todo: make poison reduce at start of turn, not end)',
	use: (stacks) => stacks,
})

export const vulnerable = new Power({
	type: 'debuff',
	name: 'Vulnerable',
	description: 'Takes 50% more damage while Vulnerable',
	use: (dmg) => Math.floor(dmg * 1.5),
})

export const weak = new Power({
	type: 'debuff',
	name: 'Weak',
	description: 'Weakened targets deal 25% less damage',
	use: (dmg) => Math.floor(dmg * 0.75),
})


export const strength = new Power({
	type: 'buff',
	name: 'strength',
	description: 'Strengthened targets deal +x damage', //make x be current strength level
	use: (stacks) => stacks,
})

/**tried to add strength, but can't figure out how to give the +1 dmg per stack and stack doesn't reduce*/
export default {regen, vulnerable, weak, strength}
