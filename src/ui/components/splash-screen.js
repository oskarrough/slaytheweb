import {getRuns} from '../../game/backend.js'
import {timeSince} from '../../utils.js'
import gsap from '../animations.js'
import {Component, html} from '../lib.js'
import {DeckSelector} from './deck-selector.js'

export default class SplashScreen extends Component {
	constructor() {
		super()
		this.state = {
			runs: [],
			selectedDeck: null,
			selectingDeck: false,
		}

		this.handleStartGame = this.handleStartGame.bind(this)
		this.startDeckSelection = this.startDeckSelection.bind(this)
	}

	componentDidMount() {
		gsap.from(this.base, {duration: 0.2, autoAlpha: 0, scale: 0.98})
		// @ts-expect-error
		gsap.to(this.base.querySelector('.Splash-spoder'), {delay: 5, x: 420, y: 60, duration: 3})
		getRuns().then(({runs}) => this.setState({runs}))
	}

	handleDeckSelected(deck) {
		this.setState({selectedDeck: deck}, () => {
			// Start game immediately when a deck is selected
			this.handleStartGame()
		})
	}

	startDeckSelection() {
		this.setState({selectingDeck: true})
	}

	handleStartGame() {
		this.props.onNewGame(this.state.selectedDeck)
	}

	render(_props, state) {
		const run = state.runs[0]

		if (state.selectingDeck) {
			return html`
				<article class="Splash Container Container--vcenter">
					<div class="Box">
						<ul class="Options">
							<li><button onClick=${() => this.setState({selectingDeck: false})}>← Menu</button></li>
						</ul>
						<br/>
						<h2>Choose a deck</h2>
						<${DeckSelector} onSelectDeck=${(deck) => this.handleDeckSelected(deck)} />
						<ul class="Options">
							<li><hr /></li>
							<li><a class="Button" href="/deck-builder">Deck builder →</a></li>
						</ul>
					</div>
				</article>
			`
		}

		return html`
			<article class="Splash Container Container--vcenter">
				<img class="Splash-spoder" src="/images/spoder.png" title="Oh hello" />
				<div class="Box">
					<h1 class="Splash-title">Slay the Web</h1>
					<ul class="Options">
						${
							location.hash
								? html`
									<li>
										Found a saved game. <button autofocus onClick=${this.props.onContinue}>Continue?</button>
									</li>
									<li><button onClick=${() => this.props.onNewGame()}>New Game</button></li>
								`
								: html`
									<li><button class="primary" autofocus onClick=${() => this.props.onNewGame()}>Play</button></li>
									<li><button onClick=${this.startDeckSelection}>Play custom deck</button></li>
									<li><hr /></li>
									<li><a class="Button" href="/?debug&tutorial">Tutorial</a></li>
									<li><a class="Button" href="/deck-builder">Deck Builder</a></li>
								`
						}
						<li><a class="Button" href="/collection">Collection</a></li>
						<li>
							<a class="Button" href="/stats"
								>Highscores
								${
									this.state.runs.length > 0 &&
									html` <a class="LastRun" href=${`/stats/run?id=${run.id}`}>
									Someone ${run.won ? 'won' : 'lost'} ${timeSince(run.createdAt)}
								</a>`
								}
							</a>
						</li>
						<li><a class="Button" href="/manual">Manual</a></li>
						<li><a class="Button" href="/changelog">Changelog</a></li>
					</ul>
				</div>
			</article>
		`
	}
}
