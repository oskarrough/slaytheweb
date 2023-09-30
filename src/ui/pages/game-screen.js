import {html, Component} from '../lib.js'
import gsap from '../animations.js'
import Flip from 'gsap/Flip'

// Game logic
import createNewGame from '../../game/new-game.js'
import {createCard, getCardRewards} from '../../game/cards.js'
import {getCurrRoom, isCurrRoomCompleted, isDungeonCompleted} from '../../game/utils-state.js'
import * as backend from '../../game/backend.js'

import {saveToUrl, loadFromUrl} from '../save-load.js'
import sounds from '../sounds.js'

// UI Components
import CampfireRoom from '../components/campfire.js'
import Cards from '../components/cards.js'
import enableDragDrop from '../dragdrop.js'
import DungeonStats from '../components/dungeon-stats.js'
import Map from '../components/map.js'
import Menu from '../components/menu.js'
import {Overlay, OverlayWithButton} from '../components/overlays.js'
import {Player, Monster} from '../components/player.js'
import {PublishRun} from '../components/publish-run.js'
import StartRoom from '../components/start-room.js'
import VictoryRoom from '../components/victory-room.js'

export default class App extends Component {
	get didWin() {
		return isCurrRoomCompleted(this.state)
	}
	get isDead() {
		return this.state.player.currentHealth < 1
	}
	get didWinEntireGame() {
		return isDungeonCompleted(this.state)
	}

	constructor() {
		super()
		// Props
		this.base = undefined
		this.state = undefined
		this.game = {}
		this.overlayIndex = 11

		// Scope methods
		this.playCard = this.playCard.bind(this)
		this.handlePlayerReward = this.handlePlayerReward.bind(this)
		this.handleCampfireChoice = this.handleCampfireChoice.bind(this)
		this.goToNextRoom = this.goToNextRoom.bind(this)
		this.toggleOverlay = this.toggleOverlay.bind(this)
		this.handleMapMove = this.handleMapMove.bind(this)
	}

