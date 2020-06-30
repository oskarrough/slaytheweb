import {html, render, Component} from '../web_modules/htm/preact/standalone.module.js'
import gsap from './../web_modules/gsap.js'
import App from './app.js'

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
		if (isPlaying) return html` <${App} onWin=${this.handleWin} onLoose=${this.handleLoose} /> `
		if (didWin) return html` <${WinScreen} onNewGame=${this.handleNewGame} /> `
		return html`
			<${SplashScreen} onNewGame=${this.handleNewGame} onContinue=${this.handleLoadGame} />
		`
	}
}

class SplashScreen extends Component {
	componentDidMount() {
		gsap.from('.Splash--fadein', {duration: 0.5, opacity: 0, scale: 0.9})
		gsap.from('.Splash--fadein button', {
			delay: 0.2,
			duration: 1,
			y: -20,
			scale: 0.1,
			ease: 'bounce',
		})
		gsap.from('.Splash--fadein details', {delay: 0.1, x: -50, duration: 0.4, opacity: 0})
	}
	render(props) {
		return html`
			<article class="Splash Splash--fadein">
				<h1>Slay the Web</h1>
				<h2>A little card crawl adventure for you and your browser.</h2>
				${
					location.hash &&
					html`
						<p>
							Oh, it seems you have a saved game.
							<button autofocus onClick=${props.onContinue}>Continue Game</button>
						</p>
					`
				}
				<p><button autofocus onClick=${props.onNewGame}>Play</a></p>
				<details class="Splash-details">
					<summary>Tutorial</summary>
					<p>Slay the Web is a single player card game where you fight monsters to reach the end of the web. It's a game of planning and knowing when to play which card.</p>
					<p>Every turn you get 3 energy to play cards. Cards have different energy costs to play. Cards deal damage to monsters, block enemy attacks or make enemies weak, vulnerable, heal you and other things. You'll figure it out.</p>
					<p>Beware, whenever you end your turn, the monsters take turn.</p>
					<p>Should you manage to kill the monsters in a room before they end you, you'll proceed to the next room. There will be rewards. Can you reach the end?</p>
					<p><a target="_blank" href="https://github.com/oskarrough/slaytheweb">View source</a></p>
				</details>
			</article>
		`
	}
}

const WinScreen = (props) => html`
	<article class="Splash">
		<h1>Well done. You won.</h1>
		<p><button autofocus onClick=${props.onNewGame}>Play again</a></p>
	</article>
`

render(html` <${Main} /> `, document.querySelector('#SlayTheWeb'))

// enum GameMode {
//  	CHAR_SELECT, GAMEPLAY, DUNGEON_TRANSITION, SPLASH;
// }
