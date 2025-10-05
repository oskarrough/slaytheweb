import {cards} from '../../content/cards.js'
import {createCard} from '../../game/cards.js'
import {deleteDeck, saveDeck} from '../../ui/storage-deck.js'
import {html, useEffect, useState} from '../lib.js'
import {Card} from './cards.js'

function DeckForm({deckName, onNameChange, onSave, onDelete}) {
	return html`
		<form onSubmit=${onSave}>
			<label>
				Name <input type="text" value=${deckName} onInput=${(e) => onNameChange(e.target.value)} />
			</label>
			<button type="submit" class="Button">Save deck</button>
			<button type="button" onClick=${onDelete} class="Button" danger>Delete deck</button>
		</form>
	`
}

function SelectedCards({selectedCards, onRemove}) {
	if (!selectedCards.length) return html`<p center>Empty deck, add some cards!</p>`

	return html`
		<div class="Cards Cards--grid Cards--mini">
			${selectedCards.map(
				(cardName, index) => html`
					<div class="Cards-item">
						<${Card} key=${cardName} card=${createCard(cardName)} />
						<button danger onClick=${() => onRemove(index)}>✕</button>
					</div>
				`,
			)}
		</div>
	`
}

function AvailableCards({onAdd}) {
	return html`
		<h3>Available Cards</h3>
		<div class="Cards Cards--grid Cards--mini">
			${cards.map(
				(card) => html`
					<div class="Cards-item">
						<${Card} key=${card.name} card=${card} />
						<button onClick=${() => onAdd(card.name)}>+</button>
					</div>
				`,
			)}
		</div>
	`
}

export function DeckEditor({deck, onSaveDeck, onDeleteDeck}) {
	const [deckName, setDeckName] = useState(deck?.name)
	const [selectedCards, setSelectedCards] = useState(deck?.cards || [])

	useEffect(() => {
		setDeckName(deck?.name)
		setSelectedCards(deck?.cards || [])
	}, [deck])

	function handleSaveDeck(event) {
		event.preventDefault()
		if (!selectedCards.length) return

		const updatedDeck = {
			...deck,
			name: deckName.trim(),
			cards: selectedCards,
			custom: true,
		}

		saveDeck(updatedDeck)
		if (onSaveDeck) onSaveDeck(updatedDeck)
	}

	function handleDeleteDeck() {
		if (!deck?.id) return

		if (confirm(`Are you sure you want to delete the deck "${deck.name}"?`)) {
			deleteDeck(deck.id)
			if (onDeleteDeck) onDeleteDeck(deck.id)
		}
	}

	return html`
		<div class="Split">
			<div class="Box">
				<${AvailableCards} onAdd=${(cardName) => setSelectedCards([...selectedCards, cardName])} />
			</div>
			<div class="Box">
				<${DeckForm}
					deckName=${deckName}
					onNameChange=${setDeckName}
					onSave=${handleSaveDeck}
					onDelete=${handleDeleteDeck}
				/>
				<br />
				<${SelectedCards}
					selectedCards=${selectedCards}
					onRemove=${(index) => {
						const newDeck = [...selectedCards]
						newDeck.splice(index, 1)
						setSelectedCards(newDeck)
					}}
				/>
			</div>
		</div>
	`
}
