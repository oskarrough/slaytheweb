import {html} from '../web_modules/htm/preact/standalone.module.js'
import History from './history.js'

const save = (state) => (window.location.hash = encodeURIComponent(JSON.stringify(state)))
const abandonGame = () => (window.location = window.location.origin)

export default function Menu({game, gameState, onUndo}) {
	return html`
		<div class="Splash">
			<h1 medium>Slay the Web</h1>

			<ul class="Options">
				<li>
					<button
						onclick=${() => save(gameState)}
						title="Your save game will be stored in the URL. Copy it"
					>
						Save
					</button>
				</li>
				<li>
					<button onclick=${() => abandonGame()}>Abandon Game</button>
				</li>
			</ul>

			<${History} future=${game.future.list} past=${game.past.list} />

			${game.past.list.length &&
			html`<p>
				<button onclick=${() => onUndo()}>
					<u>U</u>
					ndo
				</button>

				<br />
			</p>`}

			<p style="margin-top:auto">
				<a rel="noreferrer" target="_blank" href="https://github.com/oskarrough/slaytheweb"
					>View source</a
				>
			</p>
		</div>
	`
}
