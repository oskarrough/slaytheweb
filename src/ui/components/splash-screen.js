import {html, Component} from '../lib.js'
import {getRuns} from '../../game/backend.js'
import {timeSince} from '../../utils.js'
import gsap from '../animations.js'
import {DeckSelector} from './deck-selector.js'
import {DeckEditor} from './deck-editor.js'
import {getCustomDecks, deleteDeck} from '../../content/decks.js'

export default class SplashScreen extends Component {
	constructor() {
		super()
		this.state = {
			runs: [],
			selectedDeck: null,
			deckSelectionMode: false,
			deckEditorMode: false,
			customDecks: [],
		}

		this.handleDeckSelected = this.handleDeckSelected.bind(this)
		this.startDeckSelection = this.startDeckSelection.bind(this)
		this.handleStartGame = this.handleStartGame.bind(this)
		this.startDeckEditor = this.startDeckEditor.bind(this)
		this.handleSaveDeck = this.handleSaveDeck.bind(this)
		this.handleDeleteDeck = this.handleDeleteDeck.bind(this)
		this.handleCreateNewDeck = this.handleCreateNewDeck.bind(this)
	}

	componentDidMount() {
		getRuns().then(({runs}) => this.setState({runs}))

		// Load custom decks using deck service
		const customDecks = getCustomDecks()
		console.log('Loaded custom decks:', customDecks)
		this.setState({customDecks})

		gsap.from(this.base, {duration: 0.3, autoAlpha: 0, scale: 0.98})
		// @ts-ignore
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
		this.setState({deckSelectionMode: true, deckEditorMode: false})
	}

	startDeckEditor() {
		this.setState({deckEditorMode: true, deckSelectionMode: false})
	}

	handleSaveDeck(deck) {
		// Refresh custom decks from the deck service
		this.setState({
			customDecks: getCustomDecks(),
			selectedDeck: deck,
			deckEditorMode: false,
			deckSelectionMode: true,
		})
	}

	handleDeleteDeck(deckName) {
		// Use the deck service to delete
		const customDecks = deleteDeck(deckName)

		// Update state
		this.setState({
			customDecks,
			selectedDeck: null,
		})
	}

	handleCreateNewDeck() {
		this.setState({deckEditorMode: true, deckSelectionMode: false})
	}

	render(props, state) {
		const run = state.runs[0]

		if (state.deckEditorMode) {
			return html`
				<article class="Splash Container">
					<header class="Header"></header>
					<div class="Box">
						<ul class="Options">
							<li>
								<button onClick=${() => this.setState({deckEditorMode: false})} class="Button">Back</button>
							</li>
						</ul>
					</div>
					<${DeckEditor} onSaveDeck=${this.handleSaveDeck} />
				</article>
			`
		}

		if (state.deckSelectionMode) {
			return html`
				<article class="Splash Container">
					<header class="Header"></header>
					<div class="Box">
						<ul class="Options">
							<li>
								<button onClick=${() => this.setState({deckSelectionMode: false})} class="Button">
									Back
								</button>
							</li>
						</ul>
					</div>
					<${DeckSelector}
						onSelectDeck=${this.handleDeckSelected}
						customDecks=${state.customDecks}
						onDeleteDeck=${this.handleDeleteDeck}
						onCreateNewDeck=${this.handleCreateNewDeck}
					/>
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
									<li><button autofocus onClick=${this.props.onNewGame}>Play</button></li>
									<li><button onClick=${this.startDeckSelection}>Custom Game</button></li>
									<li><button onClick=${this.startDeckEditor}>Deck Builder</button></li>
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
