import {html, Component} from '../../web_modules/htm/preact/standalone.module.js'
import CardChooser from './card-chooser.js'

export default class CampfireRoom extends Component {
	rest() {
		this.props.onChoose('rest')
	}
	choose(choice, reward) {
		this.setState({
			choice,
			reward,
			isChoosingCard: !this.state.isChoosingCard,
		})
		if (reward) {
			this.props.onChoose(choice, reward)
		}
	}
	onSelectCard(card) {
		this.choose(this.state.choice, card)
	}
	render(props, state) {
		const {gameState, room} = props
		return html`
			<h1 center medium>Campfire ${room.choice}</h1>

			<ul class="Options">
				<li><button onclick=${() => this.rest()}>Rest</button></li>
				<li><button onclick=${() => this.choose('upgradeCard')}>Upgrade card</button></li>
				<li><button onclick=${() => this.choose('removeCard')}>Remove card</button></li>
			</ul>

			${state.isChoosingCard &&
			html` <p center>Choose a card to ${state.choice}.</p>
				<${CardChooser}
					cards=${gameState.deck}
					didSelectCard=${(card) => this.onSelectCard(card)}
					gameState=${gameState}
				/>`}

			<p center>
				<button onclick=${() => this.props.onContinue()}>Continue</button>
			</p>
		`
	}
}
