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
					<${Player} name="1" />
					<${Player} name="2" />
				</div>
				<${Cards} cards=${models.cards} />
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
