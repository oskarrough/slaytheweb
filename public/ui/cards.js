import {html, Component} from './../web_modules/htm/preact/standalone.module.js'
import gsap from './../web_modules/gsap.js'

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
			gsap.set(cards, {x: 0})
			const x = this.base.getBoundingClientRect().width
			gsap.killTweensOf(cards)
			gsap.fromTo(
				cards,
				{
					rotation: -25,
					x: -x,
					y: 100,
					scale: 0.5,
				},
				{
					duration: 0.8,
					scale: 1,
					delay: 0.4,
					x: 0,
					// y: 0,
					y: function (index) {
						const offset = parseInt(index, 10) - 2
						return offset * 20
					},
					rotation: function (index) {
						const offset = parseInt(index, 10) - 2
						return offset * 2
					},
					stagger: -0.1,
					// rotation: gsap.utils.random(-2, 2),
					ease: 'back.out(0.3)',
				}
			)
		}
	}
	// spreadCards() {
	// 	const cards = this.base.querySelectorAll('.Card')
	// 	cards.forEach((card, index) => {
	// 		const offset = parseInt(index, 10) - 2
	// 		card.style.transform = ''
	// 		card.style.transform = `rotate(${offset * 4}deg)`
	// 	})
	// }
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
				<h3 class="Card-title">${card.name}</h3>
				<p class="Card-energy EnergyBadge">${card.energy}</p>
				<p class="Card-type">${card.type}</p>
				<p class="Card-description">${card.description}</p>
			</div>
		</article>
	`
}
