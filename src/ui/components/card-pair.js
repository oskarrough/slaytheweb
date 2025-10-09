import {createCard} from '../../game/cards.js'
import {Component, html} from '../lib.js'
import {Card} from './cards.js'

/**
 * Renders a card that can be clicked to flip and show its upgraded version
 */
export default class CardPair extends Component {
	constructor(props) {
		super(props)
		this.state = {
			flipped: false,
		}
	}

	handleClick() {
		this.setState({flipped: !this.state.flipped})
	}

	render(props, state) {
		const {card, gameState} = props
		const upgradedCard = createCard(card.name, true)

		return html`
			<div
				class="CardBox"
				flipped=${state.flipped ? '' : null}
				onClick=${() => this.handleClick()}
			>
				${Card({card, gameState})}
				${Card({card: upgradedCard, gameState})}
			</div>
		`
	}
}
