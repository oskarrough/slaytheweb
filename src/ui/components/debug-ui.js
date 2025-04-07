import {html, Component} from '../lib.js'
import createNewGame from '../../game/new-game.js'
import actions from '../../game/actions.js'
import {createCard} from '../../game/cards.js'
import {getCurrRoom} from '../../game/utils-state.js'
import {Monster} from '../../game/monster.js'
import {MonsterRoom} from '../../game/rooms.js'
import {produce} from 'immer'

/**
 * Debug Console for Slay the Web
 *
 * A console-like interface for testing game actions and seeing state changes.
 * Features:
 * - Select actions from dropdown
 * - Parameter input fields appear dynamically based on selected action
 * - Execute actions and see state changes
 * - View action history and undo
 * - Split view showing game state
 */

export default class DebugUI extends Component {
	componentDidMount() {
		this.reset()
	}

	reset() {
		const game = createNewGame(true)
		this.setState({
			game,
			selectedAction: '',
			actionParams: {},
			history: [],
		})
		// @ts-ignore
		window.game = window.game || game
		console.log('New game created', game)
	}

	// Get parameter schema for a selected action
	getParamSchema(actionName) {
		// Define parameter schemas for common actions
		const schemas = {
			playCard: [
				{name: 'card', type: 'card', required: true},
				{name: 'target', type: 'target', required: false},
			],
			drawCards: [{name: 'amount', type: 'number', required: false, default: 5}],
			addHealth: [
				{name: 'target', type: 'target', required: true},
				{name: 'amount', type: 'number', required: true},
			],
			removeHealth: [
				{name: 'target', type: 'target', required: true},
				{name: 'amount', type: 'number', required: true},
			],
			setPower: [
				{name: 'target', type: 'target', required: true},
				{name: 'power', type: 'string', required: true},
				{name: 'amount', type: 'number', required: true},
			],
			addCardToHand: [{name: 'card', type: 'card', required: true}],
			addCardToDeck: [{name: 'card', type: 'card', required: true}],
			upgradeCard: [{name: 'card', type: 'card', required: true}],
			discardCard: [{name: 'card', type: 'card', required: true}],
		}

		// Return schema if found, otherwise empty array (no parameters)
		return schemas[actionName] || []
	}

	// Handle selection of an action
	handleActionSelect(actionName) {
		// Reset action parameters when changing actions
		this.setState({
			selectedAction: actionName,
			actionParams: {},
		})
	}

	// Handle parameter input change
	handleParamChange(paramName, value) {
		this.setState((state) => ({
			actionParams: {
				...state.actionParams,
				[paramName]: value,
			},
		}))
	}

	// Handle card selection for card type parameters
	handleCardSelect(paramName, cardName) {
		const card = createCard(cardName)
		this.handleParamChange(paramName, card)
	}

	// Execute the selected action
	executeAction() {
		const {game, selectedAction, actionParams} = this.state
		if (!selectedAction) return

		try {
			// const stateBefore = JSON.parse(JSON.stringify(game.state))
			game.enqueue({
				type: selectedAction,
				...actionParams,
			})
			game.dequeue()
			const historyItem = {
				action: selectedAction,
				params: {...actionParams},
				timestamp: new Date().toLocaleTimeString(),
			}
			this.setState((state) => ({
				history: [...state.history, historyItem],
			}))
		} catch (error) {
			console.error('Error executing action:', error)
			alert(`Error: ${error.message}`)
		}
	}

	// Undo the last action
	undoAction() {
		const {game, history} = this.state

		if (history.length === 0) return

		try {
			game.undo()

			this.setState((state) => ({
				history: state.history.slice(0, -1),
			}))
		} catch (error) {
			console.error('Error undoing action:', error)
			alert(`Error undoing: ${error.message}`)
		}
	}

	// Add a monster to the current room
	addMonsterToRoom() {
		const {game} = this.state
		const hp = Number(document.getElementById('new-monster-hp').value || 40)

		// Create a basic monster
		const monster = Monster({
			currentHealth: hp,
			maxHealth: hp,
			intents: [{damage: 6}, {block: 5}],
		})

		game.state = produce(game.state, (draft) => {
			const room = getCurrRoom(draft)
			if (!room.monsters) room.monsters = []
			room.monsters.push(monster)
		})

		this.setState({}) // Force refresh
	}

