import Flip from 'gsap/Flip'
import {html, Component} from '../lib.js'
import gsap from '../animations.js'

// Game logic
import createNewGame from '../../game/new-game.js'
import {createCard} from '../../game/cards.js'
import {getCurrRoom, isCurrRoomCompleted, isDungeonCompleted} from '../../game/utils-state.js'
import {saveToUrl, loadFromUrl} from '../save-load.js'
import sounds from '../sounds.js'

// UI Components
import CampfireRoom from '../components/campfire.js'
import enableDragDrop from '../dragdrop.js'
import {Overlay} from '../components/overlay.js'
import {Overlays} from '../components/overlays.js'
import StartRoom from '../components/start-room.js'
import VictoryRoom from '../components/victory-room.js'
import DeathRoom from '../components/death-room.js'
import WonRoom from '../components/won-room.js'
import FightRoom from '../components/fight-room.js'

// props: onWin && onLoss
export default class App extends Component {
	constructor() {
		super()
		this.state = undefined
		this.game = createNewGame()
		this.overlayIndex = 11

		// Scope methods called from the UI
		this.undo = this.undo.bind(this)
		this.continue = this.onContinue.bind(this)
		this.handlePlayerReward = this.handlePlayerReward.bind(this)
		this.handleCampfireChoice = this.handleCampfireChoice.bind(this)
		this.handleMapMove = this.handleMapMove.bind(this)
		this.toggleOverlay = this.toggleOverlay.bind(this)
		this.playCard = this.playCard.bind(this)
		this.endTurn = this.endTurn.bind(this)
	}

	get didCompleteRoom() {
		return isCurrRoomCompleted(this.state)
	}
	get didWinEntireGame() {
		return isDungeonCompleted(this.state)
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

	restoreGame(oldState) {
		this.game.state = oldState
		this.setState(oldState, this.dealCards)
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

	update(callback) {
		this.game.dequeue()
		this.setState(this.game.state, callback)
	}

	undo() {
		this.game.undo()
		this.setState(this.game.state, this.dealCards)
	}

	/**
	 * Plays a card while juggling DOM animations and set state.
	 * @param {string} cardId
	 * @param {string} target
	 * @param {HTMLElement} cardElement
	 */
	playCard(cardId, target, cardElement) {
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
			sounds.playCard({card, target})

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

	endTurn() {
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
	dealCards() {
		gsap.effects.dealCards('.Hand .Card')
		sounds.startTurn()
		enableDragDrop(this.base, this.playCard)
	}

	toggleOverlay(el) {
		if (typeof el === 'string') el = this.base.querySelector(el)
		el.toggleAttribute('open')
		el.style.zIndex = this.overlayIndex
		this.overlayIndex++
	}

	handleShortcuts(event) {
		if (event.target.nodeName === 'INPUT') return
		const {key} = event
		const keymap = {
			e: () => this.endTurn(),
			u: () => this.undo(),
			Escape: () => {
				// let openOverlays = this.base.querySelectorAll('.Overlay:not(#Menu)[open]')
				let openOverlays = this.base.querySelectorAll(
					'#Deck[open], #DrawPile[open], #DiscardPile[open], #Map[open], #exhaustPile[open]',
				)
				openOverlays.forEach((el) => el.removeAttribute('open'))
				this.toggleOverlay('#Menu')
			},
			d: () => this.toggleOverlay('#Deck'),
			a: () => this.toggleOverlay('#DrawPile'),
			s: () => this.toggleOverlay('#DiscardPile'),
			m: () => this.toggleOverlay('#Map'),
			x: () => this.toggleOverlay('#exhaustPile'),
		}
		keymap[key] && keymap[key]()
	}

	handlePlayerReward(choice, card) {
		this.game.enqueue({type: 'addCardToDeck', card})
		this.setState({didPickCard: card})
		this.update()
		this.onContinue()
	}

	handleCampfireChoice(choice, reward) {
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
		this.onContinue()
	}

	onContinue() {
		console.log('Go to next room, toggling map')
		this.toggleOverlay('#Map')
	}

	handleMapMove(move) {
		console.log('Made a move')
		this.toggleOverlay('#Map')
		this.setState({didPickCard: false})
		this.game.enqueue({type: 'move', move})
		this.update(this.dealCards)
	}

	render(props, state) {
		if (!state.player) return
		const room = getCurrRoom(state)
		const isDead = this.state.player.currentHealth < 1
		const {game, onContinue, endTurn, handleCampfireChoice} = this

		// There's a lot here because I did not want to split into too many files.
		return html`
			<div class="App" tabindex="0" onKeyDown=${(e) => this.handleShortcuts(e)}>
				<figure class="App-background" data-room-index=${state.dungeon.y}></div>

				${isDead && html`<${Overlay}><${DeathRoom} game=${game} gameState=${state} onContinue=${props.onLoss} /><//>`}
				${state.won && html`<${Overlay}><${WonRoom} gameState=${game} state=${state} onContinue=${props.onWin} /><//>`}

				${room.type === 'start' && html`<${Overlay}><${StartRoom} onContinue=${onContinue} /><//>`}
				${room.type === 'monster' && html`<${FightRoom} gameState=${state} onEndTurn=${endTurn} />`}
				${
					room.type === 'monster' &&
					!this.didWinEntireGame &&
					this.didCompleteRoom &&
					html`<${Overlay}>
						<${VictoryRoom} gameState=${state} handlePlayerReward=${this.handlePlayerReward} onContinue=${onContinue} />
					<//> `
				}
				${
					room.type === 'campfire' &&
					html`<${Overlay}
						><${CampfireRoom} gameState=${state} onChoose=${handleCampfireChoice} onContinue=${onContinue}
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
