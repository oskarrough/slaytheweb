import {html, render} from '../lib.js'
import {getRuns} from '../../game/backend.js'
import '../styles/index.css'

const StatsPage = ({runs}) => html`
	<article class="Splash">
		<p><a href="/" class="Button">Back</a></p>
		<div class="Article">
			<h2>Highscores & Statistics</h2>
			<p>A chronological list of Slay the Web runs.</p>
			<p>
				There is quite a bit of statistics that could be gathered from the runs, but for now, this
				is what we have:
			</p>
			<table>
				<thead>
					<tr>
						<th>Date</th>
						<th>Player</th>
						<th>Win?</th>
						<th>Floor</th>
						<th>Moves</th>
						<th>Health</th>
						<th>Cards</th>
						<th>Time</th>
					</tr>
				</thead>
				<tbody>
					${runs?.length
						? runs.map((run) => {
								const state = run.gameState
								// const past = run.gamePast
								const date = new Intl.DateTimeFormat('en', {
									dateStyle: 'long',
									timeStyle: 'short',
									hour12: false,
								}).format(new Date(state.createdAt))
								const duration = state.endedAt ? (state.endedAt - state.createdAt) / 1000 + 's' : ''
								return html`<tr>
									<td>${date}</td>
									<td>${run.player}</td>
									<td>${state.won ? 'WIN' : 'LOSS'}</td>
									<td>${state.dungeon.y}</td>
									<td>${run.gamePast.length}</td>
									<td>${state.player.currentHealth}</td>
									<td>${run.gameState.deck.length}</td>
									<td>${duration}</td>
								</tr>`
						  })
						: 'Loading...'}
				</tbody>
			</table>
			<p>
				Once a run finishes, there is an option to submit it to this list. If you want your run
				removed, <a href="https://github.com/oskarrough/slaytheweb/issues">let me know</a>.
			</p>
		</div>
	</article>
`

render(html`<${StatsPage} />`, document.querySelector('#root'))

getRuns().then((runs) => {
	console.log(runs)
	render(html`<${StatsPage} runs=${runs.reverse()} />`, document.querySelector('#root'))
})
