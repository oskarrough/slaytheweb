import {html, Component} from './../web_modules/htm/preact/standalone.module.js'
import Player from './player.js'
import History from './history.js'
import Cards from './cards.js'
import queue from '../game/queue.js'
import {drawStarterDeck} from '../game/actions.js'

queue.add('drawStarterDeck')
const starterDeck = drawStarterDeck()

export default class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			cards: starterDeck,
			player1: {
				maxEnergy: 3,
				currentEnergy: 3,
				maxHealth: 100,
				currentHealth: 10
			},
			player2: {
				maxEnergy: 3,
				currentEnergy: 3,
				maxHealth: 100,
				currentHealth: 10
			}
		}
		console.log({gameState: this.state})
	}
	componentDidMount() {
		this.enableDrop()
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
				queue.add('playCard', {card, dragEvent: event})
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
				<${Cards} />
				<${History} queue=${queue.list} />
				<${Cards} cards=${state.cards} />
			</div>
		`
	}
}
