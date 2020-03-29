import {html, Component} from './../web_modules/htm/preact/standalone.module.js'

export default class Cards extends Component {
	// props = {	cards: [], isHand: false, energy: 123 }
	componentDidMount() {
		this.positionCards()
	}
	componentDidUpdate() {
		this.positionCards()
	}
	positionCards() {
		const cards = this.base.querySelectorAll('.Card')
		if (this.props.isHand && cards.length) {
			cards.forEach((card, index) => {
				const offset = parseInt(index, 10) - 2
				card.style.transform = `rotate(${offset * 4}deg)`
			})
		}
	}
	render(props) {
		return html`
			<div class="Cards">
				${props.cards.map(card => Card(card, props.energy))}
			</div>
		`
	}
}

export function Card(card, currentEnergy) {
	const isDisabled = currentEnergy < card.energy
	return html`
		<article class="Card" key=${card.id} data-id=${card.id} disabled=${isDisabled}>
			<div class="Card-inner">
				<h3 class="Card-title">${card.name}</h3>
				<p class="Card-energy Energybadge">${card.energy}</p>
				<p class="Card-type">${card.type}</p>
				<p class="Card-description">${card.description}</p>
			</div>
		</article>
	`
}
