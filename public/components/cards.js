import {html, Component} from './../web_modules/htm/preact/standalone.module.js'

export default class Cards extends Component {
	// props = {
	// 	cards: [],
	// 	isHand: false,
	// }
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
	render({cards}) {
		return html`
			<div class="Cards">
				${cards.map(Card)}
			</div>
		`
	}
}

export const Card = ({id, name, type, energy, description}) => html`
	<article class="Card" key=${id} data-id=${id}>
		<h3 class="Card-title">${name}</h3>
		<p class="Card-energy">${energy}</p>
		<!-- <p class="Card-type">${type}</p> -->
		<p class="Card-description">${description}</p>
	</article>
`
