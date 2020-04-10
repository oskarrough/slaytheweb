// Third party dependencies
import {html, Component} from '../../web_modules/htm/preact/standalone.module.js'
import {Sortable, OnSpill} from '../../web_modules/sortablejs/modular/sortable.core.esm.js'

// Game logic
import ActionManager from '../game/action-manager.js'
import actions from './../game/actions.js'
import {isCurrentRoomCompleted} from '../game/utils.js'
import {createSimpleDungeon} from '../game/dungeon-encounters.js'
import {createCard, getRandomCards} from './../game/cards.js'

// Components
import {Player, Monster} from './player.js'
import Cards from './cards.js'
import History from './history.js'
import Map from './map.js'
import Rewards from './rewards.js'

// Puts and gets the game state in the URL.
const save = (state) => (location.hash = encodeURIComponent(JSON.stringify(state)))
const load = () => JSON.parse(decodeURIComponent(window.location.hash.split('#')[1]))

// A tiny overlay UI component.
const Overlay = (props) => html`
	<div class="Splash Overlay" topleft open>
		<div class="Splash-details">
			${props.children}
		</div>
	</div>
`

export default class App extends Component {
	constructor() {
		super()
		// Set up our action manager.
		this.am = ActionManager()
		this.overlayIndex = 11

		// scope button on click
		this.handlePlayerReward = this.handlePlayerReward.bind(this);

		// Set up either a saved or new game.
		const savedGame = window.location.hash && load()
		if (savedGame) {
			this.state = savedGame
		} else {
			let state = actions.createNewGame()
			state = actions.setDungeon(state, createSimpleDungeon())
			state = actions.addStarterDeck(state)
			state = actions.drawCards(state)
			this.state = state
		}
		// Enable debugging in the browser.
		window.slaytheweb = {
			component: this,
			actions,
			createCard,
		}
	}
	componentDidMount() {
		this.enableDrop()
	}
	enqueue(action) {
		this.am.enqueue(action)
	}
	dequeue(callback) {
		try {
			const nextState = this.am.dequeue(this.state)
			this.setState(nextState, callback)
			// save(nextState)
		} catch (err) {
			console.log(err)
			alert(err)
		}
	}
	undo() {
		const prev = this.am.past.takeFromTop()
		if (!prev) return
		this.setState(prev.state)
	}
	endTurn() {
		this.enqueue({type: 'endTurn'})
		this.dequeue()
	}
	goToNextRoom() {
		this.enqueue({type: 'endTurn'})
		this.enqueue({type: 'goToNextRoom'})
		// Enable dragdrop again because the DOM of the targets changed.
		this.dequeue(() => this.dequeue(this.enableDrop))
	}
	handlePlayerReward(card) {
		this.enqueue({type: "rewardPlayer", card: card});
		this.dequeue();
	}
	handleShortcuts(event) {
		const {key} = event
		if (key === 'e') this.endTurn()
		if (key === 'u') this.undo()
		// Overlays
		const toggle = (el) => {
			el.toggleAttribute('open')
			el.style.zIndex = this.overlayIndex
			this.overlayIndex++
		}
		if (key === 'Escape') {
			let openOverlays = this.base.querySelectorAll('details[open]:not(.Menu)')
			openOverlays.forEach((el) => el.removeAttribute('open'))
			toggle(this.base.querySelector('.Menu'))
		}
		if (key === 'a') toggle(this.base.querySelector('.DrawPile'))
		if (key === 's') toggle(this.base.querySelector('.DiscardPile'))
		if (key === 'm') toggle(this.base.querySelector('.Map'))
	}
	enableDrop() {
		const overClass = 'is-dragOver'
		const self = this
		// Enable required plugin for the 'revertOnSpill' option.
		Sortable.mount(OnSpill)
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
				// Do as little as possible here. It gets called a lot.
				targets.forEach((t) => t.classList.remove(overClass))
				event.to.classList.add(overClass)
			},
		})
		// And we want to be able to drop on all the targets (player + monsters)
		const targets = this.base.querySelectorAll('.Target')
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
					const card = self.state.hand.find((c) => c.id === item.dataset.id)
					const index = Array.from(to.parentNode.children).indexOf(to)
					let target = to.dataset.type + index
					self.enqueue({type: 'playCard', target, card})
					self.dequeue()
					targets.forEach((t) => t.classList.remove(overClass))
				},
			})
		})
	}
	render(props, state) {
		const room = state.dungeon.rooms[state.dungeon.index]
		const isDead = state.player.currentHealth < 1
		let didWin = isCurrentRoomCompleted(state)
		return html`
			<div class="App" tabindex="0" onKeyDown=${(e) => this.handleShortcuts(e)}>
				${isDead &&
				html`<${Overlay}>
					<p>You are dead.</p>
					<button onclick=${() => this.props.onLoose()}>Try again?</button>
				<//> `}
				${didWin &&
				html`<${Overlay}>
					<${Rewards}
						cards=${getRandomCards()}
						rewardWith=${this.handlePlayerReward}
					/>
				<//> `}
				<div class="Targets">
					<div class="Split">
						<${Player} model=${state.player} name="You" />
						<div class="Monsters">
							${room.monsters.map(
								(monster, index) =>
									html` <${Monster} model=${monster} name=${`Monster ${index}`} /> `
							)}
						</div>
					</div>
				</div>

				<div class="Split">
					<div class="EnergyBadge">
						${state.player.currentEnergy}/${state.player.maxEnergy}
					</div>
					<p class="Actions">
						<button onclick=${() => this.endTurn()}><u>E</u>nd turn</button>
					</p>
				</div>

				<div class="Hand">
					<${Cards} cards=${state.hand} isHand=${true} energy=${state.player.currentEnergy} />
				</div>

				<details class="Menu Overlay" topleft>
					<summary><u>Esc</u>ape</summary>
					<div class="Splash">
						<h1>Slay the Web</h1>
						<p>
							<button onclick=${() => save(state)}>Save</button>
							<button onclick=${() => window.location.reload()}>Quit</button>
						</p>
						<${History} future=${this.am.future.list} past=${this.am.past.list} />
						<p>
							<button onclick=${() => this.undo()}><u>U</u>ndo</button><br />
						</p>
					</div>
				</details>
				<details class="Map Overlay" topright>
					<summary align-right><u>M</u>ap</summary>
					<${Map} dungeon=${state.dungeon} />
				</details>
				<details class="DrawPile Overlay" bottomleft>
					<summary>Dr<u>a</u>w pile ${state.drawPile.length}</summary>
					<${Cards} cards=${state.drawPile} />
				</details>
				<details class="DiscardPile Overlay" bottomright>
					<summary align-right>Di<u>s</u>card pile ${state.discardPile.length}</summary>
					<${Cards} cards=${state.discardPile} />
				</details>
			</div>
		`
	}
}
