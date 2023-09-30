import {html, Component} from '../lib.js'
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
		const {gameState} = props
		const {choice, isChoosingCard} = state
		let label = ''
		if (choice === 'upgradeCard') label = 'Choose a card to upgrade'
		if (choice === 'removeCard') label = 'Choose a card to remove'
		return html`
			<h1 center medium>Campfire</h1>
			<ul class="Options">
				${isChoosingCard
					? html`
							<li>
								<button onClick=${() => this.setState({isChoosingCard: false})}>Cancel</button>
							</li>
					  `
					: html`
							<li><button onClick=${() => this.rest()}>Rest</button></li>
							<li><button onClick=${() => this.choose('upgradeCard')}>Upgrade card</button></li>
							<li><button onClick=${() => this.choose('removeCard')}>Remove card</button></li>
					  `}
			</ul>
			${isChoosingCard &&
			html`<br />
				<p center>${label}</p>
				<${CardChooser}
					gameState=${gameState}
					cards=${gameState.deck}
					didSelectCard=${(card) => this.onSelectCard(card)}
				/>`}
			<p center>
				<button onClick=${() => this.props.onContinue()}>No, thanks</button>
			</p>
		`
	}
}
