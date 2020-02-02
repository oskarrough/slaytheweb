import {html, Component} from './../web_modules/htm/preact/standalone.module.js'

export default class Cards extends Component {
	render({cards, isDiscardPile}) {
		const classNames = `Cards dropzone ${isDiscardPile ? 'Cards--discard' : ''}`
		return html`
			<div class=${classNames}>
				${cards.map(Card)}
			</div>
		`
	}
}

export const Card = ({id, name, type, energy, effects}) => html`
	<article class="Card" data-id=${id}>
		<h3 class="Card-title">${name}</h3>
		<p class="Card-type">${type}</p>
		<p class="Card-energy">${energy}</p>
		<p class="Card-effects">${effects}</p>
	</article>
`

// function cardTransform(offset, handWidth) {
// 	const transform =
// 		'rotate(' + offset * 4 + 'deg) translateX(' +
// 		(offset - (Math.abs(offset) * offset) / 7) * Math.min(140, handWidth / 8) +
// 		'px)'
// 	return transform
// }

// function positionCards() {
// 	const cards = this.base.querySelectorAll('.Card')
// 	// if (cards.length) return
// 	const handWidth = this.base.offsetWidth
// 	cards.forEach((card, index) => {
// 		const offset = parseInt(index, 10) - 2
// 		console.log(offset, handWidth)
// 		card.style.transform = cardTransform(offset, handWidth)
// 	})
// }
