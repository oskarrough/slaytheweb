import {shuffle} from '../utils.js'
import {easyMonsters, monsters, elites, bosses} from '../content/dungeon-encounters.js'

/**
 * @typedef {object} Room
 * @prop {RoomTypes} type
 * @prop {Array<import('../game/monster.js').MONSTER>} [monsters] - for monster rooms
 * @prop {object} [reward] - the reward given to the player, if any
 * @prop {string} [choice] - for campfire rooms, the choice made by the player
 */

/** @enum {string} different type of rooms */
export const RoomTypes = {
	start: 'start',
	campfire: 'campfire',
	monster: 'monster',
	elite: 'elite',
	boss: 'boss',
}

/**
 * This is usually where you start. The first node on the map.
 * @returns {Room}
 */
export function StartRoom() {
	return {
		type: 'start',
	}
}

/**
 * A campfire gives our hero the opportunity to rest, remove or upgrade a card.
 * @typedef {{type: RoomTypes, choice?: string}} CampfireRoom
 * @returns {CampfireRoom}
 */
export function CampfireRoom() {
	return {
		type: 'campfire',
		// choices: ['rest', 'remove', 'upgrade'],
	}
}

/**
 * @param {...Object} monsters
 * @returns {Room}
 */
export function MonsterRoom(...monsters) {
	return {
		type: 'monster',
		monsters,
	}
}

/**
 * Create a room from the node's type
 * @param {string} type
 * @param {number} floor
 * @returns {Room}
 */
export function decideRoomType(type, floor) {
	const pickRandomFromObj = (obj) => obj[shuffle(Object.keys(obj))[0]]
	if (floor === 0) return StartRoom()
	if (type === 'C') return CampfireRoom()
	if (type === 'M' && floor < 2) return pickRandomFromObj(easyMonsters)
	if (type === 'M') return pickRandomFromObj(monsters)
	if (type === 'E') return pickRandomFromObj(elites)
	if (type === 'boss') return pickRandomFromObj(bosses)
	throw new Error(`Could not match node type "${type}" with a dungeon room`)
}
