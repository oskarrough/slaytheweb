const apiUrl = 'https://api.slaytheweb.cards/api/runs'

/**
 * Saves a "game" object into a remote database.
 * @param {object} game
 * @returns {Promise}
 */
export function postRun(game) {
	return fetch(apiUrl, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(game),
	})
}

/**
 * Fetches a list of maximum 100 runs from the remote database.
 * @returns {Promise<[]>} list of game runs
 */
export async function getRuns() {
	const res = await fetch(apiUrl)
	const {runs} = await res.json()
	return runs.records
}
