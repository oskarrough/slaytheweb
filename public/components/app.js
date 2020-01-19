import {html, Component} from './../vendor/htm-preact-standalone.mjs'
import Player from './player.js'
import Cards from './cards.js'
import Queue from './queue.js'
import queue from '../queue.js'
import {pickCard} from '../actions.js'

const starterDeck = [
	pickCard('Bash'),
	pickCard('Defend'),
	pickCard('Defend'),
	pickCard('Defend'),
	pickCard('Defend'),
	pickCard('Strike'),
	pickCard('Strike'),
	pickCard('Strike'),
	pickCard('Strike')
]

export default class App extends Component {
	constructor(props) {
		super(props)
		this.state = {cards: starterDeck}
		// console.log(this.state.cards)
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
		// drop.on('sortable:start', () => {
		// 	console.log('sortable:start')
		// })
		// drop.on('sortable:sort', () => {
		// 	console.log('sortable:sort')
		// })
		// drop.on('sortable:sorted', () => {
		// 	console.log('sortable:sorted')
		// })
		drop.on('sortable:stop', event => {
			// console.log('sortable:stop', event)
			const draggedElement = event.data.dragEvent.originalSource
			const {newContainer} = event.data
			const wasDiscarded = newContainer.classList.contains('Cards--discard')
			console.log({draggedElement, wasDiscarded})
			const card = this.state.cards.find(card => card.id === draggedElement.dataset.id)
			queue.add('playCard', card)
		})
	}
	render(props, state) {
		return html`
			<div class="App">
				<div class="u-flex">
					<${Player} name="Angelicka" />
					<${Player} name="Mr. T" />
				</div>
				<${Cards} />
				<${Queue} queue=${queue.list} />
				<${Cards} cards=${state.cards} />
			</div>
		`
	}
}
