import {html} from '../lib'
import Map from './map.js'
import Menu from './menu.js'
import Cards from './cards.js'
import {OverlayWithButton} from './overlay.js'

// The "chrome" on the game screen. All the overlays and buttons around the edge.

export const Overlays = ({gameState, game, toggleOverlay, undo, handleMapMove}) => {
	return html`
		<${OverlayWithButton} id="Menu" topleft>
			<button onClick=${() => toggleOverlay('#Menu')}><u>Esc</u>ape</button>
			<div class="Overlay-content">
				<${Menu} gameState=${gameState} game=${game} onUndo=${undo} />
			</div>
		<//>

		<${OverlayWithButton} id="Map" topright key=${1}>
			<button align-right onClick=${() => toggleOverlay('#Map')}><u>M</u>ap</button>
			<div class="Overlay-content">
				<${Map} dungeon=${gameState.dungeon} onMove=${handleMapMove} />
			</div>
		<//>

		<${OverlayWithButton} id="Deck" topright topright2>
			<button
				class="tooltipped tooltipped-se"
				aria-label="All the cards you own"
				onClick=${() => toggleOverlay('#Deck')}
			>
				<u>D</u>eck ${gameState.deck.length}
			</button>
			<div class="Overlay-content">
				<${Cards} gameState=${gameState} type="deck" />
			</div>
		<//>

		<${OverlayWithButton} id="DrawPile" bottomleft>
			<button
				class="tooltipped tooltipped-ne"
				aria-label="The cards you'll draw next in random order"
				onClick=${() => toggleOverlay('#DrawPile')}
			>
				Dr<u>a</u>w pile ${gameState.drawPile.length}
			</button>
			<div class="Overlay-content">
				<${Cards} gameState=${gameState} type="drawPile" />
			</div>
		<//>

		<${OverlayWithButton} id="exhaustPile" topleft topleft2>
			<button
				class="tooltipped tooltipped-se"
				aria-label="The cards you have exhausted in this encounter"
				onClick=${() => toggleOverlay('#exhaustPile')}
			>
				E<u>x</u>haust pile ${gameState.exhaustPile.length}
			</button>
			<div class="Overlay-content">
				<${Cards} gameState=${gameState} type="exhaustPile" />
			</div>
		<//>

		<${OverlayWithButton} id="DiscardPile" bottomright>
			<button
				onClick=${() => toggleOverlay('#DiscardPile')}
				align-right
				class="tooltipped tooltipped-nw tooltipped-multiline"
				aria-label="Cards you've already played. Once the draw pile is empty, these cards are shuffled into your draw pile."
			>
				Di<u>s</u>card pile ${gameState.discardPile.length}
			</button>
			<div class="Overlay-content">
				<${Cards} gameState=${gameState} type="discardPile" />
			</div>
		<//>
	`
}
