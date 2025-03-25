import {html, useState, useEffect} from '../lib.js'
import {cards} from '../../content/cards.js'
import {Card} from './cards.js'
import {createCard} from '../../game/cards.js'
import {saveDeck, deleteDeck} from '../../ui/storage-deck.js'

function DeckForm({deck, deckName, selectedCards, onNameChange, onSave, onDelete}) {
	return html`
		<form onSubmit=${(e) => onSave(e)}>
			<label>
				Name <input type="text" value=${deckName} onInput=${(e) => onNameChange(e.target.value)} />
			</label>
			<button type="submit" disabled=${selectedCards.length === 0} class="Button">
				Save deck
			</button>
			<button type="button" onClick=${onDelete} class="Button" danger>
				Delete deck
			</button>
		</form>
	`
}

function SelectedCards({selectedCards, onRemove}) {
	if (selectedCards.length === 0) return html`<p center>Empty deck, add some cards!</p>`
	return html`
		<div class="Cards Cards--grid Cards--mini">
			${selectedCards.map(
				(cardName, index) => html`
					<div class="Cards-item">
						<${Card} key=${cardName} card=${createCard(cardName)} />
						<button danger onClick=${() => onRemove(index)}>✕</button>
					</div>
				`
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
				`
			)}
		</div>
	`
}

export function DeckEditor(props) {
	const [deckName, setDeckName] = useState(props.deck?.name)
	const [selectedCards, setSelectedCards] = useState(props.deck?.cards || [])

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
				<${DeckForm}
					deck=${props.deck}
					deckName=${deckName}
					selectedCards=${selectedCards}
					onNameChange=${setDeckName}
					onSave=${handleSaveDeck}
					onDelete=${handleDeleteDeck}
				/>
				<br/>
				<${SelectedCards}
					selectedCards=${selectedCards}
					onRemove=${removeCard}
				/>
			</div>
			<div class="Box">
				<${AvailableCards} onAdd=${addCard} />
			</div>
		</div>
	`
}
