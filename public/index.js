import {html, render, Component} from './web_modules/htm/preact/standalone.module.js'
import App from '../components/app.js'

// This component decides what to render:
// A splash screen, a "win" screen or the game/app itself.
// It also detects if there's a saved game in the URL and allows the player to continue.

class Main extends Component {
	constructor() {
		super()
		this.state = {
			isPlaying: false
		}
		this.handleWin = this.handleWin.bind(this)
		this.handleNewGame = this.handleNewGame.bind(this)
		this.handleLoose = this.handleLoose.bind(this)
		this.handleLoadGame = this.handleLoadGame.bind(this)
	}
	handleNewGame() {
		window.location.hash = ''
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
		if (isPlaying)
			return html`
				<${App} onWin=${this.handleWin} onLoose=${this.handleLoose} />
			`
		if (didWin)
			return html`
				<${WinScreen} onNewGame=${this.handleNewGame} />
			`
		return html`
			<${SplashScreen} onNewGame=${this.handleNewGame} onContinue=${this.handleLoadGame} />
		`
	}
}

const SplashScreen = props => html`
	<article class="Splash">
		<h1>Slay the Web</h1>
		<h2>A little card crawl adventure for you and your browser.</h2>
		${location.hash &&
			html`
				<p>
					Oh, it seems you have a saved game.
					<button autofocus onClick=${props.onContinue}>Continue?</button>
				</p>
			`}
		<p><button autofocus onClick=${props.onNewGame}>Play</a></p>
	</article>
`

const WinScreen = props => html`
	<article class="Splash">
		<h1>Well done. You won.</h1>
		<p><button autofocus onClick=${props.onNewGame}>Play again</a></p>
	</article>
`

render(
	html`
		<${Main} />
	`,
	document.querySelector('#root')
)

// enum GameMode {
//  	CHAR_SELECT, GAMEPLAY, DUNGEON_TRANSITION, SPLASH;
// }
