import {CardTargets} from './cards.js'

/** @typedef {import('./actions.js').State} State */
/** @typedef {import('./cards.js').CARD} CARD */
/** @typedef {import('./dungeon.js').Dungeon} Dungeon */
/** @typedef {import('./dungeon.js').MapNode} MapNode */
/** @typedef {import('./rooms.js').Room} Room */
/** @typedef {import('./monster.js').MONSTER} MONSTER */

/**
 * A bunch of utilities specific to the game state object.
 */

/**
 * @param {State} state
 * @returns {number} The percentage of player health remaining.
 */
export function getPlayerHealthPercentage(state) {
	return (state.player.currentHealth / state.player.maxHealth) * 100
}

/**
 * Returns the node you are currently on.
 * @param {Dungeon} dungeon
 * @returns {MapNode}
 */
export function getCurrentNode(dungeon) {
	return dungeon.graph[dungeon.y][dungeon.x]
}

/**
 * Returns the current dungeon room from the the y/x props
 * @param {State} state
 * @returns {Room}
 */
export function getCurrRoom(state) {
	const node = getCurrentNode(state.dungeon)
	if (!node.room) throw new Error('This node has no room')
	return node.room
}

/**
 * Returns an array of targets (player or monsters) in the current room.
 * @param {State} state
 * @param {CardTargets} targetQuery
 * @returns {Array<MONSTER>}
 */
export function getTargets(state, targetQuery) {
	if (!targetQuery || typeof targetQuery !== 'string') {
		throw new Error('Bad query string')
	}
	if (targetQuery === CardTargets.player) return [state.player]
	const room = getCurrRoom(state)
	if (targetQuery === CardTargets.allEnemies) return room.monsters
	if (targetQuery.startsWith(CardTargets.enemy)) {
		const index = Number(targetQuery.split('enemy')[1])
		const monster = room.monsters[index]
		if (monster) return [monster]
	}
	throw new Error(`Could not find target "${targetQuery}" on ${state.dungeon.y}/${state.dungeon.x}`)
}

/**
 * What does this do again?
 * @param {CardTargets} cardTarget
 * @param {string} targetQuery
 * @returns {boolean}
 */
export function cardHasValidTarget(cardTarget, targetQuery) {
	return (
		(cardTarget === 'player' && targetQuery.includes('player')) ||
		(cardTarget === 'enemy' && targetQuery.includes('enemy')) ||
		(cardTarget === 'allEnemies' && targetQuery.includes('enemy'))
	)
}

/**
 * @param {Room} room
 * @returns {boolean} true if the room has been cleared.
 */
export function isRoomCompleted(room) {
	if (room.type === 'monster') {
		const deadMonsters = room.monsters.filter((m) => m.currentHealth < 1)
		return deadMonsters.length === room.monsters.length
	} else if (room.type === 'campfire') {
		return room.choice === 'rest' || Boolean(room.reward)
	} else if (room.type === 'start') {
		return true
	}
	throw new Error(`Could not check if room has been completed: "${room.type}"`)
}

/**
 * Check if the current room in a game has been cleared.
 * @param {State} state
 * @returns {boolean}
 */
export function isCurrRoomCompleted(state) {
	const room = getCurrRoom(state)
	return isRoomCompleted(room)
}

/**
 * Checks if the whole dungeon (all rooms) has been cleared.
 * As long as there is one cleared node per floor, we are good.
 * @param {State} state
 * @returns {boolean}
 */
export function isDungeonCompleted(state) {
	const clearedRooms = state.dungeon.graph
		.map((floor) => {
			return floor.some((node) => {
				return node.room && isRoomCompleted(node.room)
			})
		})
		.filter(Boolean)
	return clearedRooms.length === state.dungeon.graph.length
}
