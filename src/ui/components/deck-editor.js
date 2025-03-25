import {html, useState, useEffect} from '../lib.js'
import {uuid} from '../../utils.js'
import {cards} from '../../content/cards.js'
import {Card} from './cards.js'
import {createCard} from '../../game/cards.js'
import {saveDeck, deleteDeck} from '../../ui/storage-deck.js'

export function DeckEditor(props) {
	const [deckName, setDeckName] = useState(props.deck?.name)
	const [selectedCards, setSelectedCards] = useState(props.deck?.cards || [])

	// Update state when props.deck changes
	useEffect(() => {
		setDeckName(props.deck?.name)
		setSelectedCards(props.deck?.cards || [])
	}, [props.deck])

	function addCard(cardName) {
		setSelectedCards([...selectedCards, cardName])
	}

	function removeCard(index) {
		const newDeck = [...selectedCards]
		newDeck.splice(index, 1)
		setSelectedCards(newDeck)
	}

	function handleSaveDeck(event) {
		event.preventDefault()
		if (!selectedCards.length) return
		const deck = {
			...props.deck,
			name: deckName.trim(),
			cards: selectedCards,
			custom: true
		}
		saveDeck(deck)
		if (props.onSaveDeck) props.onSaveDeck(deck)
	}
	
	function handleDeleteDeck() {
		if (!props.deck || !props.deck.id) return
		
		if (confirm(`Are you sure you want to delete the deck "${props.deck.name}"?`)) {
			deleteDeck(props.deck.id)
			if (props.onDeleteDeck) props.onDeleteDeck(props.deck.id)
		}
	}

	return html`
		<div class="Split">
			<div class="Box">
				<h3>Editing custom deck ${props.deck.name}</h3>
				<p>Custom decks are stored locally in your browser and not shared (yet).</p>
				<form onSubmit=${(e) => handleSaveDeck(e)}>
					<label>
						Name <input type="text" value=${deckName} onInput=${(e) => setDeckName(e.target.value)} />
					</label>
					<button type="submit" disabled=${selectedCards.length === 0} class="Button">
						Save deck
					</button>
					<button type="button" onClick=${handleDeleteDeck} class="Button" danger>
						Delete deck
					</button>
				</form>
				<br/>
				${selectedCards.length > 0
					? html`
							<div class="Cards Cards--grid Cards--mini">
								${selectedCards.map(
									(cardName, index) => html`
										<div class="Cards-item">
											<${Card} key=${cardName + index} card=${createCard(cardName)}>
											</${Card}>
											<button danger onClick=${() => removeCard(index)}>✕</button>
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
