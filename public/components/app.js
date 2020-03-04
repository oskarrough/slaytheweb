import {html, Component} from '../web_modules/htm/preact/standalone.module.js'
import ActionManager from '../game/action-manager.js'
import actions from './../game/actions.js'
import {createCard} from './../game/cards.js'
import Player, {Monster, Healthbar} from './player.js'
import Cards from './cards.js'
import History from './history.js'

export default class App extends Component {
	constructor() {
		super()
		// Set up our action manager.
		this.am = ActionManager()
		// Prepare the game.
		this.am.enqueue({type: 'createNewGame'})
		this.state = this.am.dequeue({})
		this.am.enqueue({type: 'drawStarterDeck'})
		this.am.enqueue({type: 'drawCards'})
		// Enable debugging in the browser.
		window.slaytheweb = {
			component: this,
			actions,
			createCard
		}
	}

	componentDidMount() {
		this.enableDrop()
		// Dequeuing twice because of what we did in constructor.
		this.dequeue(this.dequeue)
	}

	enqueue(action) {
		this.am.enqueue(action)
	}

	dequeue(callback) {
		const nextState = this.am.dequeue(this.state)
		this.setState(nextState, callback)
	}

	undo() {
		const prev = this.am.past.takeFromTop()
		if (!prev) return
		console.log('Undoing', prev.action.type)
		this.setState(prev.state)
	}

	endTurn() {
		this.am.enqueue({type: 'endTurn'})
		this.dequeue()
	}

	enableDrop() {
		const dropzones = this.base.querySelectorAll('.dropzone')
		const drop = new window.Sortable.default(dropzones, {
			draggable: '.Card',
			mirror: {
				constrainDimensions: true
			}
		})
		drop.on('sortable:start', event => {
			// console.log('sortable:start', event)
			const card = this.state.hand.find(
				card => card.id === event.data.dragEvent.data.source.dataset.id
			)
			if (card.energy > this.state.player.currentEnergy) {
				event.cancel()
				alert('Not enough energy to play this card.')
			}
		})
		drop.on('sortable:sort', event => {
			// Only allow drop on discard pile.
			const el = event.dragEvent.data.overContainer
			if (!el.classList.contains('is-cardTarget')) {
				event.cancel()
			}
		})
		// drop.on('sortable:sorted', event => { console.log('sortable:sorted', event) })
		drop.on('sortable:stop', event => {
			const {newContainer, oldContainer} = event.data
			const wasDiscarded =
				newContainer.classList.contains('is-cardTarget') && newContainer !== oldContainer
			if (wasDiscarded) {
				event.cancel()
				const card = this.state.hand.find(
					card => card.id === event.data.dragEvent.originalSource.dataset.id
				)
				const discardedOnCardIndex = Array.from(newContainer.parentNode.children).indexOf(
					newContainer
				)
				this.enqueue({type: 'playCard', target: `enemy${discardedOnCardIndex}`, card})
				this.dequeue() // play card immediately
			}
		})
	}

	render(props, state) {
		const room = state.dungeon.getCurrentRoom()
		const didWin = room.isComplete()
		return html`
			<div class="App">
				<div class="Split">
					<${Player} player=${state.player} />
					<div class="Monsters">
						${room.monsters.map(Monster)}
					</div>
				</div>

				<div class="Hand">
					<h2>
						Hand
						<div class="Energybar">${state.player.currentEnergy}/${state.player.maxEnergy}</div>
					</h2>
					<${Cards} cards=${state.hand} isHand=${true} canDrag=${true} />
				</div>

				<p class="Actions">
					${didWin
						? html`
								<button onClick=${props.onWin}>YOU WON! Try again?</button>
						  `
						: html`
								<button onclick=${() => this.endTurn()}>End turn</button>
						  `}
				</p>

				<div class="Split" style="margin-top: auto">
					<details>
						<summary>Draw pile ${state.drawPile.length}</summary>
						<${Cards} cards=${state.drawPile} />
					</details>
					<details>
						<summary align-right>Discard pile ${state.discardPile.length}</summary>
						<${Cards} cards=${state.discardPile} isDiscardPile=${true} />
					</details>
				</div>

				<${History} future=${this.am.future.list} past=${this.am.past.list} />
				<p><button onclick=${() => this.undo()}>Undo</button></p>
			</div>
		`
	}
}
