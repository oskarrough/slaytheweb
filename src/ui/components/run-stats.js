import {getRun} from '../../game/backend.js'
import {getEnemiesStats} from './dungeon-stats.js'
import {html, useState, useEffect} from '../lib.js'

export default function RunStats() {
	const [run, setRun] = useState()
	const [id, setId] = useState()

	useEffect(() => {
		const params = new URLSearchParams(window.location.search)
		setId(params.get('id'))
	}, [])

	useEffect(() => {
		getRun(id).then((what) => {
			setRun(what)
			console.log(what)
		})
	}, [id])

	if (!run) return html`<h1>Loading statistics for run no. ${id}...</h1>`

	const state = run.gameState
	const date = new Intl.DateTimeFormat('en', {
		dateStyle: 'long',
		hour12: false,
	}).format(new Date(state.createdAt))

	const ms = state.endedAt - state.createdAt
	const hours = Math.floor(ms / (1000 * 60 * 60))
	const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
	const seconds = Math.floor((ms / 1000) % 60)
	const duration = `${hours > 0 ? hours + 'h ' : ''}${minutes}m ${seconds}s`

	// Not all runs have this data in the backend.
	let extraStats = state.dungeon.graph ? getEnemiesStats(state.dungeon) : null
	console.log('extraStats', extraStats)

	return html`
		<h1>Slay the Web run no. ${run.id}</h1>

		<div className="Box Box--text Box--full">
			<p>
				<em>${run.player}</em> made it to floor ${state.dungeon.y} and
				<strong> ${state.won ? 'won' : 'lost'}</strong> in ${duration} on ${date} with
				${state.player.currentHealth}/${state.player.maxHealth} health.
			</p>
		</div>

		${extraStats && (
			<p>
				You encountered {extraStats.encountered} monsters. And killed {extraStats.killed} of them.
			</p>
		)}

		<p>Final deck had ${state.deck.length} cards:</p>
		<ul>
			${state.deck.map((card) => <li>{card}</li>)}
		</ul>
		<p>
			Feel free to inspect the data yourself:
			<a href=${'https://api.slaytheweb.cards/api/runs/' + run.id}>api.slaytheweb.cards/api/runs/${run.id}</a
			>.
		</p>
	`
}
