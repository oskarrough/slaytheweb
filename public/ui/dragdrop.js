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
		const cards = this.base.querySelector('.Hand .Cards')
		const targets = this.base.querySelectorAll('.Target')
		const {onAdd} = this.props

		// Allow dragging cards.
		new Sortable(cards, {
			group: 'cards',
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

		// Allow dropping cards on top of "targets". Dropping a card triggers props.onAdd().
		targets.forEach((el) => {
			new Sortable(el, {
				group: {
					name: 'target',
					pull: false,
					put: ['cards'],
				},
				draggable: '.TRICKYOUCANT',
				// When you drop, play the card.
				onAdd(event) {
					const {item, to} = event
					const index = Array.from(to.parentNode.children).indexOf(to)
					const target = to.dataset.type + index
					// Remove active class from any other targets.
					targets.forEach((t) => t.classList.remove(overClass))
					// Callback
					onAdd(item.dataset.id, target, item)
				},
			})
		})
	}
	render({children}) {
		return html`<div class="DragDrop">${children}</div>`
	}
}
