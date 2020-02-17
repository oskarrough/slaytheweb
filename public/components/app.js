import {html, Component} from '../web_modules/htm/preact/standalone.module.js'
import Player, {Healthbar} from './player.js'
import History from './history.js'
import Cards from './cards.js'
import Queue from '../game/queue.js'
import actions from '../game/actions.js'

export default class App extends Component {
	constructor() {
		super()
		// Set up our action manager.
		this.future = new Queue()
		this.past = new Queue()
		// Prepare the game.
		this.enqueue({type: 'createNewGame'})
		this.dequeue()
		this.enqueue({type: 'drawStarterDeck'})
		this.enqueue({type: 'drawCards'})
		// Enable debugging in the browser.
		window.kortgame = {
			state: this.state,
			future: this.future,
			past: this.past,
			actions
		}
	}

	componentDidMount() {
		this.enableDrop()
		this.dequeue(this.dequeue)
	}

	enqueue(action) {
		this.future.add(action)
	}

	dequeue(callback) {
		const action = this.future.next()
		if (!action) return
		try {
			const nextState = actions[action.type](this.state, action)
			this.past.add(action)
			this.setState(nextState, callback)
		} catch (err) {
			console.error(err)
		}
	}

	endTurn() {
		this.enqueue({type: 'endTurn'})
		this.dequeue()
	}

	enableDrop() {
		const drop = new window.Sortable.default(this.base.querySelectorAll('.dropzone'), {
			draggable: '.Card',
			mirror: {constrainDimensions: true}
		})
		drop.on('sortable:start', event => {
			// console.log('sortable:start', event)
			const card = this.state.hand.find(card => card.id === event.data.dragEvent.data.source.dataset.id)
			if (card.energy > this.state.player.currentEnergy) {
				event.cancel()
				alert('Not enough energy to play this card.')
			}
		})
		drop.on('sortable:sort', event => {
			// Only allow drop on discard pile.
			if (event.dragEvent.data.overContainer !== drop.containers[0]) {
				// console.log('canceled sortable:sort')
				event.cancel()
			}
		})
		// drop.on('sortable:sorted', event => { console.log('sortable:sorted', event) })
		drop.on('sortable:stop', event => {
			const {newContainer, oldContainer} = event.data
			const wasDiscarded = newContainer === drop.containers[0] && newContainer !== oldContainer
			if (wasDiscarded) {
				event.cancel()
				const card = this.state.hand.find(card => card.id === event.data.dragEvent.originalSource.dataset.id)
				this.enqueue({type: 'playCard', card})
				this.dequeue() // play card immediately
			}
		})
	}

	render(props, state) {
		const didWin = state.monster.currentHealth <= 0
		return html`
			<div class="App">
				<div class="Split">
					<${Player} player=${state.player} />
					<div class="Monster dropzone">
						<h2>Evil Monster</h2>
						<${Healthbar} max=${state.monster.maxHealth} value=${state.monster.currentHealth} />
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

				<${History} future=${this.future.list} past=${this.past.list} />
			</div>
		`
	}
}
