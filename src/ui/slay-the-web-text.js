import {html, render} from './lib.js'
import createNewGame from '../game/new-game.js'
import {getCurrRoom} from '../game/utils-state.js'
import Cards from './components/cards.js'
import {SlayMap} from './components/map.js'
import {Monster, Player} from './components/player.js'
// import CardChooser from './card-chooser.js'
// import CampfireRoom from './campfire.js'
// import StartRoom from './start-room.js'
// import Menu from './menu.js'
import './styles/map.css'
import './styles/fct.css'
import './styles/slay-the-web-text.css'

export default class SlayTheWebText extends HTMLElement {
	constructor() {
		super()
		this.game = createNewGame(true)
		window.stw = this.game
		// console.log('new text game', this.game)
	}

	connectedCallback() {
		this.update()
	}

	move(move) {
		this.game.enqueue({type: 'move', move})
		this.update()
	}

	submitCard(event) {
		event.preventDefault()
		const fd = new FormData(event.target)
		this.playCard(fd.get('card'), fd.get('target'))
	}

	playCard(cardId, target) {
		const card = this.game.state.hand.find((c) => c.id === cardId)
		this.game.enqueue({type: 'playCard', card, target})
		// this.update()
		this.render()
	}

	endTurn() {
		this.game.enqueue({type: 'endTurn'})
		this.update()
	}

	update() {
		console.log('update', this.game.state)
		this.game.dequeue()
		this.render()
	}

	undo() {
		this.game.undo()
		this.update()
	}

	render() {
		const {state} = this.game
		const room = getCurrRoom(state)
		console.log('render room', room)
		const template = html`
			<h1>slaytheweb</h1>
			<div>${state.won ? 'won' : 'playing'}</div>
			<div>turn ${state.turn}</div>
			<p>${this.game.future.list.length} future actions in queue</p>
			<p>${this.game.past.list.length} past actions</p>
			<menu>
				<button onClick=${() => this.update()}><u>U</u>pdate</button>
				<button class="EndTurn" onClick=${() => this.endTurn()}><u>E</u>nd turn</button>
			</menu>
			<hr />
			<p>block: ${state.player.block}</p>
			<p>hp: ${state.player.currentHealth}/${state.player.maxHealth}</p>
			<p class="EnergyBadge">${state.player.currentEnergy}/${state.player.maxEnergy}</p>

			<hr />
			<h2>${state.dungeon.x}/${state.dungeon.y}: ${room.type}</h2>
			<div class="Targets-group">
				${room.monsters &&
				room.monsters.map((monster) => html`<${Monster} model=${monster} gameState=${state} />`)}
			</div>

			<h2>Draw pile</h2>
			<${Cards} type="drawPile" gameState=${state} />
			<h2>Hand</h2>
			<${Cards} type="hand" gameState=${state} />
			<menu>
				<form onsubmit=${this.submitCard.bind(this)}>
					<select name="card" required>
						<option value="">Select a card</option>
						${state.hand.map((card) => html`<option value=${card.id}>${card.name}</option>`)}
					</select>
					<select name="target">
						<option value="">Select a target</option>
						<option value="player">Player</option>
						<option value="allEnemies">All enemies</option>
						${room?.monsters?.length &&
						room.monsters.map(
							(monster, i) => html`<option value=${`enemy` + i}>enemy${i}</option>`
						)}
					</select>
					<button type="submit">Play</button>
				</form>
			</menu>

			<h2>Discard pile</h2>
			<${Cards} type="discardPile" gameState=${state} />

			<${SlayMap}
				dungeon=${state.dungeon}
				x=${state.dungeon.x}
				y=${state.dungeon.y}
				disableScatter=${true}
				onSelect=${this.move.bind(this)}
			><//>
		`
		render(template, this)
	}

	// handlePlayerReward(choice, card) {
	// 	this.game.enqueue({type: 'addCardToDeck', card})
	// 	this.setState({didPickCard: card})
	// 	this.update()
	// }

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
		this.update()
		this.update()
		// this.goToNextRoom()
	}
}

customElements.define('slay-the-web-text', SlayTheWebText)
