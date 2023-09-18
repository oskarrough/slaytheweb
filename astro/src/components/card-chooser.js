import {html, Component} from '../lib/lib.js'
import {Card} from './cards.js'

export default class CardChooser extends Component {
	clickedCard(card) {
		this.props.didSelectCard(card)
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
