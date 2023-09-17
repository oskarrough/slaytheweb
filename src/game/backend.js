import {produce} from 'immer'

// const apiUrl = 'https://api.slaytheweb.cards/api/runs'
const apiUrl = 'http://localhost:3000/api/runs'

/**
 * @typedef {object} Run
 * @prop {string} player - user inputted player name
 * @prop {object} gameState - the final state
 * @prop {Array<object>} gamePast - a list of past states
 */

/**
 * Saves a "game" object into a remote database for highscores.
 * @param {import('./new-game.js').Game} game
 * @param {string=} playerName
 * @returns {Promise}
 */
export async function postRun(game, playerName) {
	console.log('postRun', game.past.list)

	/** @type {Run} */
	const run = {
		player: playerName || 'Unknown entity',
		gameState: produce(game.state, (draft) => {
			if (!draft.endedAt) draft.endedAt = new Date().getTime()
		}),
		gamePast: game.past.list.map((item) => {
			return {
				action: item.action,
				turn: item.state.turn,
				player: item.state.player,
			}
		}),
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
 * @returns {Promise<Run[]>} list of game runs
 */
export async function getRuns() {
	const res = await fetch(apiUrl)
	const {runs} = await res.json()
	return runs
}
