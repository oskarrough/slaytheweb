import {html, useState} from '../lib.js'
import {DeckEditor} from '../components/deck-editor.js'
import {DeckSelector} from '../components/deck-selector.js'
import {createCard} from '../../game/cards.js'
import {Card} from '../components/cards.js'
import {uuid} from '../../utils.js'

export function DeckEditorApp() {
	const [deck, setDeck] = useState(null)

	function createNewDeck() {
		setDeck({
			id: uuid(),
			name: `My deck ${uuid()}`,
			custom: true
		})
	}

	return html`
		<div class="Box">
			<ul class="Options">
				<li><a href="/" class="Button">← Menu</a></li>
				<li><button onClick=${createNewDeck}>New custom deck</button></li>
			</ul>
			<p>Slay the Web comes with a standard, classic deck. Now you can also create your own decks from the existing cards. Custom decks are, for now, only stored in your own browser. If you think others might find your deck fun, <a href="/manual">please contribute</a>!</p>
		</div>

		<div class="Box">
			<${DeckSelector} onSelectDeck=${setDeck} />
		</div>

		${deck?.custom
			? html`<${DeckEditor} 
				deck=${deck} 
				onSaveDeck=${setDeck} 
				onDeleteDeck=${deckId => {
					if (deck?.id === deckId) setDeck(null)
				}} 
			/>`
			: html`<${DeckPreview} deck=${deck} />`
		}
	`
}

function DeckPreview({deck}) {
	if (!deck) return html``
	
	return html`
		<div class="Box">
			<h3>${deck.name} <small>(Built-in deck)</small></h3>
			<div class="Cards Cards--grid Cards--mini">
				${deck.cards.map(cardName => html`
					<${Card} key=${cardName} card=${createCard(cardName)} />
				`)}
			</div>
		</div>
	`
}
