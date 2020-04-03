import {html, render, Component} from '../web_modules/htm/preact/standalone.module.js'
import App from './app.js'

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
		<details class="Splash-details">
			<summary>How to play</summary>
			<p>Slay the Web is a single player card game where you fight monsters to reach the end of the web. It's a game of planning, strategy and knowing when to play which card.</p>
			<p>Every turn you get 3 energy to play cards. Cards deal damage to monsters, block enemy attacks or make enemies weak, vulnerable, heal you and other things.</p>
			<p>Beware, whenever your turn is ended, the monsters take turn.</p>
			<p>Should you manage to kill the monsters in a room before they end you, you'll proceed to the next room. Can you reach the end?</p>
		</details>
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
