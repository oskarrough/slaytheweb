import {html, useState} from '../lib.js'
import {saveToUrl} from '../save-load.js'
import {toggleMute} from '../sounds.js'

// @ts-expect-error
const abandonGame = () => {
	window.location.href = window.location.origin
}

/** @typedef {import('../../game/new-game.js').Game} Game */
/** @typedef {import('../../game/actions.js').State} State */

/**
 * Do something
 * @param {object} props
 * @param {State} props.gameState
 * @returns {import('preact').VNode}
 */
export default function Menu({gameState}) {
	const [muted, setMuted] = useState(false)

	function toggleSound() {
		toggleMute(!muted)
		setMuted(!muted)
	}

	return html`
		<div class="Container">
			<br />
			<br />
			<div class="Box">
				<ul class="Options">
					<li>
						<button
							class="Button"
							onClick=${() => saveToUrl(gameState)}
							title="Your save game will be stored in the URL. Copy it"
						>
							Save game
						</button>
					</li>
					<li>
						<button class="Button" danger onClick=${() => abandonGame()}>Abandon game</button>
					</li>
					<li>
						<label>Sound <input type="checkbox" checked=${!muted} onClick=${() => toggleSound()} /></label>
					</li>
				</ul>
			</div>
		</div>
	`
}
