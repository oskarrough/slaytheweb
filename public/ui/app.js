// Third party dependencies
import {html, Component} from '../../web_modules/htm/preact/standalone.module.js'
import gsap from './animations.js'
import Flip from 'https://slaytheweb-assets.netlify.app/gsap/Flip.js'

// Game logic
import createNewGame from '../game/index.js'
import {getCurrRoom, isCurrentRoomCompleted, isDungeonCompleted} from '../game/utils.js'
import {createCard, getCardRewards} from './../game/cards.js'

// UI Components
import Cards from './cards.js'
import History from './history.js'
import Map from './map.js'
import {Overlay, OverlayWithButton} from './overlays.js'
import {Player, Monster} from './player.js'
import Rewards, {CardChooser} from './rewards.js'
import enableDragDrop from './dragdrop.js'

// Puts and gets the game state in the URL.
const save = (state) => (location.hash = encodeURIComponent(JSON.stringify(state)))
const load = () => JSON.parse(decodeURIComponent(window.location.hash.split('#')[1]))

export default class App extends Component {
	constructor() {
		super()
		this.overlayIndex = 11

		// Scope methods
		this.handlePlayerReward = this.handlePlayerReward.bind(this)
		this.playCard = this.playCard.bind(this)
		this.campfireReallyRemoveCard = this.campfireReallyRemoveCard.bind(this)
	}
	componentDidMount() {
		// Set up a new game
		const game = createNewGame()
		this.game = game
		this.setState(game.state, this.dealCards)

		// If there is a saved game state, use it.
		const savedGameState = window.location.hash && load()
		if (savedGameState) {
			this.game.state = savedGameState
			this.setState(savedGameState, this.dealCards)
		}

		// Enable a "console" in the browser.
		console.log(`
Welcome to the Slay The Web Console. Some examples:
stw.game.state.player.maxHealth = 999; stw.update()
stw.game.enqueue({type: 'drawCards', amount: 2})
stw.update()
stw.dealCards()
		`)
		window.stw = {
			game: this.game,
			update: this.update.bind(this),
			createCard,
			dealCards: this.dealCards.bind(this),
		}
	}
	update(callback) {
		this.game.dequeue()
		this.setState(this.game.state, callback)
	}
	undo() {
		this.game.undo()
		this.setState(this.game.state, this.dealCards)
	}
	playCard(cardId, target, cardElement) {
		// Play the card.
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
		enableDragDrop(this.base, this.playCard)
	}
	goToNextRoom() {
		this.game.enqueue({type: 'endTurn'})
		this.game.enqueue({type: 'goToNextRoom'})
		this.update(() => this.update(this.dealCards))
	}
	handlePlayerReward(card) {
		this.game.enqueue({type: 'rewardPlayer', card: card})
		this.update()
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
		if (key === 'd') toggle(this.base.querySelector('#Deck'))
		if (key === 'a') toggle(this.base.querySelector('#DrawPile'))
		if (key === 's') toggle(this.base.querySelector('#DiscardPile'))
		if (key === 'm') toggle(this.base.querySelector('#Map'))
	}
	campfireRest() {
		const amount = Math.floor(this.game.state.player.maxHealth * 0.3)
		this.game.enqueue({type: 'addHealth', target: 'player', amount})
		this.continueFromCampfire()
		alert(`Ahh.. rested for ${amount}.`)
	}
	campfireRemoveCard() {
		this.setState({isRemovingCard: !this.state.isRemovingCard})
	}
	campfireReallyRemoveCard(card) {
		this.game.enqueue({type: 'removeCard', card})
		this.update()
		this.setState({isRemovingCard: false})
		this.continueFromCampfire()
		alert(`Gone. ${card.name} has been removed from your deck.`)
	}
	continueFromCampfire() {
		this.game.enqueue({type: 'goToNextRoom'})
		this.update(() => this.update(this.dealCards))
	}
	render(props, state) {
		if (!state.player) return
		const isDead = state.player.currentHealth < 1
		const didWin = isCurrentRoomCompleted(state)
		const didWinEntireGame = isDungeonCompleted(state)
		const room = getCurrRoom(state)
		const noEnergy = !state.player.currentEnergy
		// There's a lot here because I did not want to split into too many files.
		return html`
			<div class="App" tabindex="0" onKeyDown=${(e) => this.handleShortcuts(e)}>
				<figure class="App-background" data-room-index=${state.dungeon.index}></div>
				${
					isDead &&
					html`<${Overlay}>
						<p>You are dead.</p>
						<button onclick=${() => this.props.onLoose()}>Try again?</button>
					<//> `
				}
				${
					didWinEntireGame &&
					html`<${Overlay}>
						<p center><button onclick=${() => this.props.onWin()}>You win!</button></p>
					<//> `
				}
				${
					!didWinEntireGame &&
					didWin &&
					html`<${Overlay}>
						<${Rewards} cards=${getCardRewards(3)} rewardWith=${this.handlePlayerReward} />
						<p center><button onclick=${() => this.goToNextRoom()}>Go to next room</button></p>
					<//> `
				}

