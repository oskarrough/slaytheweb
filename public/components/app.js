import {html, Component} from '../web_modules/htm/preact/standalone.module.js'
import Player from './player.js'
import History from './history.js'
import Cards from './cards.js'
import Queue from '../game/queue.js'
import actions from '../game/actions.js'

const queue = new Queue()

export default class App extends Component {
	constructor() {
		super()
		this.state = actions.createNewGame()
		// Debugging in the browser console.
		window.kortgame = {
			state: this.state,
			queue,
			actions
		}
	}

	componentDidMount() {
		this.enableDrop()
	}

	enqueue(what) {
		queue.add(what)
	}

	runQueue() {
		const action = queue.next()
		if (!action) return
		// Actions have a "type" and a "state". They return a new, modified state.
		console.log('runQueue', {action})
		const nextState = actions[action.type](action)
		this.setState(nextState)
		console.table(nextState)
	}

	enableDrop() {
		const drop = new window.Sortable.default(this.base.querySelectorAll('.dropzone'), {
			draggable: '.Card',
			mirror: {constrainDimensions: true}
		})
		// drop.on('drag:start', () => console.log('drag:start'))
		// drop.on('drag:move', () => console.log('drag:move'))
		// drop.on('drag:stop', () => console.log('drag:stop'))
		// drop.on('sortable:start', event => { console.log('sortable:start', event) })
		// drop.on('sortable:sort', event => { console.log('sortable:sort', event) })
		// drop.on('sortable:sorted', event => { console.log('sortable:sorted', event) })
		drop.on('sortable:stop', event => {
			// console.log('sortable:stop', event)
			const {newContainer, oldContainer} = event.data
			const wasDiscarded = newContainer.classList.contains('Cards--discard') && newContainer !== oldContainer
			if (!wasDiscarded) {
				event.cancel()
			} else {
				const card = this.state.cards.find(card => card.id === event.data.dragEvent.originalSource.dataset.id)
				this.enqueue({type: 'playCard', state: this.state, card})
			}
		})
	}

	render(props, state) {
		return html`
			<div class="App">
				<div class="u-flex">
					<${Player} player=${state.player1} />
					<${Player} player=${state.player2} name="Mr. T" />
				</div>
				<p>
					<button onclick=${() => this.enqueue({type: 'drawStarterDeck', state})}>Draw starter deck</button>
					<button onclick=${() => this.enqueue({type: 'playCard', state, card: state.cards[0]})}>
						Play first card
					</button>
				</p>

				<h2>Discard</h2>
				<${Cards} cards=${state.discardPile} isDiscardPile=${true} />

				<${History} history=${queue.list} />
				<p><button onclick=${() => this.runQueue()}>Run queue</button></p>
				<p><button onclick=${() => this.enqueue({type: 'endTurn', state})}>End turn</button></p>
				<h2>Hand</h2>
				<${Cards} cards=${state.hand} />

				<h2>Deck</h2>
				<${Cards} cards=${state.deck} />
			</div>
		`
	}
}
