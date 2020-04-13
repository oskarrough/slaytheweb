// Third party dependencies
import {html, Component} from '../../web_modules/htm/preact/standalone.module.js'
import {Sortable, OnSpill} from '../../web_modules/sortablejs/modular/sortable.core.esm.js'

// Enable required plugin for the 'revertOnSpill' option.
Sortable.mount(OnSpill)

// Class to add to the element we are dragging over.
const overClass = 'is-dragOver'

export default class App extends Component {
	componentDidMount() {
		this.enableDrop()
	}
	enableDrop() {
		const targets = this.base.querySelectorAll('.Target')
		const {onAdd} = this.props

		// We want to be able to drag cards in the hand.
		new Sortable(this.base.querySelector('.Hand .Cards'), {
			group: 'hand',
			draggable: '.Card:not([disabled])',
			sort: false,
			revertOnSpill: true,
			onSpill() {
				targets.forEach((t) => t.classList.remove(overClass))
			},
			onMove(event) {
				// Highlight the target you are holding a card over.
				// Do as little as possible here. It gets called a lot.
				targets.forEach((t) => t.classList.remove(overClass))
				event.to.classList.add(overClass)
			},
		})

		// And we want to be able to drop on all the targets (player + monsters)
		targets.forEach((el) => {
			new Sortable(el, {
				group: {
					name: 'player',
					pull: false,
					put: ['hand'],
				},
				draggable: '.TRICKYOUCANT',
				// When you drop, play the card.
				onAdd(event) {
					const {item, to} = event
					const index = Array.from(to.parentNode.children).indexOf(to)
					let target = to.dataset.type + index
					targets.forEach((t) => t.classList.remove(overClass))
					onAdd(item.dataset.id, target)
				},
			})
		})
	}
	render({children}) {
		return html`<div class="DragDrop">${children}</div>`
	}
}
