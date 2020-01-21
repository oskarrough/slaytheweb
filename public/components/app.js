import {html, Component} from '../web_modules/htm/preact/standalone.module.js'
import Player from './player.js'
import History from './history.js'
import Cards from './cards.js'
import Queue from '../game/queue.js'
import actions from '../game/actions.js'

const queue = new Queue()

// to test via the browser console
window.queue = queue
window.actions = actions

export default class App extends Component {
	constructor() {
		super()
		this.state = actions.createNewGame()
	}

	componentDidMount() {
		this.enableDrop()
	}

	runQueue() {
		const action = queue.next()
		if (!action) return
		// Actions have a "type" and a "state". They always return a new, modified state.
		const nextState = actions[action.type](action)
		console.log({nextState})
		this.setState(nextState)
	}

	enableDrop() {
		const drop = new window.Sortable.default(this.base.querySelectorAll('.dropzone'), {
			draggable: '.Card',
			mirror: {constrainDimensions: true}
		})
		// drop.on('drag:start', () => console.log('drag:start'))
		// drop.on('drag:move', () => console.log('drag:move'))
		// drop.on('drag:stop', () => console.log('drag:stop'))
		drop.on('sortable:start', event => {
			console.log('sortable:start', event)
			// const wasDiscarded = event.data.dragEvent.startContainer.classList.contains('Cards--discard')
			// console.log(wasDiscarded)
		})
		drop.on('sortable:sort', event => {
			console.log('sortable:sort', event)
			const wasDiscarded = event.data.dragEvent.overContainer.classList.contains('Cards--discard')
			const card = this.state.cards.find(card => card.id === event.data.dragEvent.originalSource.dataset.id)
			console.log({card, wasDiscarded})
			if (!wasDiscarded) {
				event.cancel()
			} else {
				queue.add({type: 'playCard', state: this.state, card, dragEvent: event})
			}
		})
		// drop.on('sortable:sorted', event => {
		// 	console.log('sortable:sorted', event)
		// })
		// drop.on('sortable:stop', event => {
		// 	console.log('sortable:stop', event)
		// })
	}
	render(props, state) {
		return html`
			<div class="App">
				<div class="u-flex">
					<${Player} player=${state.player1} />
					<${Player} player=${state.player2} name="Mr. T" />
				</div>
				<p>
					<button onclick=${() => queue.add({type: 'drawStarterDeck', state})}>Draw starter deck</button>
					<button onclick=${() => queue.add({type: 'playCard', state, card: state.cards[0]})}>Play first card</button>
					<button onclick=${() => this.runQueue()}>Run queue</button>
				</p>
				<${Cards} />
				<${History} queue=${queue.list} />
				<${Cards} cards=${state.cards} />
			</div>
		`
	}
}
