import {html, useState} from '../lib.js'
import {DeckEditor} from '../components/deck-editor.js'
import {DeckSelector} from '../components/deck-selector.js'
import {createCard} from '../../game/cards.js'
import {Card} from '../components/cards.js'
import {uuid} from '../../utils.js'

export function DeckEditorApp() {
	const [deck, setDeck] = useState(null)
	
	function handleSaveDeck(savedDeck) {
		// Update the current deck with the saved version
		setDeck(savedDeck)
	}

	function handleDeleteDeck(deckId) {
		// Clear the current deck if it was the one deleted
		if (deck && deck.id === deckId) {
			setDeck(null)
		}
	}

	return html`
		<div class=Box>
			<ul class="Options">
				<li><a href="/" class="Button">← Menu</a></li>
				<li><button onClick=${() => setDeck({id: uuid(), name: `My deck ${uuid()}`, custom: true})}>
					New custom deck
				</button></li>
			</ul>
		</div>

		<div class=Box>
			<${DeckSelector} onSelectDeck=${(deck) => setDeck(deck)} onDeleteDeck=${handleDeleteDeck} />
		</div>
		
		${deck?.custom
			? html`<${DeckEditor} deck=${deck} onSaveDeck=${handleSaveDeck} onDeleteDeck=${handleDeleteDeck} />`
			: html`<${DeckPreview} deck=${deck} />`
		}
	`
}

/**
<${DeckPreview} deck=${deck} />
*/


function DeckPreview(props) {
	if (!props.deck) return html``
	return html`
		<div class="Box">
			<h3>${props.deck.name} <small>(Built-in deck)</small></h3>
			<div class="Cards Cards--grid Cards--mini">
				${props.deck.cards.map(
					(cardName) => html` <${Card} key=${cardName} card=${createCard(cardName)} /> `,
				)}
			</div>
		</div>
	`
}
