import Flip from 'gsap/Flip'
import {html, Component} from '../../lib.js'
import gsap from '../../animations.js'

// Game logic
import createNewGame from '../../../game/new-game.js'
import {createCard} from '../../../game/cards.js'
import {getCurrRoom, isCurrRoomCompleted, isDungeonCompleted} from '../../../game/utils-state.js'
import {saveToUrl, loadFromUrl} from '../../save-load.js'
import sounds from '../../sounds.js'

// UI Components
import CampfireRoom from '../campfire.js'
import enableDragDrop from '../../dragdrop.js'
import {Overlay} from '../overlay.js'
import {Overlays} from '../overlays.js'

import StartScreen from './start-screen.js'
import CombatScreen from './combat-screen.js'
import DeathScreen from './death-screen.js'
import VictoryScreen from './victory-screen.js'
import GameOverScreen from './game-over-screen.js'

/**
 * This is the main component.
 * It creates a new game, provides a UI to navigate the dungeon,
 * and routes each room to the right scene.
 */
export default class App extends Component {
	constructor() {
		super()
		this.state = undefined
		this.game = createNewGame()
		this.overlayIndex = 11
	}

	componentDidMount() {
		const urlParams = new URLSearchParams(window.location.search)
		const debugMode = urlParams.has('debug')

		if (debugMode) {
			// this.game.enqueue({type: 'removeHealth', amount: 10, target: 'player'})
			// this.game.enqueue({type: 'addEnergyToPlayer', amount: 10})
			const roomIndex = this.game.state.dungeon.graph[1].findIndex((r) => r.room)
			this.game.enqueue({type: 'move', move: {y: 1, x: roomIndex}})
			this.game.enqueue({type: 'iddqd'})
			this.game.dequeue()
			this.game.dequeue()
		}

		this.setState(this.game.state, this.dealCards)
		sounds.startGame()

		// If there is a saved game state, use it.
		const savedGameState = window.location.hash && loadFromUrl()
		if (savedGameState) this.restoreGame(savedGameState)

		this.enableConsole()
	}

	enableConsole() {
		// Enable a "console" in the browser.
		// @ts-ignore
		window.stw = {
			uiComponent: this,
			game: this.game,
			update: this.update.bind(this),
			saveGame: (state) => saveToUrl(state || this.state),
			createCard,
			dealCards: this.dealCards.bind(this),
			iddqd() {
				// console.log(this.game.state)
				this.game.enqueue({type: 'iddqd'})
				this.update(() => {
					// console.log(this.game.state)
				})
			},
			help() {
				console.log(`Welcome to the Slay The Web Console. Some examples:
stw.game.enqueue({type: 'drawCards', amount: 2})
stw.update()
stw.dealCards()`)
			},
		}
		// @ts-ignore
		window.stw.help()
	}

	restoreGame(oldState) {
		this.game.state = oldState
		this.setState(oldState, this.dealCards)
	}

	update(callback) {
		this.game.dequeue()
		this.setState(this.game.state, callback)
	}

	undo = () => {
		this.game.undo()
		this.setState(this.game.state, this.dealCards)
	}

	/**
	 * Plays a card while juggling DOM animations, sound and state.
	 * @param {string} cardId
	 * @param {string} target
	 * @param {HTMLElement} cardElement
	 */
	playCard = (cardId, target, cardElement) => {
		const card = this.state.hand.find((c) => c.id === cardId)
		this.game.enqueue({type: 'playCard', card, target})
		const supportsFlip = typeof Flip !== 'undefined'
		let flip

		// For the hand animation later.
		if (supportsFlip) flip = Flip.getState('.Hand .Card')

		// Create a clone on top of the card to animate.
		const clone = cardElement.cloneNode(true)
		this.base.appendChild(clone)
		if (supportsFlip) Flip.fit(clone, cardElement, {absolute: true})

		// Update state and re-enable dragdrop
		this.update(() => {
			enableDragDrop(this.base, this.playCard)
			sounds.playCard({card})

			// Animate cloned card away
			gsap.effects.playCard(clone).then(() => {
				clone.parentNode.removeChild(clone)
			})

			// Reposition hand
			if (supportsFlip) {
				Flip.from(flip, {
					duration: 0.3,
					ease: 'power3.inOut',
					absolute: true,
				})
			}
		})
	}

	endTurn = () => {
		sounds.endTurn()
		gsap.effects.discardHand('.Hand .Card', {
			onComplete: reallyEndTurn.bind(this),
		})
		function reallyEndTurn() {
			this.game.enqueue({type: 'endTurn'})
			this.update(this.dealCards)
		}
	}

