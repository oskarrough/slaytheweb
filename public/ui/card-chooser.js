import {html, Component} from '../web_modules/htm/preact/standalone.module.js'
import {Card} from './cards.js'

export default class CardChooser extends Component {
	clickedCard(card) {
		this.setState({didChoose: card})
		this.props.didSelectCard(card)
	}
	render(props) {
		return html`
			<article class="RewardsBox">
				<div class="Cards">
					${props.cards.map(
						(card) =>
							html`<div class="CardBox" onClick=${() => this.clickedCard(card)}>${Card(card)}</div>`
					)}
				</div>
			</article>
		`
	}
}
