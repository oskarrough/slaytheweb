import {html, Component} from '../lib.js'
import gsap from '../animations.js'
import Flip from 'gsap/Flip'

// Game logic
import createNewGame from '../../game/new-game.js'
import {createCard} from '../../game/cards.js'
import {getCurrRoom, isCurrRoomCompleted, isDungeonCompleted} from '../../game/utils-state.js'
import {saveToUrl, loadFromUrl} from '../save-load.js'
import sounds from '../sounds.js'

// UI Components
import CampfireRoom from './campfire.js'
import Cards from './cards.js'
import enableDragDrop from '../dragdrop.js'
import DungeonStats from './dungeon-stats.js'
import {SlayMap} from './slay-map.js'
import Menu from './menu.js'
import {Overlay, OverlayWithButton} from './overlays.js'
import {Player, Monster} from './player.js'
import {PublishRun} from './publish-run.js'
import StartRoom from './start-room.js'
import VictoryRoom from './victory-room.js'
import startTutorial from '../intro-tutorial.js'

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
			const roomIndex = game.state.dungeon.graph[1].findIndex((r) => r.room)
			this.game.enqueue({type: 'move', move: {y: 1, x: roomIndex}})
			this.game.dequeue()
		}

		if (urlParams.has('iddqd')) {
			this.game.enqueue({type: 'iddqd'})
			this.game.dequeue()
		}

		if (urlParams.has('tutorial')) {
			setTimeout(startTutorial, 800)
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
			game: this.game,
			run: this.runAction.bind(this),
			dealCards: this.dealCards.bind(this),
			createCard,
			saveGame: (state) => saveToUrl(state || this.state),
			help() {
				console.log(`Welcome to the Slay The Web Console. Some examples:
stw.run('removeHealth', {amount: 6, target: 'player'})
stw.run('drawCards', {amount: 2})
stw.dealCards()`)
			},
		}
		// @ts-ignore
		window.stw.help()
	}

	runAction(actionName, props) {
		const action = {type: actionName, ...props}
		this.game.enqueue(action)
		this.update()
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
	 * @param {HTMLElement} cardEl
	 */
	playCard(cardId, target, cardEl) {
		const card = this.state.hand.find((c) => c.id === cardId)
		this.game.enqueue({type: 'playCard', card, target})
		const supportsFlip = typeof Flip !== 'undefined'
		let flip

		// For the hand animation later.
		if (supportsFlip) flip = Flip.getState('.Hand .Card')

		// Create a clone on top of the card to animate.
		const clone = cardEl.cloneNode(true)
		const cardRect = cardEl.getBoundingClientRect()
		clone.style.position = 'absolute'
		clone.style.width = cardEl.offsetWidth + 'px'
		clone.style.height = cardEl.offsetHeight + 'px'
		clone.style.top = window.scrollY + cardRect.top + 'px'
		clone.style.left = window.scrollX + cardRect.left + 'px'
		clone.style.transform = ''
		this.base.appendChild(clone)

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

	endTurn() {
		const room = getCurrRoom(this.state)
		if (!this.didWinEntireGame && this.didWin && room.type === 'monster') return

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
					'#Deck[open], #DrawPile[open], #DiscardPile[open], #Map[open], #ExhaustPile[open]'
				)
				const mapOpened = document.querySelector('#Map').hasAttribute('open')
				openOverlays.forEach((el) => el.removeAttribute('open'))
				if (!mapOpened) this.toggleOverlay('#Menu')
			},
			d: () => this.toggleOverlay('#Deck'),
			a: () => this.toggleOverlay('#DrawPile'),
			s: () => this.toggleOverlay('#DiscardPile'),
			m: () => this.toggleOverlay('#Map'),
			x: () => this.toggleOverlay('#ExhaustPile'),
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
		this.toggleOverlay('#Map')
		this.setState({didPickCard: false})
		this.game.enqueue({type: 'move', move})
		this.update(this.dealCards)
	}

	/**
	 * There's a lot here because I did not want to split into too many files.
	 * We render most things on top of each other,
	 * and hide them with css, for easier animations.
	 *
	 * .App>App-background
	 * 	room.type === start
	 * 	this.isDead
	 * 	state.won
	 * 	room.type === monster --> targets, energy, cards, actions/endturn
	 * 	!this.didWinEntireGame && this.didWin && room.type === 'monster' --> room victory screen
	 * 	room.type === campfire
	 */
	render(props, state) {
		if (!state.player) return
		const room = getCurrRoom(state)
		const showCombat = room.type === 'monster'

		return html`
			<div class="App" tabindex="0" onKeyDown=${(e) => this.handleShortcuts(e)}>
				<figure class="App-background" data-room-index=${state.dungeon.y}></div>

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

				${room.type === 'start' && html`<${Overlay}><${StartRoom} onContinue=${this.goToNextRoom} /><//>`}

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
					showCombat &&
					html`
						<div class="Targets Split">
							<div class="Targets-group">
								<${Player} model=${state.player} name="Player" />
							</div>
							<div class="Targets-group">
								${room.monsters &&
								room.monsters.map((monster) => html`<${Monster} model=${monster} gameState=${state} />`)}
							</div>
						</div>

						<div class="Split ${!state.player.currentEnergy ? 'no-energy' : ''}">
							<div class="EnergyBadge">
								<span
									class="tooltipped tooltipped-e tooltipped-multiline"
									aria-label="Cards costs energy and this badge shows how much you have left this turn. Next turn your energy is refilled."
									>${state.player.currentEnergy}/${state.player.maxEnergy}</span
								>
							</div>
							<p class="Actions">
								<button class="EndTurn" onClick=${() => this.endTurn()}><u>E</u>nd turn</button>
							</p>
						</div>

						<div class="Hand">
							<${Cards} gameState=${state} type="hand" />
						</div>
					`
				}

				<${OverlayWithButton} id="Menu" topleft>
					<button onClick=${() => this.toggleOverlay('#Menu')}><u>Esc</u>ape</button>
					<div class="Overlay-content">
							<${Menu} gameState=${state} game=${this.game} onUndo=${() => this.undo()} />
					</div>
				<//>

				<${OverlayWithButton} id="Map" topright key=${1}>
					<button align-right onClick=${() => this.toggleOverlay('#Map')}><u>M</u>ap</button>
					<div class="Overlay-content">
						<${SlayMap} dungeon=${state.dungeon} x=${state.dungeon.x} y=${state.dungeon.y} scatter=${20} onSelect=${this.handleMapMove}><//>
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

				<${OverlayWithButton} id="ExhaustPile" topleft topleft2>
					<button class="tooltipped tooltipped-se" aria-label="The cards you have exhausted in this encounter" onClick=${() =>
						this.toggleOverlay('#ExhaustPile')}>E<u>x</u>haust pile ${state.exhaustPile.length}</button>
					<div class="Overlay-content">
						<${Cards} gameState=${state} type="exhaustPile" />
					</div>
				<//>

				<${OverlayWithButton} id="DiscardPile" bottomright>
					<button onClick=${() =>
						this.toggleOverlay(
							'#DiscardPile'
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