				${
					room.type === 'campfire' &&
					html`<${Overlay}>
						<h1 center medium>Campfire</h1>
						<ul class="Options">
							<li><button onclick=${() => this.campfireRest()}>Rest</button></li>
							<li><button onclick=${() => this.campfireRemoveCard()}>Remove card</button></li>
						</ul>
						${state.isRemovingCard &&
						html` <p center>Choose a card to permanently remove from your deck.</p>
							<${CardChooser}
								cards=${state.deck}
								didSelectCard=${this.campfireReallyRemoveCard}
							/>`}
						<p center><button onclick=${() => this.continueFromCampfire()}>Continue</button></p>
					<//> `
				}

				<div class="Targets Split">
					<div class="Targets-group">
						<${Player} model=${state.player} name="Player" />
					</div>
					<div class="Targets-group">
						${
							room.monsters &&
							room.monsters.map(
								(monster) => html`<${Monster} model=${monster} gameState=${state} />`
							)
						}
					</div>
				</div>

				<div class="Split ${noEnergy ? 'no-energy' : ''}">
					<div class="EnergyBadge">
							<span>${state.player.currentEnergy}/${state.player.maxEnergy}</span>
					</div>
					<p class="Actions">
						<button class="EndTurn" onclick=${() => this.endTurn()}>
							<u>E</u>nd turn
						</button>
					</p>
				</div>

				<div class="Hand">
					<${Cards} gameState=${state} type="hand" />
				</div>

				<${OverlayWithButton} id="Menu" topleft>
					<summary><u>Esc</u>ape</summary>
					<div class="Splash">
						<h1>Slay the Web</h1>
						<p>
							<button onclick=${() => save(state)}>Save</button>
							<button onclick=${() => window.location.reload()}>Quit</button>
						</p>
						<${History} future=${this.game.future.list} past=${this.game.past.list} />
						<p>
							<button onclick=${() => this.undo()}><u>U</u>ndo</button><br />
						</p>
					</div>
				<//>
				<${OverlayWithButton} id="Map" topright>
					<summary align-right><u>M</u>ap</summary>
					<div class="Splash">
						<div class="Splash-details"><${Map} dungeon=${state.dungeon} /></div>
					</div>
				<//>
				<${OverlayWithButton} id="Deck" topright topright2>
					<summary><u>D</u>eck ${state.deck.length}</summary>
					<${Cards} gameState=${state} type="deck" />
				<//>
				<${OverlayWithButton} id="DrawPile" bottomleft>
					<summary>Dr<u>a</u>w pile ${state.drawPile.length}</summary>
					<${Cards} gameState=${state} type="drawPile" />
				<//>
				<${OverlayWithButton} id="DiscardPile" bottomright>
					<summary align-right>Di<u>s</u>card pile ${state.discardPile.length}</summary>
					<${Cards} gameState=${state} type="discardPile" />
				<//>
			</div>
		`
	}
}
