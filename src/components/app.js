import {html, Component} from './../vendor/htm-preact-standalone.mjs'
import models from './../models.js'
import Player from './player.js'
import Cards from './cards.js'

export default class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			cards: models.cards
		}
	}
	componentDidMount() {
		this.enableDrop()
	}
	enableDrop() {
		const drop = new Sortable.default(this.base.querySelectorAll('.dropzone'), {
			draggable: '.Card',
			mirror: {constrainDimensions: true}
		})
		drop.on('drag:start', () => console.log('drag:start'))
		drop.on('drag:move', () => console.log('drag:move'))
		drop.on('drag:stop', () => console.log('drag:stop'))
		drop.on('sortable:start', () => { console.log('sortable:start') })
		drop.on('sortable:sort', () => { console.log('sortable:sort') })
		drop.on('sortable:sorted', () => { console.log('sortable:sorted') })
		drop.on('sortable:stop', (event) => {
			console.log('sortable:stop', event)
			const draggedElement = event.data.dragEvent.originalSource
			const {newContainer, oldContainer} = event.data
			console.log({draggedElement, oldContainer, newContainer})
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
				<${Cards} cards=${state.cards} />
			</div>
		`
	}
}

