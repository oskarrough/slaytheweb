import {html, render, Component} from '../web_modules/htm/preact/standalone.module.js'
import App from './app.js'
import SplashScreen from './splash-screen.js'
import WinScreen from './win-screen.js'

const GAMEMODE = {
	SPLASH: 'splash',
	GAMEPLAY: 'gameplay',
	WIN: 'win',
}

/**
 * Our root component for the game.
 * Controls what to render.
 */
class SlayTheWeb extends Component {
	constructor() {
		super()
		this.state = {
			gameMode: GAMEMODE.SPLASH,
		}
		this.handleWin = this.handleWin.bind(this)
		this.handleNewGame = this.handleNewGame.bind(this)
		this.handleLoose = this.handleLoose.bind(this)
	}
	handleNewGame() {
		this.setState({gameMode: GAMEMODE.GAMEPLAY})
		// Clear any previous saved game.
		window.history.pushState('', document.title, window.location.pathname)
	}
	handleContinueGame() {
		this.setState({gameMode: GAMEMODE.GAMEPLAY})
	}
	handleWin() {
		this.setState({gameMode: GAMEMODE.WIN})
	}
	handleLoose() {
		this.setState({gameMode: GAMEMODE.SPLASH})
	}
	render(props, {gameMode}) {
		if (gameMode === GAMEMODE.SPLASH)
			return html`<${SplashScreen}
				onNewGame=${this.handleNewGame}
				onContinue=${() => this.handleContinueGame()}
			/>`
		if (gameMode === GAMEMODE.GAMEPLAY)
			return html` <${App} onWin=${this.handleWin} onLoose=${this.handleLoose} /> `
		if (gameMode === GAMEMODE.WIN) return html` <${WinScreen} onNewGame=${this.handleNewGame} /> `
	}
}

render(html` <${SlayTheWeb} /> `, document.querySelector('#SlayTheWeb'))
