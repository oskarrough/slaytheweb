import {html, useState} from '../lib.js'
import * as decks from '../../content/decks.js'
import {Card} from './cards.js'
import {createCard} from '../../game/cards.js'

export function DeckSelector(props) {
	const [selectedDeck, setSelectedDeck] = useState(null)

	function select(deck) {
		setSelectedDeck(deck)
		if (props.onSelectDeck) {
			props.onSelectDeck(deck)
		}
	}

	// Get all decks
	const builtinDecks = [decks.deck1, decks.deck2]
	const customDecks = props.customDecks || []

	function handleDelete(deckName) {
		if (props.onDeleteDeck) {
			props.onDeleteDeck(deckName)

			// If the deleted deck was selected, clear the selection
			if (selectedDeck && selectedDeck.name === deckName) {
				setSelectedDeck(null)
			}
		}
	}

	return html`
		<div class="deck-selector">
			<div class="Box">
				<h2 center>Choose a deck</h2>
				${builtinDecks.length > 0 &&
				html`
					<ul class="Options Options--horizontal">
						${builtinDecks.map((deck) => {
							const isSelected = selectedDeck && selectedDeck.name === deck.name
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
				`}

				<h3 center>Custom Decks</h3>
				<ul class="Options Options--horizontal">
					${customDecks.length > 0
						? customDecks.map((deck) => {
								const isSelected = selectedDeck && selectedDeck.name === deck.name
								return html`
									<li>
										<button onClick=${() => select(deck)} class="${isSelected ? 'selected' : ''}">
											${deck.name}g
											<small>${deck.cards.length} cards</small>
										</button>
										<button onClick=${() => handleDelete(deck.name)} title="Delete custom deck" danger>
											✕
										</button>
									</li>
								`
							})
						: html`<li><p>No custom decks yet. Create one to get started!</p></li>`}
					${props.onCreateNewDeck
						? html`
								<li>
									<button onClick=${props.onCreateNewDeck} title="Create a new deck">New Deck +</button>
								</li>
							`
						: ''}
				</ul>
				<p center style="max-width: 42ch;margin: 1em auto;">
					These are stored in your browser's local (storage), not shared with anyone, and deleted with your
					browser cache.
				</p>
			</div>

			${selectedDeck
				? html`
						<div class="Box">
							<div class="Cards Cards--grid Cards--mini">
								${selectedDeck.cards.map(
									(cardName) => html` <${Card} key=${cardName} card=${createCard(cardName)} /> `,
								)}
							</div>
						</div>
					`
				: html`
						<div class="Box" style="min-height: var(--card-height)">
							<p></p>
						</div>
					`}
		</div>
	`
}
