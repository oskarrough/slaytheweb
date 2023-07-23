import {isDungeonCompleted} from './utils-state.js'

const apiUrl = 'https://api.slaytheweb.cards/api/runs'
// const apiUrl = 'http://localhost:3000/api/runs'

/**
 * @typedef {object} Run
 * @property {string} name - user inputted player name
 * @property {boolean} win - whether the player won the game
 * @property {object} state - the final state
 * @property {Array<Object>} past - a list of past states
 */

/**
 * Saves a "game" object into a remote database.
 * @param {object} game
 * @param {string=} name
 * @returns {Promise}
 */
export async function postRun(game, name) {
	// Make sure we have an end time.
	if (!game.state.endedAt) game.state.endedAt = new Date().getTime()

	/** @type {Run} */
	const run = {
		name: name || 'Unknown entity',
		win: isDungeonCompleted(game.state),
		state: game.state,
		past: game.past,
	}

	return fetch(apiUrl, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(run),
	})
}

/**
 * Fetches a list of maximum 100 runs from the remote database.
 * @returns {Promise<[]>} list of game runs
 */
export async function getRuns() {
	const res = await fetch(apiUrl)
	const {runs} = await res.json()
	return runs
}
