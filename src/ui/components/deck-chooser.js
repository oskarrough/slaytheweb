import {html, useState} from '../lib.js'
import * as decks from '../../content/decks.js'
import Cards, {Card} from './cards.js'
import {createCard} from '../../game/cards.js'

export function DeckChooser(props) {
	const [selectedDeck, setSelectedDeck] = useState(null)

	function select(deckName) {
		const deck = decks[deckName]
		setSelectedDeck(deck)
		if (props.onSelectDeck) {
			props.onSelectDeck(deck)
		}
	}

	return html`
		<div class="DeckChooser">
			<div class="Box">
				<ul class="Options Options--horizontal">
					${Object.entries(decks).map(([deckName, deck]) => {
						const isSelected = selectedDeck && selectedDeck.name === deck.name
						return html`
							<li>
								<button
									onClick=${() => select(deckName)}
									class="DeckTeaser ${isSelected ? 'DeckTeaser--selected' : ''}"
								>
									${isSelected ? html`<span class="DeckTeaser-badge">✓</span>` : ''}
									<strong>${deck.name}</strong>
									<span class="DeckTeaser-count">${deck.cards.length} cards</span>
								</button>
							</li>
						`
					})}
				</ul>
			</div>

			${selectedDeck
				? html`
						<div class="Box">
							<h3 hidden>${selectedDeck.name}</h3>
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
