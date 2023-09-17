import {html, render} from '../lib.js'
import {getRuns} from '../../game/backend.js'
import '../styles/index.css'

const StatsPage = ({runs}) => html`
	<article class="Splash">
		<p><a href="/" class="Button">Back</a></p>
		<div class="Article Article--book">
			<h2>Highscores & Statistics</h2>
			<p>A chronological list of Slay the Web runs.<br/>
				There is quite a bit of statistics that could be gathered from the runs. For now, this
				is what we have:
			</p>
			<table>
				<thead>
					<tr>
						<th>Player</th>
						<th>Win?</th>
						<th>Floor</th>
						<th>Moves</th>
						<th>Health</th>
						<th>Cards</th>
						<th align=right>Time</th>
						<th align=right>Date</th>
					</tr>
				</thead>
				<tbody>
					${runs?.length
						? runs.map((run) => {
								const state = run.gameState
								const date = new Intl.DateTimeFormat('en', {
									dateStyle: 'long',
									timeStyle: 'short',
									hour12: false,
								}).format(new Date(state.createdAt))
								const duration = state.endedAt ? (state.endedAt - state.createdAt) / 1000 + 's' : ''
								return html`<tr>
									<td>${run.player}</td>
									<td>${state.won ? 'WIN' : 'LOSS'}</td>
									<td>${state.dungeon.y}</td>
									<td>${run.gamePast.length}</td>
									<td>${state.player.currentHealth}</td>
									<td>${run.gameState.deck.length}</td>
									<td align=right>${duration}</td>
									<td align=right>${date}</td>
								</tr>`
						  })
						: 'Loading...'}
				</tbody>
			</table>
			<p>
				Once a run finishes, there is an option to submit it to this list. If you want your run
				removed, <a href="https://matrix.to/#/#slaytheweb:matrix.org">let me know</a>.
			</p>
		</div>
	</article>
`

render(html`<${StatsPage} />`, document.querySelector('#root'))

getRuns().then((runs) => {
	console.log(runs)
	render(html`<${StatsPage} runs=${runs.reverse()} />`, document.querySelector('#root'))
})
