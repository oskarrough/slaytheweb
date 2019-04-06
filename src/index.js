// htm + preact in a single file
// import {html, render, Component} from "https://unpkg.com/htm/preact/standalone.mjs"
import {html, render, Component} from './htm-preact-standalone.mjs'
import models from './models.js'
import {dragndrop, cardHover} from './animations.js'

const rootEl = document.querySelector('#root')

const UI = ({}) => html`
	<Deck> </Deck>
`

console.log('dddd')

class WelcomeScreen extends Component {
	newGame() {
		render(
			html`
				<${App} name="oskar" />
			`,
			rootEl
		)
	}
	render() {
		return html`
			<center vertical>
				<p>Embark on a quest to Slay the Spire</p>
				<p><button onClick=${() => this.newGame()}>Embark</button></p>
			</center>
		`
	}
}

const Healthbar = ({max, value}) => html`
	<div class="Healthbar">
		<p>${value} / ${max}</p>
		<div class="Healthbar-value" style=${`width: ${value}%`}></div>
	</div>
`

class Player extends Component {
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

class App extends Component {
	render(props, state) {
		return html`
			<div class="App">
				<${Player} name="1" />
				<${Cards} cards=${models.cards} />
			</div>
		`
	}
}

class Cards extends Component {
	componentDidMount() {
		const cards = document.querySelectorAll('.Card')
		cards.forEach(dragndrop)
		// cards.forEach(cardHover)
	}
	render({cards}) {
		return html`
			<div class="Cards">
				${cards.map(Card)}
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

// render(html`<${WelcomeScreen} />`, rootEl)
render(
	html`
		<${App} />
	`,
	rootEl
)
