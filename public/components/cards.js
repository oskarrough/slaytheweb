import {html, Component} from './../web_modules/htm/preact/standalone.module.js'

export default class Cards extends Component {
	componentDidMount() {
		const cards = this.base.querySelectorAll('.Card')
		if (this.props.isHand && cards.length) positionCards(cards)
	}
	render({cards, canDrag, isDiscardPile}) {
		const classNames = `Cards ${canDrag ? 'dropzone' : ''} ${isDiscardPile ? 'Cards--discard' : ''}`
		return html`
			<div class=${classNames}>
				${cards.map(Card)}
			</div>
		`
	}
}

export const Card = ({id, name, type, energy, effects}) => html`
	<article class="Card" key=${id} data-id=${id}>
		<div class="Card-inner">
			<!-- <p>${id.substr(0, 3)}</p> -->
			<h3 class="Card-title">${name}</h3>
			<p class="Card-energy">${energy}</p>
			<!-- <p class="Card-type">${type}</p> -->
			<p class="Card-description">${description}</p>
		</div>
	</article>
`

function positionCards(cards) {
	if (!cards.length) return
	cards.forEach((card, index) => {
		const offset = parseInt(index, 10) - 2
		card.style.transform = `rotate(${offset * 4}deg)`
	})
}
