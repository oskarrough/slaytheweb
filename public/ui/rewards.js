import {html, Component} from './../web_modules/htm/preact/standalone.module.js'
import {Card} from './cards.js'

export default class Rewards extends Component {
	clickedCard(card) {
		this.setState({didChoose: card})
		this.props.rewardWith(card)
	}
	render(props, state) {
		return html`
			<article class="RewardsBox">
				<h1 medium>Victory. Onwards!</h1>
				${state.didChoose
					? html`<p>Added <em>${state.didChoose.name}</em> to your deck.</p>`
					: html`
							<p>Here are your rewards. Pick a card to add to your deck.</p>
							<div class="Cards">
								${props.cards.map(
									(card) =>
										html`<div class="CardBox" onClick=${() => this.clickedCard(card)}>
											${Card(card)}
										</div>`
								)}
							</div>
					  `}
			</article>
		`
	}
}

export class CardChooser extends Component {
	clickedCard(card) {
		this.setState({didChoose: card})
		this.props.didSelectCard(card)
	}
	render(props, state) {
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
