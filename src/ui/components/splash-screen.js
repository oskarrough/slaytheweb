import {html, Component} from '../lib.js'
import {getRuns} from '../../game/backend.js'
import {timeSince} from '../../utils.js'
import gsap from '../animations.js'
// import * as customDecks from '../../content/decks.js'

export default class SplashScreen extends Component {
	constructor() {
		super()
		this.state = {
			runs: [],
			selectedDeck: null,
		}

		this.handleStartGame = this.handleStartGame.bind(this)
	}

	componentDidMount() {
		getRuns().then(({runs}) => this.setState({runs}))
		gsap.from(this.base, {duration: 0.3, autoAlpha: 0, scale: 0.98})
		// @ts-ignore
		gsap.to(this.base.querySelector('.Splash-spoder'), {delay: 5, x: 420, y: 60, duration: 3})
	}

	handleDeckSelected(deck) {
		this.setState({selectedDeck: deck})
	}

	handleStartGame() {
		this.props.onNewGame(this.state.selectedDeck)
	}

	render(props, state) {
		const run = state.runs[0]
		return html`
			<article class="Splash Container">
				<header class="Header">
					<h1>Slay the Web</h1>
					<h2>A card crawl adventure for you and your browser</h2>
					<img class="Splash-spoder" src="/images/spoder.png" title="Oh hello" />
				</header>
				<div class="Box">
					<ul class="Options">
						${location.hash
							? html`
								<li>Found a saved game. <button autofocus onClick=${this.props.onContinue}>Continue?</button></li>
								<li><button onClick=${this.props.onNewGame}>New Game</a></li>
					`
							: html`
									<li><button autofocus onClick=${this.props.onNewGame}>Play</button></li>
									<!-- <li><button onClick=${this.startDeckSelection}>Custom Game</button></li> -->
									<li><a class="Button" href="/?debug&tutorial">Tutorial</a></li>
									<li><a class="Button" href="/deck-builder">Deck Builder</a></li>
								`}
						<li><a class="Button" href="/collection">Collection</a></li>
						<li>
							<a class="Button" href="/stats">Highscores</a>
							${this.state.runs.length > 0
								? html` <a class="LastRun" href=${`/stats/run?id=${run.id}`}>
										Someone ${run.won ? 'won' : 'lost'} ${timeSince(run.createdAt)}
									</a>`
								: ''}
						</li>
					</ul>
					<p center><a href="/changelog">Changelog</a> & <a href="/manual">Manual</a></p>
				</div>
			</article>
		`
	}
}
