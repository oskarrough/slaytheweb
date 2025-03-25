import {html, useState} from '../lib.js'
import * as builtinDecks from '../../content/decks.js'
import {getCustomDecks} from '../storage-deck.js'

export function DeckSelector(props) {
	const [selectedDeck, setSelectedDeck] = useState(null)

	const decks = [
		...Object.values(builtinDecks),
		...getCustomDecks()
	]
	
	console.log(decks)

	function select(deck) {
		setSelectedDeck(deck)
		if (props.onSelectDeck) props.onSelectDeck(deck)
	}

	return html`
			<ul class="Options">
				${decks.map((deck) => {
					const isSelected = selectedDeck?.id === deck.id
					return html`
						<li>
							<button onClick=${() => select(deck)} class="${isSelected ? 'selected' : ''}">
								${deck.name}
								<small>${deck.cards.length} cards</small>
							</button>
						</li>
					`
				})}
			</ul>
	`
}
