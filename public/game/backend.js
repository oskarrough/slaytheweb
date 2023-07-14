import {isDungeonCompleted} from '../game/utils-state.js'

const apiUrl = 'https://api.slaytheweb.cards/api/runs'
// const apiUrl = 'http://localhost:3000/api/runs'

/**
 * Saves a "game" object into a remote database.
 * @param {object} game
 * @returns {Promise}
 */
export function postRun(game) {
	const run = {
		name: 'Player 1',
		win: isDungeonCompleted(game.state),
		state: game.state,
		past: game.past.list
	}
	console.log('Posting run',  run)
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

