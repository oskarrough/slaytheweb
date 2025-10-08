import Flip from 'gsap/Flip'
import {cards} from '../../content/cards.js'
// Game logic
import allActions from '../../game/actions.js'
import {createCard} from '../../game/cards.js'
import createNewGame from '../../game/new-game.js'
import {getCurrRoom, isCurrRoomCompleted, isDungeonCompleted} from '../../game/utils-state.js'
import gsap from '../animations.js'
import enableDragDrop from '../dragdrop.js'
import startTutorial from '../intro-tutorial.js'
import {Component, html} from '../lib.js'
import {loadFromUrl, saveToUrl} from '../save-load.js'
import * as sounds from '../sounds.js'
// UI Components
import './img-sprite.js'
import CampfireRoom from './campfire.js'
import Cards from './cards.js'
import Console from './console.js'
import DungeonStats from './dungeon-stats.js'
import Menu from './menu.js'
import {Overlay, OverlayWithButton} from './overlays.js'
import {Monster, Player} from './player.js'
import {PublishRun} from './publish-run.js'
import {SlayMap} from './slay-map.js'
import StartRoom from './start-room.js'
import VictoryRoom from './victory-room.js'

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
		this.debugMode = false
		this.freeMapNav = false

		// Scope methods
		this.playCard = this.playCard.bind(this)
		this.handlePlayerReward = this.handlePlayerReward.bind(this)
		this.handleCampfireChoice = this.handleCampfireChoice.bind(this)
		this.goToNextRoom = this.goToNextRoom.bind(this)
		this.toggleOverlay = this.toggleOverlay.bind(this)
		this.handleMapMove = this.handleMapMove.bind(this)
		this.jumpToAction = this.jumpToAction.bind(this)
		this.runAction = this.runAction.bind(this)
		this.toggleFreeMapNav = this.toggleFreeMapNav.bind(this)
	}

	componentDidMount() {
		const urlParams = new URLSearchParams(window.location.search)
		const debugMode = urlParams.has('debug')
		this.debugMode = debugMode

		// Set up a new game
		const game = createNewGame()
		this.game = game

		// Set the custom deck if one was selected
		if (this.props.selectedDeck) {
			this.game.enqueue({type: 'setDeck', cardNames: this.props.selectedDeck.cards})
			this.game.dequeue()
		}

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
		const actionNames = Object.keys(allActions).sort()
		const cardNames = cards.map((card) => card.name).sort()
		const self = this

		// @ts-expect-error
		window.stw = {
			// Core API
			game: this.game,
			run: this.runAction.bind(this),
			dealCards: this.dealCards.bind(this),
			createCard,
			saveGame: (state) => saveToUrl(state || this.state),

			// Discoverability
			get state() {
				return self.game.state
			},
			actions: actionNames,
			cards: cardNames,

			// Help system
			help(actionName) {
				if (!actionName) {
					console.log(`%cWelcome to the Slay The Web Console`, 'font-weight: bold; font-size: 14px')
					console.log(`\n%cCommon cheats:`, 'font-weight: bold')
					console.log(`stw.run('addHealth', {target: 'player', amount: 50})`)
					console.log(`stw.run('removeHealth', {target: 'player', amount: 10})`)
					console.log(`stw.run('addEnergyToPlayer', {amount: 5})`)
					console.log(`stw.run('drawCards', {amount: 3})`)
					console.log(`stw.run('addCardToHand', {card: stw.createCard('Strike')})`)
					console.log(`stw.run('iddqd')  // kill all monsters`)
					console.log(`\n%cDiscovery:`, 'font-weight: bold')
					console.log(`stw.actions      // list all ${actionNames.length} available actions`)
					console.log(`stw.cards        // list all ${cardNames.length} card names`)
					console.log(`stw.state        // view current game state`)
					console.log(`stw.help('addHealth')  // show help for specific action`)
					console.log(`\n%cUtilities:`, 'font-weight: bold')
					console.log(`stw.dealCards()`)
					console.log(`stw.saveGame()`)
				} else if (actionNames.includes(actionName)) {
					console.log(`%c${actionName}`, 'font-weight: bold')
					console.log(`Usage: stw.run('${actionName}', {/* params */})`)
					console.log('\nCheck the source code in src/game/actions.js for details')
				} else {
					console.log(`Unknown action: ${actionName}`)
					console.log(`Available actions:`, actionNames)
				}
			},
		}
		// @ts-expect-error
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

	redo() {
		const item = this.game.redo()
		if (item) {
			this.setState(item.state, this.dealCards)
		}
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
		clone.style.width = `${cardEl.offsetWidth}px`
		clone.style.height = `${cardEl.offsetHeight}px`
		clone.style.top = `${window.scrollY + cardRect.top}px`
		clone.style.left = `${window.scrollX + cardRect.left}px`
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
		const cards = this.base.querySelectorAll('.Hand .Card')
		if (!cards?.length) return
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
		const consoleOpen = this.base.querySelector('#Console[open]')
		const isTyping = ['INPUT', 'TEXTAREA'].includes(event.target.nodeName)

		// If console is open and we're typing in it, let console handle all keys
		if (consoleOpen && isTyping) return

		// If typing in other inputs (but console not open), ignore all shortcuts
		if (isTyping) return

		const {key} = event
		const keymap = {
			e: () => this.endTurn(),
			c: () => {
				event.preventDefault()
				this.toggleOverlay('#Console')
			},
			Escape: () => {
				event.preventDefault()
				const openOverlays = this.base.querySelectorAll(
					'#Deck[open], #DrawPile[open], #DiscardPile[open], #Map[open], #ExhaustPile[open], #Console[open]',
				)
				const hadOpenOverlays = openOverlays.length > 0
				openOverlays.forEach((el) => {
					el.removeAttribute('open')
				})
				if (!hadOpenOverlays) this.toggleOverlay('#Menu')
			},
			d: () => this.toggleOverlay('#Deck'),
			a: () => this.toggleOverlay('#DrawPile'),
			s: () => this.toggleOverlay('#DiscardPile'),
			m: () => this.toggleOverlay('#Map'),
			x: () => this.toggleOverlay('#ExhaustPile'),
		}
		keymap[key]?.()
	}

	handlePlayerReward(_choice, card) {
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

	jumpToAction(index) {
		// Destructive rewind: remove all actions after the selected index
		const past = this.game.past.list
		if (index < 0 || index >= past.length) return

		// Get the state at that point
		const targetState = past[index].state

		// Remove all actions after this index
		this.game.past.list = past.slice(0, index + 1)

		// Restore the state
		this.game.state = targetState
		this.setState(targetState, this.dealCards)
	}

	toggleFreeMapNav() {
		this.freeMapNav = !this.freeMapNav
		this.forceUpdate()
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
	render(_props, state) {
		if (!state.player) return
		const room = getCurrRoom(state)
		const showCombat = room.type === 'monster'

		return html`
			<div class="App" tabindex="0" onKeyDown=${(e) => this.handleShortcuts(e)}>
				<figure class="App-background" data-room-index=${state.dungeon.y}></div>

				${
					this.isDead &&
					html`<${Overlay} middle>
						<div class="Container">
							<h1 center>You are dead</h1>
							<${PublishRun} game=${this.game}><//>
							<${DungeonStats} dungeon=${state.dungeon}><//>
							<button class="Button" onClick=${() => this.props.onLoose()}>Try again?</button>
						</div>
					<//> `
				}

				${
					state.won &&
					html`<${Overlay} middle>
						<div class="Container CContainer--center">
							<h1 center>You won!</h1>
							<${PublishRun} game=${this.game}><//>
							<${DungeonStats} dungeon=${state.dungeon}><//>
							<p center><button class="Button" onClick=${() => this.props.onWin()}>Continue</button></p>
						</div>
					<//> `
				}

				${room.type === 'start' && html`<${Overlay} middle><${StartRoom} onContinue=${this.goToNextRoom} /><//>`}

				${
					room.type === 'campfire' &&
					html`<${Overlay} middle>
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
					html`<${Overlay} middle>
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
								${room.monsters?.map((monster) => html`<${Monster} model=${monster} gameState=${state} />`)}
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
								<button class="Button EndTurn" onClick=${() => this.endTurn()}><u>E</u>nd turn</button>
							</p>
						</div>

						<div class="Hand">
							<${Cards} gameState=${state} type="hand" />
						</div>
					`
				}

				<${OverlayWithButton} id="Menu" topleft middle>
					<button onClick=${() => this.toggleOverlay('#Menu')}><u>Esc</u>ape</button>
					<div class="Overlay-content">
							<${Menu} gameState=${state} game=${this.game} onUndo=${() => this.undo()} />
					</div>
				<//>

				<${OverlayWithButton} id="Map" topright key=${1}>
					<button align-right onClick=${() => this.toggleOverlay('#Map')}><u>M</u>ap</button>
					<div class="Overlay-content">
						<${SlayMap} dungeon=${state.dungeon} x=${state.dungeon.x} y=${state.dungeon.y} scatter=${20} debug=${this.debugMode} freeNavigation=${this.freeMapNav} onSelect=${this.handleMapMove}><//>
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
							'#DiscardPile',
						)} align-right class="tooltipped tooltipped-nw tooltipped-multiline" aria-label="Cards you've already played. Once the draw pile is empty, these cards are shuffled into your draw pile.">Di<u>s</u>card pile ${
						state.discardPile.length
					}</button>
					<div class="Overlay-content">
						<${Cards} gameState=${state} type="discardPile" />
					</div>
				<//>

				<div id="Console" class="Overlay" middle>
					<div class="Overlay-content">
						<${Console}
							game=${this.game}
							gameState=${state}
							onJumpToAction=${this.jumpToAction}
							onUndo=${() => this.undo()}
							onRedo=${() => this.redo()}
							onRunAction=${this.runAction}
							freeMapNav=${this.freeMapNav}
							onToggleFreeMapNav=${this.toggleFreeMapNav}
							onClose=${() => this.toggleOverlay('#Console')}
						/>
					</div>
					<figure class="Overlay-bg"></figure>
				</div>
		</div>
		`
	}
}
