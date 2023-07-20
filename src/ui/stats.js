import {html, render} from '../main.js'
import {getRuns} from '../../public/game/backend.js'

const List = (props) => html`
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
						<th>Name</th>
						<th>Win?</th>
						<th>Floor</th>
						<th>Health</th>
						<th>Time</th>
					</tr>
				</thead>
				<tbody>
					${props.runs?.length
						? props.runs.map((run) => {
								const date = new Intl.DateTimeFormat('en', {
									dateStyle: 'long',
									timeStyle: 'short',
								}).format(new Date(run.createdAt))
								const duration = run.state.endedAt
									? (run.state.endedAt - run.state.createdAt) / 1000 + 's'
									: ''
								return html`<tr>
									<td>${date}</td>
									<td>${run.name}</td>
									<td>${run.win ? 'WIN' : 'LOSS'}</td>
									<td>${run.state.turn}</td>
									<td>${run.state.player.currentHealth}</td>
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

render(html`<${List} />`, document.querySelector('#root'))

getRuns().then((runs) => {
	console.log(runs)
	render(html`<${List} runs=${runs.reverse()} />`, document.querySelector('#root'))
})
