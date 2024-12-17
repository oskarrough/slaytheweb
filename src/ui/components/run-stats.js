import {html, useState, useEffect} from '../lib.js'
import {getRun} from '../../game/backend.js'
import {getEnemiesStats} from './dungeon-stats.js'
import {SlayMap} from './slay-map.js'
import {Card} from './cards.js'
import {createCard} from '../../game/cards.js'

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
		if (!id) {
			setRun(null)
			return
		}
		getRun(id).then((what) => {
			setRun(what)
			console.log(what)
		})
	}, [id])

	if (!id) return html`<p>Add ?id=1234 (and use a real ID) to the URL to see a specific run.</p>`
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
		<header class="Header">
			<h1>Slay the Web run no. ${run.id}</h1>
		</header>

		<div class="Box Box--text">
			<p>
				<em>${run.player}</em> made it to floor ${state.dungeon.y} and
				<strong> ${state.won ? 'won' : 'lost'}</strong>.
			</p>
			<p>The run took ${duration} on ${date}.</p>
			<p>
				Player made ${run.gamePast.length} moves over ${run.gameState.turn} turns,<br />
				and ended with ${state.player.currentHealth}/${state.player.maxHealth} health.
			</p>

			${extraStats && (
				<p>
					You encountered {extraStats.encountered} monsters. And killed {extraStats.killed} of them.
				</p>
			)}
		</div>

		<div class="Box">
			<p>
				Inspect the raw JSON data for the run  <a href=${'https://api.slaytheweb.cards/api/runs/' + run.id}
					>api.slaytheweb.cards/api/runs/${run.id}</a
				>.
			</p>
		</div>

		<div class="Box">
			<p>Final deck had ${state.deck.length} cards:</p>
			<div class="Cards Cards--grid Cards--mini">
				${state.deck.map((card) =>
					Card({
						card: createCard(card.replace('+', ''), card.includes('+') ? true : false),
					}),
				)}
			</div>
		</div>

		<${SlayMap}
			dungeon=${run.gameState.dungeon}
			x=${state.dungeon.x}
			y=${state.dungeon.y}
			scatter=${20}
			debug=${true}
		><//>
	`
}
