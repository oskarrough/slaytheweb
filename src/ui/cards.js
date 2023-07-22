import {html, Component} from './lib.js'
import {canPlay} from '../game/conditions.js'

export default class Cards extends Component {
	// props = {gameState: {}, type ''}
	render(props) {
		const cards = props.gameState[props.type]
		return html` <div class="Cards">${cards.map((card) => Card(card, props.gameState))}</div> `
	}
}

export function Card(card, gameState) {
	const isDisabled = !canPlay(gameState, card)
	const image = card.image ? `/images/cards/${card.image}` : '/images/cards/fallback.jpg'

	return html`
		<article
			class="Card"
			data-card-type=${card.type}
			data-card-target=${card.target}
			key=${card.id}
			data-id=${card.id}
			disabled=${isDisabled}
		>
			<div class="Card-inner">
				<p class="Card-energy EnergyBadge">
					<span>${card.energy}</span>
				</p>
				<figure class="Card-media">
					<img src=${image} alt=${card.name} />
				</figure>
				<p class="Card-type">${card.type}</p>
				<h3 class="Card-name">${card.name}</h3>
				<p class="Card-description">${card.description}</p>
			</div>
		</article>
	`
}