	// Animate the cards in and make sure any new cards are draggable.
	dealCards = () => {
		gsap.effects.dealCards('.Hand .Card')
		sounds.startTurn()
		enableDragDrop(this.base, this.playCard)
	}

	toggleOverlay = (el) => {
		if (typeof el === 'string') el = this.base.querySelector(el)
		el.toggleAttribute('open')
		el.style.zIndex = this.overlayIndex
		this.overlayIndex++
	}

	closeOverlays() {
		const selector =
			'#Deck[open], #DrawPile[open], #DiscardPile[open], #Map[open], #exhaustPile[open]'
		let openOverlays = this.base.querySelectorAll(selector)
		openOverlays.forEach((el) => el.removeAttribute('open'))
	}

	handleShortcuts({target, key}) {
		if (target.nodeName === 'INPUT') return
		const keymap = {
			e: () => this.endTurn(),
			u: () => this.undo(),
			d: () => this.toggleOverlay('#Deck'),
			a: () => this.toggleOverlay('#DrawPile'),
			s: () => this.toggleOverlay('#DiscardPile'),
			m: () => this.toggleOverlay('#Map'),
			x: () => this.toggleOverlay('#exhaustPile'),
			Escape: () => {
				this.closeOverlays()
				this.toggleOverlay('#Menu')
			},
		}
		keymap[key] && keymap[key]()
	}

	handleVictoryReward = (choice, card) => {
		this.game.enqueue({type: 'addCardToDeck', card})
		this.setState({didPickCard: card})
		this.update()
		this.handleContinue()
	}

	handleCampfireChoice = (choice, reward) => {
		// Depending on the choice, run an action.
		if (choice === 'rest') {
			reward = Math.floor(this.game.state.player.maxHealth * 0.3)
			this.game.enqueue({type: 'addHealth', target: 'player', amount: reward})
		}
		if (choice === 'upgradeCard') {
			this.game.enqueue({type: 'upgradeCard', card: reward})
		}
		if (choice === 'removeCard') {
			this.game.enqueue({type: 'removeCard', card: reward})
		}
		// Store the result.
		this.game.enqueue({type: 'makeCampfireChoice', choice, reward})
		// Update twice (because two actions were enqueued)
		this.update(this.update)
		this.handleContinue()
	}

	handleContinue = () => {
		this.toggleOverlay('#Map')
	}

	handleMapMove = (move) => {
		this.toggleOverlay('#Map')
		this.setState({didPickCard: false})
		this.game.enqueue({type: 'move', move})
		this.update(this.dealCards)
	}

	render(props, state) {
		if (!state.player) return
		const room = getCurrRoom(state)
		const didCompleteRoom = isCurrRoomCompleted(this.state)
		const didWinEntireGame = isDungeonCompleted(this.state)
		const isPlayerDead = state.player.currentHealth < 1
		const {game, handleContinue, endTurn} = this

		// There's a lot here because I did not want to split into too many files.
		return html`
			<div class="App" tabindex="0" onKeyDown=${(e) => this.handleShortcuts(e)}>
				<figure class="App-background" data-room-index=${state.dungeon.y}></div>

				${
					isPlayerDead &&
					html`<${Overlay}
						><${DeathScreen} game=${game} gameState=${state} onContinue=${props.onLoss}
					/><//>`
				}

				${
					state.won &&
					html`<${Overlay}
						><${GameOverScreen} gameState=${game} state=${state} onContinue=${props.onWin}
					/><//>`
				}

				${room.type === 'start' && html`<${Overlay}><${StartScreen} onContinue=${handleContinue} /><//>`}

				${room.type === 'monster' && html`<${CombatScreen} gameState=${state} onEndTurn=${endTurn} />`}

				${
					room.type === 'monster' &&
					!didWinEntireGame &&
					didCompleteRoom &&
					html`<${Overlay}>
						<${VictoryScreen}
							gameState=${state}
							onChoose=${this.handleVictoryReward}
							onContinue=${handleContinue}
						/>
					<//> `
				}

				${
					room.type === 'campfire' &&
					html`<${Overlay}
						><${CampfireRoom}
							gameState=${state}
							onChoose=${this.handleCampfireChoice}
							onContinue=${handleContinue}
					/><//>`
				}

				<${Overlays}
					game=${game}
					gameState=${state}
					toggleOverlay=${this.toggleOverlay}
					undo=${this.undo}
					handleMapMove=${this.handleMapMove} />
		</div>
		`
	}
}
