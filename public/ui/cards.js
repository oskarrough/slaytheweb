import {html, Component} from './../web_modules/htm/preact/standalone.module.js'

export default class Cards extends Component {
	// props = {	cards: [], isHand: false, energy: 123 }
	render(props) {
		return html`
			<div class="Cards">
				${props.cards.map((card) => Card(card, props.energy))}
			</div>
		`
	}
}

export function Card(card, currentEnergy) {
	const isDisabled = currentEnergy < card.energy
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