	// Create a test monster room
	createTestRoom() {
		const {game} = this.state

		// Create a test room with one monster
		const room = MonsterRoom(
			Monster({
				currentHealth: 40,
				maxHealth: 40,
				intents: [{damage: 6}, {block: 5}],
			}),
		)

		// Replace current room directly (for debug UI only)
		game.state = produce(game.state, (draft) => {
			const {x, y} = draft.dungeon
			draft.dungeon.graph[y][x].room = room
		})

		// Reset encounter
		game.enqueue({type: 'endEncounter'})
		game.dequeue()

		this.setState({}) // Force refresh
	}

	renderRoomEditor() {
		const {game} = this.state
		if (!game || !game.state) return null

		const currentRoom = getCurrRoom(game.state)

		return html`
			<div class="Box">
				<h2>Room Editor</h2>

				<details>
					<summary>Current Room Data</summary>
					<pre>${JSON.stringify(currentRoom, null, 2)}</pre>
				</details>

				<div class="monster-controls">
					<h3>Add Monster</h3>
					<div class="form-group">
						<label>HP</label>
						<input type="number" value="40" id="new-monster-hp" />
						<button class="Button" onClick=${() => this.addMonsterToRoom()}>Add Monster</button>
					</div>
				</div>

				<h3>Current Monsters</h3>
				${currentRoom.monsters?.map(
					(monster, i) => html`
						<div class="monster-editor">
							<h4>Enemy ${i}</h4>
							<div>HP: ${monster.currentHealth}/${monster.maxHealth}</div>
							<div class="form-group">
								<label>Set HP:</label>
								<input type="number" id="set-hp-${i}" value="10" />
								<button
									class="Button"
									onClick=${() => {
										const input = document.getElementById(`set-hp-${i}`)
										const value = Number(input instanceof HTMLInputElement ? input.value : 10)

										game.state = produce(game.state, (draft) => {
											const room = getCurrRoom(draft)
											room.monsters[i].currentHealth = value
										})

										this.setState({}) // Force refresh
									}}
								>
									Set
								</button>
							</div>
							<div class="form-group">
								<label>Add HP:</label>
								<input type="number" id="add-hp-${i}" value="5" />
								<button
									class="Button"
									onClick=${() => {
										const input = document.getElementById(`add-hp-${i}`)
										const value = Number(input instanceof HTMLInputElement ? input.value : 5)

										game.enqueue({type: 'addHealth', target: `enemy${i}`, amount: value})
										game.dequeue()
										this.setState({}) // Force refresh
									}}
								>
									Add
								</button>
							</div>
							<div class="form-group">
								<label>Apply Power:</label>
								<select id="power-type-${i}">
									<option value="weak">Weak</option>
									<option value="vulnerable">Vulnerable</option>
									<option value="strength">Strength</option>
								</select>
								<input type="number" id="power-amount-${i}" value="1" />
								<button
									class="Button"
									onClick=${() => {
										const powerSelect = document.getElementById(`power-type-${i}`)
										const amountInput = document.getElementById(`power-amount-${i}`)

										const power = powerSelect instanceof HTMLSelectElement ? powerSelect.value : 'weak'
										const amount = Number(amountInput instanceof HTMLInputElement ? amountInput.value : 1)

										game.enqueue({type: 'setPower', target: `enemy${i}`, power, amount})
										game.dequeue()
										this.setState({}) // Force refresh
									}}
								>
									Apply
								</button>
							</div>
							<button
								class="Button danger"
								onClick=${() => {
									game.state = produce(game.state, (draft) => {
										const room = getCurrRoom(draft)
										room.monsters.splice(i, 1)
									})
									this.setState({}) // Force refresh
								}}
							>
								Remove
							</button>
						</div>
					`,
				)}

				<button class="Button" onClick=${() => this.createTestRoom()}>Create Test Room</button>
			</div>
		`
	}

