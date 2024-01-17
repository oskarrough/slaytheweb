import {html, Component} from '../lib.js'
import {Card} from './cards.js'
import gsap from '../animations.js'

export default class CardChooser extends Component {
	componentDidMount() {
		if (this.props.animate) {
			// Animate all the cards in with a nice animation and staggered delay with gsap
			const cards = this.base.querySelectorAll('.CardBox')
			gsap.effects.dealCards(cards)
		}
	}

	clickedCard(card) {
		const cardEl = this.base.querySelector(`[data-id="${card.id}"]`)
		setTimeout(() => {
			this.props.didSelectCard(card)
		}, 300)
		gsap.effects.addCardToDeck(cardEl).then(() => {
			// this.props.didSelectCard(card)
		})
	}

	render(props) {
		return html`
			<article class="RewardsBox">
				<div class="Cards">
					${props.cards.map(
						(card) =>
							html`<div class="CardBox" onClick=${() => this.clickedCard(card)}>
								${Card(card, props.gameState)}
							</div>`,
					)}
				</div>
			</article>
		`
	}
}
