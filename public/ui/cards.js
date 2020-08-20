import {html, Component} from './../web_modules/htm/preact/standalone.module.js'

export default class Cards extends Component {
	// props = {	cards: [], isHand: false, energy: 123 }
	render(props) {
		return html`
			<div class="Cards">
				${props.cards.map(card => Card(card, props.energy, props.cards))}
			</div>
		`
	}
}

function isCardDisabled(card, currentEnergy, cards) {
	let isDisabled = false
	if(currentEnergy < card.energy) {
		isDisabled = true
	} 
	// Example of how we could handle cards conditions
	// Should probably be a isolated function
	else if (card.conditions && cards) {
		card.conditions.forEach(condition => {

			if (condition.action === 'ONLY') {
				cards.forEach(card => {
					if(card.type !== condition.type) {
						isDisabled = true;		
					}
				})
			}

			if (condition.action === 'NONE') {
				cards.forEach(card => {
					if(card.type === condition.type) {
						isDisabled = true;		
					}
				})
			}

			if (condition.action === 'ATLEAST') {
				let amount = 0;
				cards.forEach(card => {
					if(card.type === condition.type) {
						amount++
						isDisabled = amount < condition.amount; 		
					}
				})
			}
		});
	}
	
	return isDisabled;
}

export function Card(card, currentEnergy, cards) {
	let isDisabled = isCardDisabled(card, currentEnergy, cards);

	return html`
		<article class="Card" key=${card.id} data-id=${card.id} disabled=${isDisabled}>
			<div class="Card-inner">
				<h3 class="Card-title">${card.name}</h3>
				<p class="Card-energy EnergyBadge">
				<div> ${card.energy} </div>
				</p>
				<p class="Card-type">${card.type}</p>
				<p class="Card-description">${card.description}</p>
			</div>
		</article>
	`
}
