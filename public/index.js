import {html, render, Component} from './web_modules/htm/preact/standalone.module.js'
import App from '../components/app.js'

// Decides what to render: splash screen, "win" screen or the game itself.
class Main extends Component {
	state = {
			isPlaying: true,
			didWin: false
	}
	handleNewGame = () => {
		this.setState({isPlaying: true, didWin: false})
	}
	handleWin = () => {
		this.setState({isPlaying: false, didWin: true})
	}
	render(props, {didWin, isPlaying}) {
		if (isPlaying)
			return html`
				<${App} onWin=${this.win} />
			`
		if (didWin)
			return html`
				<${WinScreen} onNewGame=${this.handleNewgame} />
			`
		return html`
			<${SplashScreen} onNewGame=${this.handleNewGame} />
		`
	}
}

const SplashScreen = props => html`
	<article style="margin: 2rem">
		<h1>Kort Game</h1>
		<p><button onClick=${props.onNewGame}>Start a new game</a></p>
	</article>
`

const WinScreen = props => html`
	<article style="margin: 2rem">
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
