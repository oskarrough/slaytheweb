import {html, Component} from './../web_modules/htm/preact/standalone.module.js'
import {Card} from './cards.js'

export default class Rewards extends Component {
	clickedCard(card) {
		this.setState({didChoose: card})
		this.props.rewardWith(card)
	}
	render(props, state) {
		return html`
			<div class="RewardsBox">
				<h2>You win</h2>
				${state.didChoose
					? html`<p>Added <em>${state.didChoose.name}</em> to your deck.</p>`
					: html`
							<p>Add a card to your deck.</p>
							<div class="Cards">
								${props.cards.map(
									(card) =>
										html`<div class="CardBox" onClick=${() => this.clickedCard(card)}>
											${Card(card)}
										</div>`
								)}
							</div>
					  `}
			</div>
		`
	}
}
