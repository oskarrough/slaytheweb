import {html, render, Component} from '../web_modules/htm/preact/standalone.module.js'
import App from './app.js'
import SplashScreen from './splash-screen.js'
import WinScreen from './win-screen.js'

/** @enum {string} */
const GameModes = {
	splash: 'splash',
	gameplay: 'gameplay',
	win: 'win',
}

/**
 * Our root component for the game.
 * Controls what to render.
 */
class SlayTheWeb extends Component {
	constructor() {
		super()
		this.state = {
			// The game mode to start in.
			gameMode: GameModes.splash,
		}
		this.handleWin = this.handleWin.bind(this)
		this.handleNewGame = this.handleNewGame.bind(this)
		this.handleLoose = this.handleLoose.bind(this)
	}
	handleNewGame() {
		this.setState({gameMode: GameModes.gameplay})
		// Clear any previous saved game.
		window.history.pushState('', document.title, window.location.pathname)
	}
	handleContinueGame() {
		this.setState({gameMode: GameModes.gameplay})
	}
	handleWin() {
		this.setState({gameMode: GameModes.win})
	}
	handleLoose() {
		this.setState({gameMode: GameModes.splash})
	}
	render(props, {gameMode}) {
		if (gameMode === GameModes.splash)
			return html`<${SplashScreen}
				onNewGame=${this.handleNewGame}
				onContinue=${() => this.handleContinueGame()}
			/>`
		if (gameMode === GameModes.gameplay)
			return html` <${App} onWin=${this.handleWin} onLoose=${this.handleLoose} /> `
		if (gameMode === GameModes.win) return html` <${WinScreen} onNewGame=${this.handleNewGame} /> `
	}
}

// render(html` <${SlayTheWeb} /> `, document.querySelector('#SlayTheWeb'))

customElements.define('slay-the-web', class SlayTheWebCustomElement extends HTMLElement {
	connectedCallback() {
		render(html` <${SlayTheWeb} /> `, this)
	}
})
