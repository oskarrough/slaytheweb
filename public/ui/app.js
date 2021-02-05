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
import CardChooser from './card-chooser.js'
import CampfireRoom from './campfire.js'
import enableDragDrop from './dragdrop.js'

// Puts and gets the game state in the URL.
const save = (state) => (location.hash = encodeURIComponent(JSON.stringify(state)))
const load = () => JSON.parse(decodeURIComponent(window.location.hash.split('#')[1]))

export default class App extends Component {
	constructor() {
		super()
		this.overlayIndex = 11

		// Scope methods
		this.playCard = this.playCard.bind(this)
		this.handlePlayerReward = this.handlePlayerReward.bind(this)
		this.handleCampfireChoice = this.handleCampfireChoice.bind(this)
		this.goToNextRoom = this.goToNextRoom.bind(this)
		this.toggleOverlay = this.toggleOverlay.bind(this)
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
			iddqd() {
				this.game.state.dungeon.rooms.forEach((room) => {
					if (!room.monsters) return
					room.monsters.forEach((monster) => {
						monster.currentHealth = 1
					})
					this.update()
				})
			},
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
	toggleOverlay(el) {
		if (typeof el === 'string') el = this.base.querySelector(el)
		el.toggleAttribute('open')
		el.style.zIndex = this.overlayIndex
		this.overlayIndex++
	}
	handleShortcuts(event) {
		const {key} = event
		if (key === 'e') this.endTurn()
		if (key === 'u') this.undo()
		if (key === 'Escape') {
			let openOverlays = this.base.querySelectorAll('.Overlay:not(#Menu)[open]')
			openOverlays.forEach((el) => el.removeAttribute('open'))
			this.toggleOverlay('#Menu')
		}
		if (key === 'd') this.toggleOverlay('#Deck')
		if (key === 'a') this.toggleOverlay('#DrawPile')
		if (key === 's') this.toggleOverlay('#DiscardPile')
		if (key === 'm') this.toggleOverlay('#Map')
	}
	handlePlayerReward(choice, card) {
		this.game.enqueue({type: 'rewardPlayer', card})
		this.update()
		this.goToNextRoom()
	}
	handleCampfireChoice(choice, reward) {
		// step1
		const room = getCurrRoom(this.state)
		// step2
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
		// step3
		room.choice = choice
		room.reward = reward
		this.update()
		this.goToNextRoom()
	}
	goToNextRoom() {
		if (getCurrRoom(this.state).type === 'monster') {
			this.game.enqueue({type: 'endTurn'})
			this.game.enqueue({type: 'goToNextRoom'})
			this.update(() => this.update(this.dealCards))
		} else {
			this.game.enqueue({type: 'goToNextRoom'})
			this.update(this.dealCards)
		}
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
						<p center>You are dead.</p>
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
					room.type === 'monster' &&
					html`<${Overlay}>
						<h1 center medium>Victory. Onwards!</h1>
						${!state.didPickCard
							? html`
									<p center>Here is your reward. Pick a card to add to your deck.</p>
									<${CardChooser}
										cards=${getCardRewards(3)}
										didSelectCard=${(card) => this.handlePlayerReward('addCard', card)}
									/>
							  `
							: html`<p center>Added <strong>${state.didPickCard.name}</strong> to your deck.</p>`}
						<p center><button onclick=${() => this.goToNextRoom()}>Go to next room</button></p>
					<//> `
				}

				${
					room.type === 'campfire' &&
					html`<${Overlay}
						><${CampfireRoom}
							gameState=${state}
							onChoose=${this.handleCampfireChoice}
							onContinue=${this.goToNextRoom}
					/><//>`
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
					<button onClick=${() => this.toggleOverlay('#Menu')}><u>Esc</u>ape</button>
					<div class="Overlay-content">
						<div class="Splash">
							<h1 medium>Slay the Web</h1>
							<ul class="Options">
								<li><button onclick=${() =>
									save(
										state
									)} title="After saving, your entire game is stored in the URL. Copy it">Save</button></li>
								<li><button onclick=${() => (window.location = window.location.origin)}>Abandon Game</button></li>
							</ul>
							<${History} future=${this.game.future.list} past=${this.game.past.list} />
							${
								this.game.past.list.length
									? html`
											<p>
												<button onclick=${() => this.undo()}><u>U</u>ndo</button><br />
											</p>
									  `
									: ''
							}
							<p style="margin-top:auto"><a rel="noreferrer" target="_blank" href="https://github.com/oskarrough/slaytheweb">View source</a></p>
						</div>
					</div>
				<//>
				<${OverlayWithButton} open id="Map" topright>
					<button align-right onClick=${() => this.toggleOverlay('#Map')}><u>M</u>ap</button>
					<div class="Overlay-content">
						<div class="Splash">
							<div class="Splash-details"><${Map} dungeon=${state.dungeon} /></div>
						</div>
					</div>
				<//>
				<${OverlayWithButton} id="Deck" topright topright2>
					<button onClick=${() => this.toggleOverlay('#Deck')}><u>D</u>eck ${state.deck.length}</button>
					<div class="Overlay-content">
					<${Cards} gameState=${state} type="deck" />
					</div>
				<//>
				<${OverlayWithButton} id="DrawPile" bottomleft>
					<button onClick=${() => this.toggleOverlay('#DrawPile')}>Dr<u>a</u>w pile ${
			state.drawPile.length
		}</button>
					<div class="Overlay-content">
					<${Cards} gameState=${state} type="drawPile" />
					</div>
				<//>
				<${OverlayWithButton} id="DiscardPile" bottomright>
					<button onClick=${() => this.toggleOverlay('#DiscardPile')} align-right>Di<u>s</u>card pile ${
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