	componentDidMount() {
		const urlParams = new URLSearchParams(window.location.search)
		const debugMode = urlParams.has('debug')

		// Set up a new game
		const game = createNewGame()
		this.game = game

		if (debugMode) {
			// this.game.enqueue({type: 'removeHealth', amount: 10, target: 'player'})
			// this.game.enqueue({type: 'addEnergyToPlayer', amount: 10})
			const roomIndex = game.state.dungeon.graph[1].findIndex((r) => r.room)
			this.game.enqueue({type: 'move', move: {y: 1, x: roomIndex}})
			this.game.enqueue({type: 'iddqd'})
			this.game.dequeue()
			this.game.dequeue()
		}

		this.setState(game.state, this.dealCards)
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
			submitGame(playerName) {
				backend.postRun(this.game, playerName)
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
		this.goToNextRoom()
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
		this.goToNextRoom()
	}

	goToNextRoom() {
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
		const noEnergy = !state.player.currentEnergy

		// There's a lot here because I did not want to split into too many files.
		return html`
			<div class="App" tabindex="0" onKeyDown=${(e) => this.handleShortcuts(e)}>
				<figure class="App-background" data-room-index=${state.dungeon.y}></div>

				${room.type === 'start' && html`<${Overlay}><${StartRoom} onContinue=${this.goToNextRoom} /><//>`}

				${
					this.isDead &&
					html`<${Overlay}>
						<div class="Container">
							<h1 center>You are dead</h1>
							<${PublishRun} game=${this.game}><//>
							<${DungeonStats} dungeon=${state.dungeon}><//>
							<button onClick=${() => this.props.onLoose()}>Try again?</button>
						</div>
					<//> `
				}

				${
					state.won &&
					html`<${Overlay}>
						<div class="Container CContainer--center">
							<h1 center>You won!</h1>
							<${PublishRun} game=${this.game}><//>
							<${DungeonStats} dungeon=${state.dungeon}><//>
							<p><button onClick=${() => this.props.onWin()}>Continue</button></p>
						</div>
					<//> `
				}

				${
					!this.didWinEntireGame &&
					this.didWin &&
					room.type === 'monster' &&
					html`<${Overlay}>
						<${VictoryRoom}
							gameState=${state}
							onSelectCard=${(card) => this.handlePlayerReward('addCard', card)}
							onContinue=${() => this.goToNextRoom()}
						><//>
					<//> `
				}

				${
					room.type === 'campfire' &&
					html`<${Overlay}>
						<${CampfireRoom}
							gameState=${state}
							onChoose=${this.handleCampfireChoice}
							onContinue=${this.goToNextRoom}
						><//>
					<//>`
				}

				<div class="Targets Split">
					<div class="Targets-group">
						<${Player} model=${state.player} name="Player" />
					</div>
					<div class="Targets-group">
						${
							room.monsters &&
							room.monsters.map(
								(monster) => html`<${Monster} model=${monster} gameState=${state} />`,
							)
						}
					</div>
				</div>

				<div class="Split ${noEnergy ? 'no-energy' : ''}">
					<div class="EnergyBadge">
							<span class="tooltipped tooltipped-e tooltipped-multiline" aria-label="Cards costs energy and this badge shows how much you have left this turn. Next turn your energy is refilled.">${
								state.player.currentEnergy
							}/${state.player.maxEnergy}</span>
					</div>
					<p class="Actions">
						<button class="EndTurn" onClick=${() => this.endTurn()}>
							<u>E</u>nd turn
						</button>
					</p>
				</div>

				<div class="Hand">
					<${Cards} gameState=${state} type="hand" />
				</div>

				<${OverlayWithButton} id="Menu" topleft>
					<button onClick=${() => this.toggleOverlay('#Menu')}><u>Esc</u>ape</button>
					<div class="Overlay-content">
							<${Menu} gameState=${state} game=${this.game} onUndo=${() => this.undo()} />
					</div>
				<//>

				<${OverlayWithButton} id="Map" topright key=${1}>
					<button align-right onClick=${() => this.toggleOverlay('#Map')}><u>M</u>ap</button>
					<div class="Overlay-content">
						<${Map} dungeon=${state.dungeon} onMove=${this.handleMapMove} />
					</div>
				<//>

				<${OverlayWithButton} id="Deck" topright topright2>
					<button class="tooltipped tooltipped-se" aria-label="All the cards you own" onClick=${() =>
						this.toggleOverlay('#Deck')}><u>D</u>eck ${state.deck.length}</button>
					<div class="Overlay-content">
						<${Cards} gameState=${state} type="deck" />
					</div>
				<//>

				<${OverlayWithButton} id="DrawPile" bottomleft>
					<button class="tooltipped tooltipped-ne" aria-label="The cards you'll draw next in random order" onClick=${() =>
						this.toggleOverlay('#DrawPile')}>Dr<u>a</u>w pile ${state.drawPile.length}</button>
					<div class="Overlay-content">
						<${Cards} gameState=${state} type="drawPile" />
					</div>
				<//>

				<${OverlayWithButton} id="exhaustPile" topleft topleft2>
					<button class="tooltipped tooltipped-se" aria-label="The cards you have exhausted in this encounter" onClick=${() =>
						this.toggleOverlay('#exhaustPile')}>E<u>x</u>haust pile ${
						state.exhaustPile.length
					}</button>
					<div class="Overlay-content">
						<${Cards} gameState=${state} type="exhaustPile" />
					</div>
				<//>

				<${OverlayWithButton} id="DiscardPile" bottomright>
					<button onClick=${() =>
						this.toggleOverlay(
							'#DiscardPile',
						)} align-right class="tooltipped tooltipped-nw tooltipped-multiline" aria-label="Cards you've already played. Once the draw pile is empty, these cards are shuffled into your draw pile.">Di<u>s</u>card pile ${
						state.discardPile.length
					}</button>
					<div class="Overlay-content">
						<${Cards} gameState=${state} type="discardPile" />
					</div>
				<//>
		</div>
		`
	}
}
