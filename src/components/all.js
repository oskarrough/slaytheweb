import {html, render, Component} from '../htm-preact-standalone.mjs'
import {dragndrop} from '../animations.js'

// class WelcomeScreen extends Component {
// 	newGame() {
// 		render(
// 			html`
// 				<${App} name="oskar" />
// 			`,
// 			rootEl
// 		)
// 	}
// 	render() {
// 		return html`
// 			<center vertical>
// 				<p>Embark on a quest to Slay the Spire</p>
// 				<p><button onClick=${() => this.newGame()}>Embark</button></p>
// 			</center>
// 		`
// 	}
// }

const Healthbar = ({max, value}) => html`
	<div class="Healthbar">
		<p>${value} / ${max}</p>
		<div class="Healthbar-value" style=${`width: ${value}%`}></div>
	</div>
`

export class Player extends Component {
	constructor(props) {
		super(props)
		this.state = {
			maxEnergy: 3,
			currentEnergy: 3,
			maxHealth: 100,
			currentHealth: 10
		}
	}
	render(props, state) {
		return html`
			<div class="Player">
				<p>Player ${props.name}</p>
				<p class="Energy"><i>${state.currentEnergy}</i> / ${state.maxEnergy}</p>
				<${Healthbar} max=${state.maxHealth} value=${state.currentHealth} />
			</div>
		`
	}
}

const Card = ({name, type, energy, effects}) => html`
	<div class="Card">
		<h3 class="Card-title">${name}</h3>
		<p class="Card-type">${type}</p>
		<p class="Card-energy">${energy}</p>
		<p class="Card-effects">${effects}</p>
	</div>
`

export class Cards extends Component {
	componentDidMount() {
		const cards = document.querySelectorAll('.Card')
		// cards.forEach(dragndrop)
	}
	render({cards}) {
		return html`
			<p>We have ${cards.length}</p>
			<div class="Cards" style="">
				${cards.map(Card)}
			</div>
		`
	}
}
