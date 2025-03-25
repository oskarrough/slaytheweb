import {html, useState} from '../lib.js'
import {cards} from '../../content/cards.js'
import {Card} from './cards.js'
import {createCard} from '../../game/cards.js'
import {saveDeck} from '../../content/decks.js'

export function DeckEditor(props) {
	// Initialize with values from deckToEdit if provided
	const [deckName, setDeckName] = useState(props.deckToEdit ? props.deckToEdit.name : 'My Custom Deck')
	const [selectedCards, setSelectedCards] = useState(props.deckToEdit ? props.deckToEdit.cards : [])

	function addCard(cardName) {
		setSelectedCards([...selectedCards, cardName])
	}

	function removeCard(index) {
		const newDeck = [...selectedCards]
		newDeck.splice(index, 1)
		setSelectedCards(newDeck)
	}

	function handleSaveDeck() {
		if (!selectedCards.length) return

		// Create the deck object
		const deck = {
			name: deckName.trim() || 'My Custom Deck',
			cards: selectedCards,
		}

		// Use the deck service to save
		const updatedDecks = saveDeck(deck)

		// Notify parent component if callback exists
		if (props.onSaveDeck) {
			props.onSaveDeck(deck)
		}
	}

	return html`
		<div class="deck-editor">
			<div class="Box">
				<p>
					<label>
						Name <input type="text" value=${deckName} onInput=${(e) => setDeckName(e.target.value)} />
					</label>
				</p>
				<button onClick=${handleSaveDeck} disabled=${selectedCards.length === 0} class="Button">
					Save Deck
				</button>
				${selectedCards.length > 0
					? html`
							<div class="Cards Cards--grid Cards--mini">
								${selectedCards.map(
									(cardName, index) => html`
										<div class="Cards-item">
											<${Card} key=${cardName + index} card=${createCard(cardName)}>
											</${Card}>
											<button onClick=${() => removeCard(index)}>✕</button>
										</div>
									`,
								)}
							</div>
						`
					: html`<p center>No cards selected yet. Add some from below</p>`}
			</div>

			<div class="Box">
				<h3>Available Cards</h3>
				<div class="Cards Cards--grid Cards--mini">
					${cards.map(
						(card) => html`
							<div class="Cards-item">
								<${Card} key=${card.name} card=${card} />
								<button onClick=${() => addCard(card.name)}>+</button>
							</div>
						`,
					)}
				</div>
			</div>
		</div>
	`
}
