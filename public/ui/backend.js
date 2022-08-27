const apiUrl = 'https://api.slaytheweb.cards/api/runs'

export async function postRun(game) {
	return fetch(apiUrl, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(game)
	})
}

export async function getRuns() {
	const res = await fetch(apiUrl)
	const {runs} = await res.json()
	return runs.records
}
