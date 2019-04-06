// htm + preact in a single file
// import {html, render, Component} from "https://unpkg.com/htm/preact/standalone.mjs"
import {html, render, Component} from './htm-preact-standalone.mjs'
import models from './models.js'
import {Player, Cards} from './components/all.js'

class App extends Component {
	render(props, state) {
		return html`
			<div class="App">
				<div class="u-flex">
					<${Player} name="1">
					</Player>
					<${Player} name="2" />
				</div>
				<${Cards} cards=${models.cards} />
				<div class="DiscardPile">Disard here</div>
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

const playerDeck = document.querySelector('.Cards')
const discardPile = document.querySelector('.DiscardPile')

dragula([playerDeck, discardPile], {
	copy: function (el, source) {
	  return source === playerDeck
	},
	accepts: function (el, target) {
	  return target !== playerDeck
	}
})
	.on('drag', function(el) {
		el.className = el.className.replace('ex-moved', '')
	})
	.on('drop', function(el) {
		el.className += ' ex-moved'
	})
	.on('over', function(el, container) {
		container.className += ' ex-over'
	})
	.on('out', function(el, container) {
		container.className = container.className.replace('ex-over', '')
	})
