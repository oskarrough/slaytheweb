import {html, render, Component} from '../vendor/htm-preact-standalone.mjs'

export default class Cards extends Component {
	componentDidMount() {
		// const cards = document.querySelectorAll('.Card')
	}
	render({cards}) {
		if (!cards) {
			return html`<div class="Cards dropzone"></div> `
		}
		return html`
			<div class="Cards dropzone">
				${cards.map(Card)}
			</div>
		`
	}
}

export const Card = ({name, type, energy, effects}) => html`
	<article class="Card draggable">
		<h3 class="Card-title">${name}</h3>
		<p class="Card-type">${type}</p>
		<p class="Card-energy">${energy}</p>
		<p class="Card-effects">${effects}</p>
	</article>
`
