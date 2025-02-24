import {produce} from 'immer'

const apiUrl = 'https://api.slaytheweb.cards/api/runs'
// const apiUrl = 'http://localhost:3000/api/runs'

/**
 * @typedef {object} MinifiedState
 * @prop {number} createdAt
 * @prop {number} endedAt
 * @prop {boolean} won
 * @prop {number} turn
 * @prop {string[]} deck - List of card names (not full card objects)
 * @prop {import('./actions.js').Player} player
 * @prop {import('./dungeon.js').Dungeon} [dungeon] - Like full dungeon but without paths
 */

/**
 * @typedef {object} Run
 * @prop {string} [id]
 * @prop {string} player - user inputted player name
 * @prop {MinifiedState} gameState - A minimized version of the game state. See minimizeGameState()
 * @prop {PastEntry[]} gamePast - a list of past states
 */

/**
 * A simplified version of the game.past entries
 * @typedef {object} PastEntry
 * @prop {number} turn
 * @prop {object} action
 * @prop {import('./actions.js').Player} player
 */

/** Apparently it's too much data to send around, so I try to remove a bit
 * @param {import('./actions.js').State} state
 * @returns {MinifiedState}
 */
function minimizeGameState(state) {
	return produce(state, (draft) => {
		if (!draft.endedAt) draft.endedAt = new Date().getTime()
		// delete mini.dungeon?.graph
		delete draft.dungeon?.paths
		delete draft.drawPile
		delete draft.hand
		delete draft.discardPile
		delete draft.exhaustPile
		draft.deck = draft.deck.map(card => {
			return card.name
		})
	})
}

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
		gameState: minimizeGameState(game.state),
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
 * @returns {Promise<{runs: Run[], total: number}>} list of game runs
 */
export async function getRuns() {
	const res = await fetch(apiUrl)
	return await res.json()
}

/**
 * @returns {Promise<Run>} a single run
 */
export async function getRun(id) {
	const res = await fetch(apiUrl + `/${id}`)
	return res.json()
}
