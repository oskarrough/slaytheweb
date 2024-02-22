import {produce} from 'immer'

const apiUrl = 'https://api.slaytheweb.cards/api/runs'
// const apiUrl = 'http://localhost:3000/api/runs'

/**
 * @typedef {object} Run
 * @prop {string} player - user inputted player name
 * @prop {win} number
 * @prop {number} floor
 * @prop {number} floor
 * @prop {number} floor
 * @prop {object} gameState - the final state
 * @prop {PastEntry[]} gamePast - a list of past states
 */

/**
 * A simplified version of the game.past entries
 * @typedef {object} PastEntry
 * @prop {number} turn
 * @prop {object} action
 * @prop {object} player
 */

/**
 * Saves a "game" object into a remote database for highscores.
 * @param {import('./new-game.js').Game} game
 * @param {string=} playerName
 * @returns {Promise}
 */
export async function postRun(game, playerName) {
	/** @type {Run} */
	const run = {
		player: playerName || 'Unknown entity',
		gameState: produce(game.state, (draft) => {
			if (!draft.endedAt) draft.endedAt = new Date().getTime()
		}),
		gamePast: game.past.list.map((item) => {
			return {
				action: item.action,
				// we're not including the entire state, it's too much data
				// but we do want to know which turn and the player's state at the time
				turn: item.state.turn,
				player: item.state.player,
			}
		}),
	}

	console.log('Posting run', run)

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
 * @returns {Promise<Run[]>} list of game runs
 */
export async function getRuns() {
	const res = await fetch(apiUrl)
	const {runs} = await res.json()
	return runs
}

/**
 * @returns {Promise<Run>} a single run
 */
export async function getRun(id) {
	const res = await fetch(apiUrl + `/${id}`)
	return res.json()
}
