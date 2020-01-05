// htm + preact in a single file
// import {html, render, Component} from "https://unpkg.com/htm/preact/standalone.mjs"
import {html, render, Component} from './htm-preact-standalone.mjs'
import models from './models.js'
import Player from './components/player.js'
import Cards from './components/cards.js'

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			player: {
				maxEnergy: 3,
				currentEnergy: 3,
				maxHealth: 100,
				currentHealth: 10
			},
			cards: models.cards
		}
	}
	render(props, state) {
		return html`
			<div class="App">
				<div class="u-flex">
					<${Player} name="1" />
					<${Player} name="2" />
				</div>
				<div class="DiscardPile Cards"></div>
				<${Cards} cards=${state.cards} />
			</div>
		`
	}
}

const rootEl = document.querySelector('#root')
// render(html`<${WelcomeScreen} />`, rootEl)
render(
	html`
		<${App} />
	`,
	rootEl
)

setTimeout(gogo, 2000)

function gogo() {
	const playerDeck = document.querySelector('.PlayerDeck')
	const discardPile = document.querySelector('.DiscardPile')

	dragula([playerDeck, discardPile], {
		moves(el, source, handle, sibling) {
			// elements are always draggable by default
			return true
		},
		copy(el, source) {
			return source === playerDeck
		},
		accepts(el, target) {
			return target !== playerDeck
		}
	})
		.on('drag', function(el) {
			el.className = el.className.replace('ex-moved', '')
		})
		.on('drop', function(el, target, source) {
			console.log(el, target)
			el.className += ' ex-moved'
		})
		.on('over', function(el, container) {
			container.className += ' ex-over'
		})
		.on('out', function(el, container) {
			container.className = container.className.replace('ex-over', '')
		})
}
