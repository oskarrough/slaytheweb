import {html, useState, useEffect} from '../lib.js'
import {getRun} from '../../game/backend.js'
import {getEnemiesStats} from './dungeon-stats.js'
import { SlayMap } from './slay-map.js'

export default function RunStats() {
	/** @type {ReturnType<typeof useState<import('../../game/backend.js').Run>>} */
	const [run, setRun] = useState()
	/** @type {ReturnType<typeof useState<string>>} */
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

		<p>
			<em>${run.player}</em> made it to floor ${state.dungeon.y} and
			<strong> ${state.won ? 'won' : 'lost'}</strong>.
		</p>
		<p>
			The run took ${duration} on ${date} with ${state.player.currentHealth}/${state.player.maxHealth} health
			and ${run.gamePast.length} actions taken over ${run.gameState.turn} turns.
		</p>

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
			Inspect the raw data here:
			<a href=${'https://api.slaytheweb.cards/api/runs/' + run.id}>api.slaytheweb.cards/api/runs/${run.id}</a
			>.
		</p>
		
		<${SlayMap} dungeon=${run.gameState.dungeon} x=${state.dungeon.x} y=${state.dungeon.y} scatter=${20} debug=${true}><//>
	`
}
