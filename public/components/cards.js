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
	const {id, name, type, energy, description} = card
	const isDisabled = currentEnergy < energy
	return html`
		<article class="Card" key=${id} data-id=${id} disabled=${isDisabled}>
			<h3 class="Card-title">${name}</h3>
			<p class="Energybadge Card-energy">${energy}</p>
			<!-- <p class="Card-type">${type}</p> -->
			<p class="Card-description">${description}</p>
		</article>
	`
}
