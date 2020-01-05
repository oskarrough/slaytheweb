import {html, render, Component} from '../htm-preact-standalone.mjs'

export const Card = ({name, type, energy, effects}) => html`
	<div class="Card">
		<h3 class="Card-title">${name}</h3>
		<p class="Card-type">${type}</p>
		<p class="Card-energy">${energy}</p>
		<p class="Card-effects">${effects}</p>
	</div>
`

export default class Cards extends Component {
	componentDidMount() {
		const cards = document.querySelectorAll('.Card')
		// cards.forEach(dragndrop)
	}
	render({cards}) {
		return html`
			<p>We have ${cards.length}</p>
			<div class="Cards PlayerDeck">
				${cards.map(Card)}
			</div>
		`
	}
}
