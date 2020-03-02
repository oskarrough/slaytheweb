import {html, render, Component} from './web_modules/htm/preact/standalone.module.js'
import App from '../components/app.js'

// Decides what to render: splash screen, "win" screen or the game itself.
// enum GameMode {
//  	CHAR_SELECT, GAMEPLAY, DUNGEON_TRANSITION, SPLASH;
// }

class Main extends Component {
	constructor() {
		super()
		this.state = {
			isPlaying: true
		}
		this.handleWin = this.handleWin.bind(this)
		this.handleNewGame = this.handleNewGame.bind(this)
	}
	handleNewGame() {
		this.setState({isPlaying: true, didWin: false})
	}
	handleWin() {
		this.setState({isPlaying: false, didWin: true})
	}
	render(props, {didWin, isPlaying}) {
		if (isPlaying)
			return html`
				<${App} onWin=${this.handleWin} />
			`
		if (didWin)
			return html`
				<${WinScreen} onNewGame=${this.handleNewGame} />
			`
		return html`
			<${SplashScreen} onNewGame=${this.handleNewGame} />
		`
	}
}

const SplashScreen = props => html`
	<article class="Splash">
		<h1>Slay the Web</h1>
		<h2>A little card crawl adventure in your browser. Work in progress.</h2>
		<p><button onClick=${props.onNewGame}>Start a new game</a></p>
	</article>
`

const WinScreen = props => html`
	<article class="Splash">
		<h1>Well done. You won.</h1>
		<p><button onClick=${props.onNewGame}>Start a new game</a></p>
	</article>
`

render(
	html`
		<${Main} />
	`,
	document.querySelector('#root')
)
