import {canPlay} from '../../game/conditions.js'
import {Component, html} from '../lib.js'

export default class Cards extends Component {
	// props = {gameState: {}, type ''}
	render(props) {
		const cards = props.gameState[props.type]
		return html` <div class="Cards">${cards.map((card) => Card({card, gameState: props.gameState}))}</div> `
	}
}

/**
 * Renders a card
 * @param {object} props
 * @param {import('../../game/cards.js').CARD} props.card
 * @param {import('../../game/actions.js').State} [props.gameState]
 * @returns {?} what?
 */
export function Card(props) {
	// export class Card extends Component {
	// 	render() {
	const {card, gameState} = props
	const isDisabled = !canPlay(gameState, card)
	const image = card.image ? `/images/cards/${card.image}` : '/images/cards/fallback.jpg'

	return html`
		<stw-card
			class="Card"
			data-card-type=${card.type}
			data-card-target=${card.target}
			key=${card.id}
			data-id=${card.id}
			upgraded=${card.upgraded ? '' : null}
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
		</stw-card>
	`
}
// }
