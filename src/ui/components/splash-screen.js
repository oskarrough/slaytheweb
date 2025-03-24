import {html, Component} from '../lib.js'
import {getRuns} from '../../game/backend.js'
import {timeSince} from '../../utils.js'
import gsap from '../animations.js'
import {DeckChooser} from './deck-chooser.js'

export default class SplashScreen extends Component {
	constructor() {
		super()
		this.state = {
			runs: [],
			selectedDeck: null,
			deckSelectionMode: false,
		}

		this.handleDeckSelected = this.handleDeckSelected.bind(this)
		this.handleStartGame = this.handleStartGame.bind(this)
		this.startDeckSelection = this.startDeckSelection.bind(this)
	}

	componentDidMount() {
		getRuns().then(({runs}) => this.setState({runs}))

		gsap.from(this.base, {duration: 0.3, autoAlpha: 0, scale: 0.98})
		gsap.to(this.base.querySelector('.Splash-spoder'), {delay: 5, x: 420, y: 60, duration: 3})
	}

	handleDeckSelected(deck) {
		this.setState({selectedDeck: deck})
	}

	handleStartGame() {
		if (this.state.selectedDeck) {
			this.props.onNewGame(this.state.selectedDeck)
		}
	}

	startDeckSelection() {
		this.setState({deckSelectionMode: true})
	}

	render(props, state) {
		const run = state.runs[0]

		if (state.deckSelectionMode) {
			return html`
				<article class="Splash Container">
					<header class="Header">
						<h1>Choose Your Deck</h1>
						<h2>Select a deck to begin your adventure</h2>
					</header>
					<${DeckChooser} onSelectDeck=${this.handleDeckSelected} />
					<div class="Box">
						<ul class="Options">
							<li>
								<button onClick=${this.handleStartGame} disabled=${!state.selectedDeck} class="Button">
									Start Game
								</button>
							</li>
						</ul>
					</div>
				</article>
			`
		}

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
							<li><button autofocus onClick=${this.startDeckSelection}>Play</a></li>
							<li><a class="Button" href="/?debug&tutorial">Tutorial</a></li>
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
