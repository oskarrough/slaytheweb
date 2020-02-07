import {html, Component} from './../web_modules/htm/preact/standalone.module.js'

export default class Cards extends Component {
	componentDidMount() {
		const cards = this.base.querySelectorAll('.Card')
		const handWidth = this.base.offsetWidth
		positionCards(cards, handWidth)
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
	<article class="Card" data-id=${id}>
		<div class="Card-inner">
			<h3 class="Card-title">${name}</h3>
			<p class="Card-energy">${energy}</p>
			<!-- <p class="Card-type">${type}</p> -->
			<p class="Card-effects">${effects}</p>
		</div>
	</article>
`

function cardTransform(offset, handWidth) {
	return `rotate(${offset * 4}deg)`
}

function positionCards(cards, width) {
	if (!cards.length) return
	cards.forEach((card, index) => {
		const offset = parseInt(index, 10) - 2
		console.log(offset, width)
		card.style.transform = cardTransform(offset, width)
	})
}
