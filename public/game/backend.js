import {isDungeonCompleted} from '../game/utils-state.js'

const apiUrl = 'https://api.slaytheweb.cards/api/runs'
// const apiUrl = 'http://localhost:3000/api/runs'
//

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
 * @param {string} name
 * @returns {Promise}
 */
export async function postRun(game, name) {
	const run = {
		name: name || 'Unknown entity',
		win: isDungeonCompleted(game.state),
		state: game.state,
		past: game.past,
	}

	let body
	try {
		body = JSON.stringify(run)
	} catch (err) {
		console.log(err, run)
		throw new Error('Could not stringify run')
	}

	const res = await fetch(apiUrl, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body,
	})
	console.log(res.status, res.statusText)
	return res
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
