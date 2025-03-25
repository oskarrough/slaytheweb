import {html, useState} from '../lib.js'
import * as builtinDecks from '../../content/decks.js'
import {getCustomDecks} from '../storage-deck.js'

/** Renders a menu with all decks, both built-in and custom. Use the onSelectDeck prop callback to catch it */
export function DeckSelector({onSelectDeck}) {
	const [selectedDeck, setSelectedDeck] = useState(null)
	const decks = [...Object.values(builtinDecks), ...getCustomDecks()]

	function select(deck) {
		setSelectedDeck(deck)
		if (onSelectDeck) onSelectDeck(deck)
	}

	return html`
		<ul class="Options">
			${decks.map(
				(deck) => html`
					<li>
						<button onClick=${() => select(deck)} class=${selectedDeck?.id === deck.id ? 'selected' : ''}>
							${deck.name}
							<small>${deck.cards.length} cards</small>
							${deck.custom && html`<small>custom</small>`}
						</button>
					</li>
				`,
			)}
		</ul>
	`
}
