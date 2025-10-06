import * as builtinDecks from '../../content/decks.js'
import {html, useState} from '../lib.js'
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
						<button class="Button ${selectedDeck?.id === deck.id ? 'selected' : ''}" onClick=${() => select(deck)}>
							${deck.name}
							<small>
								${deck.cards.length} cards, ${deck.custom ? 'custom' : 'built-in'}
							</small>
						</button>
					</li>
				`,
			)}
		</ul>
	`
}