	// Render parameters form based on selected action
	renderParamsForm() {
		const {selectedAction, actionParams, game} = this.state

		if (!selectedAction) return null

		const paramSchema = this.getParamSchema(selectedAction)

		return html`
			<div class="params-form">
				${paramSchema.map((param) => {
					if (param.type === 'card') {
						// Card selector
						return html`
							<div class="form-group">
								<label>${param.name} (card)</label>
								<select
									onChange=${(e) => this.handleCardSelect(param.name, e.target.value)}
									value=${actionParams[param.name]?.name || ''}
								>
									<option value="">Select a card...</option>
									<option value="Strike">Strike</option>
									<option value="Defend">Defend</option>
									<option value="Bash">Bash</option>
									<option value="Body Slam">Body Slam</option>
									<option value="Clash">Clash</option>
									<option value="Cleave">Cleave</option>
									<option value="Flourish">Flourish</option>
									<option value="Succube">Succube</option>
									<option value="Thunderclap">Thunderclap</option>
									<option value="Summer of Sam">Summer of Sam</option>
								</select>

								<p class="help-text">
									Or select from hand:
									${game.state.hand.map(
										(card, i) => html`
											<button
												class="card-btn ${actionParams[param.name]?.id === card.id ? 'selected' : ''}"
												onClick=${() => this.handleParamChange(param.name, card)}
											>
												${card.name} (${i})
											</button>
										`,
									)}
								</p>
							</div>
						`
					} else if (param.type === 'target') {
						// Target selector
						return html`
							<div class="form-group">
								<label>${param.name} (target)</label>
								<select
									onChange=${(e) => this.handleParamChange(param.name, e.target.value)}
									value=${actionParams[param.name] || ''}
								>
									<option value="">Select target...</option>
									<option value="player">Player</option>
									<option value="enemy0">Enemy 0</option>
									<option value="enemy1">Enemy 1</option>
									<option value="enemy2">Enemy 2</option>
									<option value="allEnemies">All Enemies</option>
								</select>
							</div>
						`
					} else {
						// Default input for other types
						return html`
							<div class="form-group">
								<label>${param.name} (${param.type})</label>
								<input
									type=${param.type === 'number' ? 'number' : 'text'}
									value=${actionParams[param.name] !== undefined
										? actionParams[param.name]
										: param.default || ''}
									onInput=${(e) =>
										this.handleParamChange(
											param.name,
											param.type === 'number' ? Number(e.target.value) : e.target.value,
										)}
									placeholder=${param.required ? 'Required' : 'Optional'}
								/>
							</div>
						`
					}
				})}

				<button class="Button execute-btn" onClick=${() => this.executeAction()} disabled=${!selectedAction}>
					Execute
				</button>
			</div>
		`
	}

