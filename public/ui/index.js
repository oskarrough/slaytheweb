import {html, render, Component} from '../web_modules/htm/preact/standalone.module.js'
import gsap from '../web_modules/gsap.js'
import App from './app.js'
import SplashScreen from './splash-screen.js'
import WinScreen from './win-screen.js'

// This component decides what to render:
// A splash screen, a "win" screen or the game/app itself.
// It also detects if there's a saved game in the URL and allows the player to continue.

class Main extends Component {
	constructor() {
		super()
		this.state = {
			isPlaying: false,
		}
		this.handleWin = this.handleWin.bind(this)
		this.handleNewGame = this.handleNewGame.bind(this)
		this.handleLoose = this.handleLoose.bind(this)
		this.handleLoadGame = this.handleLoadGame.bind(this)
	}
	handleNewGame() {
		// Clear any previous saved game.
		window.history.pushState('', document.title, window.location.pathname)
		this.setState({isPlaying: true, didWin: false})
	}
	handleWin() {
		this.setState({isPlaying: false, didWin: true})
	}
	handleLoose() {
		this.setState({isPlaying: false, didWin: false})
	}
	handleLoadGame() {
		this.setState({isPlaying: true, didWin: false})
	}
	render(props, {didWin, isPlaying}) {
		// Game play UI
		if (isPlaying) return html` <${App} onWin=${this.handleWin} onLoose=${this.handleLoose} /> `
		// Win screen
		if (didWin) return html` <${WinScreen} onNewGame=${this.handleNewGame} /> `
		// Splash screen
		return html`
			<${SplashScreen} onNewGame=${this.handleNewGame} onContinue=${this.handleLoadGame} />
		`
	}
}

render(html` <${Main} /> `, document.querySelector('#SlayTheWeb'))

// enum GameMode {
//  	CHAR_SELECT, GAMEPLAY, DUNGEON_TRANSITION, SPLASH;
// }
