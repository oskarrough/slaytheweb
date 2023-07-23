/** @typedef {import('./monster.js').MONSTER} MONSTER */
/**
 * @typedef {object} Room
 * @prop {RoomTypes} type
 * @prop {Array<MONSTER>} [monsters] - for monster rooms
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
