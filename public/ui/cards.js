import {html, Component} from './../web_modules/htm/preact/standalone.module.js'

export default class Cards extends Component {
	// props = {	cards: [], isHand: false, energy: 123 }
	render(props) {
		return html`
			<div class="Cards">
				${props.gameState[props.type].map((card) => Card(card, props.gameState))}
			</div>
		`
	}
}

function canPlayCard(card, gameState) {
	const notEnoughEnergy = gameState.player.currentEnergy < card.energy
	const cardIsInHand = gameState.hand.find((c) => c.id === card.id)
	if (!cardIsInHand) return false
	if (notEnoughEnergy) return false
	if (card.conditions) {
		return card.canPlay(gameState)
	}
	return true
}

export function Card(card, gameState) {
	const isDisabled = !canPlayCard(card, gameState)

	return html`
		<article
			class="Card"
			data-card-type=${card.type}
			key=${card.id}
			data-id=${card.id}
			disabled=${isDisabled}
		>
			<div class="Card-inner">
				<h3 class="Card-name">${card.name}</h3>
				<p class="Card-energy EnergyBadge">
					<span>${card.energy}</span>
				</p>
				<p class="Card-type">${card.type}</p>
				<p class="Card-description">${card.description}</p>
			</div>
		</article>
	`
}
