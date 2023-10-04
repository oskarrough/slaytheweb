import {html, render, Component} from './lib.js'
import SplashScreen from './components/screens/splash-screen.js'
import GameScreen from './components/screens/game-screen.js'
import GameOverScreen from './components/screens/game-over-screen.js'
import {init as initSounds} from '../ui/sounds.js'

/** @enum {string} */
const GameModes = {
	splash: 'splash',
	gameplay: 'gameplay',
	win: 'win',
}

/**
 * Our root component for the game.
 * Does nothing else but route between splash, game and game over screens.
 */
class SlayTheWeb extends Component {
	constructor() {
		super()
		// Append ?debug to the URL to start the game in debug mode.
		const urlParams = new URLSearchParams(window.location.search)
		const gameMode = urlParams.has('debug') ? GameModes.gameplay : GameModes.splash
		this.state = {gameMode}
	}
	handleNewGame = async () => {
		await initSounds()
		this.setState({gameMode: GameModes.gameplay})
		// Clear any previous saved game.
		window.history.pushState('', document.title, window.location.pathname)
	}
	handleContinueGame = () => {
		this.setState({gameMode: GameModes.gameplay})
	}
	handleWin = () => {
		this.setState({gameMode: GameModes.win})
	}
	handleLoss = () => {
		this.setState({gameMode: GameModes.splash})
	}
	render() {
		const {gameMode} = this.state
		if (gameMode === GameModes.splash)
			return html`<${SplashScreen}
				onNewGame=${this.handleNewGame}
				onContinue=${() => this.handleContinueGame()}
			><//>`
		if (gameMode === GameModes.gameplay)
			return html`<${GameScreen} onWin=${this.handleWin} onLoss=${this.handleLoss}><//>`
		if (gameMode === GameModes.win)
			return html` <${GameOverScreen} onNewGame=${this.handleNewGame}><//>`
	}
}

// Wrap it in <slay-the-web>. Note it doesn't pass any props through yet.
customElements.define(
	'slay-the-web',
	class SlayTheWebCustomElement extends HTMLElement {
		connectedCallback() {
			render(html` <${SlayTheWeb} /> `, this)
		}
	},
)
