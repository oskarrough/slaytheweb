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

function isCardDisabled(card, gameState) {
	let isDisabled = false
	if (gameState.player.currentEnergy < card.energy) {
		isDisabled = true
	} else if (card.conditions) {
		// We only need to check if the card is in hand.
		let inHand = gameState.hand.find((c) => c.id === card.id)
		isDisabled = inHand && card.checkConditions(gameState)
	}

	return isDisabled
}

export function Card(card, gameState) {
	let isDisabled
	if (gameState) {
		isDisabled = isCardDisabled(card, gameState)
	}

	return html`
		<article class="Card" key=${card.id} data-id=${card.id} disabled=${isDisabled}>
			<div class="Card-inner">
				<h3 class="Card-name">${card.name}</h3>
				<p class="Card-energy EnergyBadge">
				<div> ${card.energy} </div>
				</p>
				<p class="Card-type">${card.type}</p>
				<p class="Card-description">${card.description}</p>
			</div>
		</article>
	`
}
