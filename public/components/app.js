// Third party dependencies
import {html, Component} from '../web_modules/htm/preact/standalone.module.js'
import {Sortable, OnSpill} from '../web_modules/sortablejs/modular/sortable.core.esm.js'

// Game logic
import ActionManager from '../game/action-manager.js'
import actions from './../game/actions.js'
import {isCurrentRoomCompleted} from '../game/utils.js'
import {createSimpleDungeon} from '../game/dungeon-encounters.js'
import {createCard} from './../game/cards.js'

// Components
import {Player, Monster} from './player.js'
import Cards from './cards.js'
import History from './history.js'

export default class App extends Component {
	constructor() {
		super()
		// Set up our action manager.
		this.am = ActionManager()

		// Prepare the game.
		let state = actions.createNewGame()
		state = actions.setDungeon(state, createSimpleDungeon())
		state = actions.drawStarterDeck(state)
		state = actions.drawCards(state)
		// state.dungeon.index = 1 // use this to change room
		this.state = state

		// Enable debugging in the browser.
		window.slaytheweb = {
			component: this,
			actions,
			createCard
		}
	}

	componentDidMount() {
		this.enableDrop()
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
		this.enqueue({type: 'endTurn'})
		this.dequeue()
	}

	enableDrop() {
		const self = this

		// Enable required plugin for the 'revertOnSpill' option.
		Sortable.mount(OnSpill)

		// We want to be able to drag and drop cards in the hand.
		new Sortable(this.base.querySelector('.Hand .Cards'), {
			group: 'hand',
			draggable: '.Card',
			revertOnSpill: true,
			// sort: false,
			onMove: function(/**Event*/ event) {
				const card = self.state.hand.find(c => c.id === event.dragged.dataset.id)
				if (card.energy > self.state.player.currentEnergy) {
					alert('Not enough energy to play this card.')
					return false
				}
			}
		})
		// And we want all the targets (player + monsters) to be droppable.
		this.base.querySelectorAll('.Target').forEach(el => {
			new Sortable(el, {
				group: {
					name: 'player',
					put: ['hand']
				},
				draggable: '.TRICKYOUCANT',
				onAdd: function(event) {
					const {item, to} = event
					const card = self.state.hand.find(c => c.id === item.dataset.id)
					const index = Array.from(to.parentNode.children).indexOf(to)
					let target = to.dataset.type + index
					// Play the card immediately
					self.enqueue({type: 'playCard', target, card})
					self.dequeue()
				}
			})
		})
	}

	render(props, state) {
		const room = state.dungeon.rooms[state.dungeon.index]
		const didWin = isCurrentRoomCompleted(state)
		return html`
			<div class="App">
				<div class="Split">
					<${Player} model=${state.player} name="You" />
					<div class="Monsters">
						${room.monsters.map(
							(monster, index) =>
								html`
									<${Monster} model=${monster} name=${`Monster ${index}`} />
								`
						)}
					</div>
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

				<div class="Hand">
					<div class="EnergyBadge">${state.player.currentEnergy}/${state.player.maxEnergy}</div>
					<${Cards} cards=${state.hand} isHand=${true} />
				</div>

				<div class="Split">
					<details>
						<summary>Draw pile ${state.drawPile.length}</summary>
						<${Cards} cards=${state.drawPile} />
					</details>
					<details>
						<summary align-right>Discard pile ${state.discardPile.length}</summary>
						<${Cards} cards=${state.discardPile} />
					</details>
				</div>

				<div class="Split">
					<${History} future=${this.am.future.list} past=${this.am.past.list} />
					<p><button onclick=${() => this.undo()}>Undo</button></p>
				</div>
			</div>
		`
	}
}