	// Render game state panel
	renderGameState() {
		const {game} = this.state

		if (!game) return null

		// Get current monsters
		const monsters = []
		try {
			// Try to get room monsters safely
			const room = game.state.dungeon?.graph[game.state.dungeon.y][game.state.dungeon.x]?.room
			if (room && room.monsters) {
				monsters.push(...room.monsters)
			}
		} catch (e) {
			// Handle case where monsters can't be found
		}

		return html`
			<div class="Box">
				<h2>Game State</h2>

				<details open>
					<summary>
						<h3>Player</h3>
					</summary>
					<section>
						<div>Health: ${game.state.player.currentHealth}/${game.state.player.maxHealth}</div>
						<div>Energy: ${game.state.player.currentEnergy}/${game.state.player.maxEnergy}</div>
						<div>Block: ${game.state.player.block}</div>
						${
							Object.keys(game.state.player.powers || {}).length > 0 &&
							html` <div>Powers: ${JSON.stringify(game.state.player.powers)}</div> `
						}
					</section>
				</details>

				<details open>
					<summary>
						<h3>Cards</h3>
					</summary>
					<section>
						<div>
							Hand (${game.state.hand.length}):
							${game.state.hand.map(
								(card) => html` <span class="card-pill" title=${JSON.stringify(card)}>${card.name}</span> `,
							)}
						</div>
						<div>Draw pile: ${game.state.drawPile.length} cards</div>
						<div>Discard pile: ${game.state.discardPile.length} cards</div>
					</section>
				</details>

				<details open>
					<summary>
						<h3>Monsters</h3>
					</summary>
					<section>
						${
							monsters.length > 0
								? monsters.map(
										(monster, i) => html`
											<div class="monster">
												<strong>Enemy ${i}</strong>: HP ${monster.currentHealth}/${monster.maxHealth}
												${monster.block > 0 ? html`<span>Block: ${monster.block}</span>` : ''}
												${Object.keys(monster.powers || {}).length > 0
													? html` <div>Powers: ${JSON.stringify(monster.powers)}</div> `
													: ''}
											</div>
										`,
									)
								: html`<div>No monsters in current room</div>`
						}
					</div>
				</details>

				<details>
					<summary>
						<h3>Action Queue</h3>
					</summary>
					<section>
						<div>Future actions: ${game.future.list.length}</div>
						<div>Past actions: ${game.past.list.length}</div>
					</section>
				</details>

				<details>
					<summary>
						<h3>Full Game State</h3>
					</summary>
					<section>
						<pre class="full-state-pre">${JSON.stringify(game.state, null, 2)}</pre>
					</section>
				</details>
			</div>
		`
	}

	// Render history panel
	renderHistory() {
		const {history} = this.state

		return html`
			<div class="Box history-panel">
				<h3>Action History</h3>
				${history.length === 0
					? html`<div class="empty-history">No actions executed yet</div>`
					: html`
							<div class="history-list">
								${history.map(
									(item, i) => html`
										<div class="history-item">
											<div class="action-name">${item.action}</div>
											<div class="action-params">${JSON.stringify(item.params)}</div>
											<div class="action-time">${item.timestamp}</div>
										</div>
									`,
								)}
							</div>
							<button class="Button undo-btn" onClick=${() => this.undoAction()}>Undo Last Action</button>
						`}
			</div>
		`
	}

	render(props, state) {
		const {game} = state

		if (!game) return html`<div>Loading game...</div>`

		// Get all available actions
		const availableActions = Object.keys(actions)
			.filter((name) => typeof actions[name] === 'function')
			.sort()

		return html`
			<div class="debug-console">
				<style>
					:root {
						--bg: var(--purple);
					}
					.debug-console {
						display: grid;
						grid-template-columns: 1fr 1fr;
						gap: 1rem;
						max-width: 1200px;
						margin: 0 auto;
						padding: 1rem;
					}
					.form-group {
						margin-bottom: 0.5rem;
					}
					label {
						display: block;
					}
					h2,
					h3,
					p {
						font-size: 1rem;
						margin: 0;
					}
					h2 {
						margin-bottom: 0rem;
					}
						details {
						margin-top: 0.5rem;}
					summary h3 {
						display: inline-block;
						margin: 0;
					}
					.card-pill {
						border-bottom: 1px dotted;
					}
					.card-btn.selected {
						font-weight: bold;
					}
					.full-state-pre {
						max-height: 300px;
						overflow: auto;
					}
					.monster-editor {
						border: 1px solid #ccc;
						padding: 0.5rem;
						margin-bottom: 0.5rem;
					}
					.Box {
						margin-bottom: 1rem;
					}
					.Button {
						margin-right: 0.25rem;
					}
				</style>

				<div class="left-panel">
					<div class="Box">
						<h2>Debug system</h2>
						<select onChange=${(e) => this.handleActionSelect(e.target.value)} value=${state.selectedAction}>
							<option value="">-- Select an action --</option>
							${availableActions.map((action) => html` <option value=${action}>${action}</option> `)}
						</select>

						${this.renderParamsForm()}
					</div>

					${this.renderRoomEditor()}

					${this.renderHistory()}

					<menu>
						<button onClick=${() => this.reset()}>New Game</button>
					</<menu>
				</div>

				<div class="right-panel">${this.renderGameState()}</div>
			</div>
		`
	}
}
