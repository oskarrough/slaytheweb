import {range, shuffle} from '../utils.js'

/**
 * @typedef MONSTER
 * @prop {number} [hp]
 * @prop {number} [currentHealth]
 * @prop {number} [maxHealth]
 * @prop {number} [block]
 * @prop {number} [random]
 * @prop {Array} [intents]
 * @prop {number} [nextIntent]
 * @prop {object} [powers]
 */

/**
 * A monster has health, probably some damage and a list of intents.
	Use a list of intents to describe what the monster should do each turn.
	Supported intents: block, damage, vulnerable and weak.
	Intents are cycled through as the monster plays its turn.
 * @param {MONSTER} props
 * @returns {MONSTER}
 */
export function Monster(
	props = {
		currentHealth: 42,
		maxHealth: 42,
		intents: [],
	},
) {
	// By setting props.random to a number, all damage intents will be randomized with this range.
	let randomIntents
	if (typeof props.random === 'number') {
		randomIntents = props.intents.map((intent) => {
			if (intent.damage) {
				const newDamage = shuffle(range(5, intent.damage - props.random))[0]
				intent.damage = newDamage
			}
			return intent
		})
	}

	return {
		currentHealth: props.hp || props.currentHealth,
		maxHealth: props.hp || props.maxHealth,
		block: props.block || 0,
		powers: props.powers || {},
		// A list of "actions" the monster will take each turn.
		// Example: [{damage: 6}, {block: 2}, {}, {weak: 2}]
		// ... meaning turn 1, deal 6 damage, turn 2 gain 2 block, turn 3 do nothing, turn 4 apply 2 weak
		intents: randomIntents || props.intents,
		// A counter to keep track of which intent to run next.
		nextIntent: 0,
	}
}
