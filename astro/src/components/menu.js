import {html} from '../lib/lib.js'
import {saveToUrl} from '../lib/save-load.js'
import History from './history.js'

// @ts-ignore
const abandonGame = () => (window.location.href = window.location.origin)

/** @typedef {import('../game/new-game.js').Game} Game */
/** @typedef {import('../game/actions.js').State} State */

/**
 * Do something
 * @param {object} props
 * @param {Game} props.game
 * @param {State} props.gameState
 * @param {Function} props.onUndo
 * @returns {import('preact').VNode}
 */
export default function Menu({game, gameState, onUndo}) {
	return html`
		<div class="Splash">
			<h1 medium>Slay the Web</h1>

			<ul class="Options">
				<li>
					<button
						onclick=${() => saveToUrl(gameState)}
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
