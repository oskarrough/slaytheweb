import {html} from '../lib.js'
import History from './history.js'
import {saveToUrl} from '../save-load.js'

// @ts-ignore
const abandonGame = () => (window.location.href = window.location.origin)

/** @typedef {import('../../game/new-game.js').Game} Game */
/** @typedef {import('../../game/actions.js').State} State */

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
		<div class="Container">
			<h1 center>Slay the Web</h1>
			<h2 center>Menu</p>
			<div class="Box">
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
			</div>

			<${History} future=${game.future.list} past=${game.past.list} onUndo=${onUndo} />
		</div>
	`
}
