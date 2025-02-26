import {html, Component} from '../lib.js'
import createNewGame from '../../game/new-game.js'
import actions from '../../game/actions.js'
import {createCard} from '../../game/cards.js'

/**

# Slay the Web - API Exploration (DEBUG UI)

This document outlines the experimental debug UI for exploring and improving the Slay the Web game API.

## Purpose

The debug UI is designed to:

1. Explore the game API in an interactive way
2. Test different action sequences and observe their effects
3. Identify areas for API improvement
4. Experiment with alternative API designs

## Debug UI

The debug UI is inspired by Jupyter Notebooks, providing a cell-based interface for running game actions and observing their effects:

### Features

- **Cell-based execution**: Write and run code in individual cells
- **Preview before execution**: See what an action would do without actually doing it
- **State visualization**: Observe the game state after each action
- **Queue inspection**: View the future and past action queues
- **Action discovery**: Browse available actions

### Usage

1. **Create a new game**: Start with a fresh game state
2. **Add cells**: Each cell can contain code to enqueue and execute an action
3. **Run cells**: Execute the code in a cell to see its effect on the game state
4. **Undo actions**: Revert the last action to try different approaches

### Example Cell Code

```javascript
// Draw cards
game.enqueue({type: "drawCards", amount: 1})

// Play a card
game.enqueue({type: "playCard", card: game.state.hand[0], target: "enemy0"})

// End turn
game.enqueue({type: "endTurn"})
```

## API Exploration Goals

1. **Ergonomics**: Identify ways to make the API more intuitive and easier to use
2. **Consistency**: Ensure actions follow consistent patterns and naming conventions
3. **Flexibility**: Test the API's ability to handle complex game scenarios
4. **Discoverability**: Make it easier to discover available actions and their parameters

## Current API Structure

The game uses an action queue system:

1. Actions are enqueued with `game.enqueue({type: "actionType", ...params})`
2. Actions are executed with `game.dequeue()`
3. Actions can be undone with `game.undo()`

## Next Steps

- [ ] Identify common action patterns that could be simplified
- [ ] Consider a more fluent API for common actions
- [ ] Explore better ways to handle targeting
- [ ] Test error handling and edge cases
- [ ] Document all available actions and their parameters

## References

- `src/game/actions.js`: Contains all available actions
- `src/game/action-manager.js`: Manages the action queue
- `src/game/new-game.js`: Creates a new game state
- `src/ui/components/debug-ui.js`: The Jupyter-inspired debug UI

 */

export default class DebugUI extends Component {
	componentDidMount() {
		this.reset()
	}

	reset() {
		const game = createNewGame(true)
		this.setState({
			game,
			cells: [{code: 'game.enqueue({type: "drawCards", amount: 1})', result: null, preview: null}],
		})
		// Expose game to console for direct manipulation
		// @ts-ignore - Declare game property on window
		window.game = game
		console.log('New game created', game)
	}

	updateCell(index, code) {
		const cells = [...this.state.cells]
		cells[index] = {...cells[index], code}
		this.setState({cells})
	}

	previewCell(index) {
		const {game, cells} = this.state
		if (!game) return

		try {
			// Clone the game state to preview without modifying
			const stateBefore = JSON.parse(JSON.stringify(game.state))

			// Evaluate the code (in a safe way)
			// Note: In a real implementation, you'd need a safer way to evaluate code
			const code = cells[index].code

			// Show what would happen
			const preview = {
				code,
				message: 'Preview only - run to see actual changes',
			}

			// Update the cell
			const updatedCells = [...cells]
			updatedCells[index] = {...updatedCells[index], preview, result: null}
			this.setState({cells: updatedCells})
		} catch (error) {
			const updatedCells = [...cells]
			updatedCells[index] = {
				...updatedCells[index],
				preview: {error: error.message},
				result: null,
			}
			this.setState({cells: updatedCells})
		}
	}

	runCell(index) {
		const {game, cells} = this.state
		if (!game) return

		try {
			// Store state before
			const stateBefore = JSON.parse(JSON.stringify(game.state))

			// Evaluate and run the code
			eval(cells[index].code)
			game.dequeue()

			// Compare states to show what changed
			const stateAfter = game.state

			// Store result with more detailed information
			const result = {
				message: 'Action executed successfully',
				queue: {
					future: game.future.list.length,
					past: game.past.list.length,
				},
				lastAction:
					game.past.list.length > 0
						? game.past.list[game.past.list.length - 1]?.action?.type || 'unknown'
						: 'none',
			}

			// Update the cell
			const updatedCells = [...cells]
			updatedCells[index] = {...updatedCells[index], result, preview: null}

			// Add a new cell if this is the last one
			if (index === cells.length - 1) {
				updatedCells.push({code: '', result: null, preview: null})
			}

			this.setState({cells: updatedCells})
		} catch (error) {
			const updatedCells = [...cells]
			updatedCells[index] = {
				...updatedCells[index],
				result: {error: error.message},
				preview: null,
			}
			this.setState({cells: updatedCells})
		}
	}

	addCell() {
		const cells = [...this.state.cells, {code: '', result: null, preview: null}]
		this.setState({cells})
	}

	removeCell(index) {
		if (this.state.cells.length <= 1) return

		const cells = [...this.state.cells]
		cells.splice(index, 1)
		this.setState({cells})
	}

	handleActionSelect(index, actionType) {
		if (!actionType) return

		const cells = [...this.state.cells]
		let code = `// ${actionType} action\ngame.enqueue({type: "${actionType}"`

		// Add common parameters for specific action types with helpful comments
		switch (actionType) {
			case 'drawCards':
				code += `, amount: 1 // Number of cards to draw`
				break

			case 'addHealth':
				code += `, 
  target: "player", // Can be "player" or "enemy0", "enemy1", etc.
  amount: 5         // Amount of health to add`
				break

			case 'removeHealth':
				code += `, 
  target: "player", // Can be "player" or "enemy0", "enemy1", etc.
  amount: 5         // Amount of health to remove`
				break

			case 'playCard':
				code += `, 
  card: game.state.hand[0], // Card object to play
  target: "enemy0"          // Target of the card (if needed)`
				break

			case 'addCardToHand':
				code += `, 
  card: createCard("Strike") // Card to add to hand`
				break

			case 'addCardToDeck':
				code += `, 
  card: createCard("Strike") // Card to add to deck`
				break

			case 'setPower':
				code += `, 
  target: "player",  // Can be "player" or "enemy0", "enemy1", etc.
  power: "strength", // Power name (strength, dexterity, vulnerable, weak, etc.)
  amount: 1          // Amount of power to apply`
				break

			case 'endTurn':
				// No parameters needed
				break

			case 'move':
				code += `, 
  move: {x: 1, y: 0} // Direction to move in the dungeon`
				break

			case 'upgradeCard':
				code += `, 
  card: game.state.hand[0] // Card to upgrade`
				break

			default:
				code += ` /* Add parameters as needed */`
				break
		}

		code += `})`

		cells[index] = {
			...cells[index],
			code,
		}
		this.setState({cells})
	}

	renderCell(cell, index) {
		const {game} = this.state
		if (!game) return null

		// Get actions directly from the game object
		const availableActions = Object.keys(actions)

		// Extract the current action type from the cell code
		let currentAction = ''
		const match = cell.code.match(/type:\s*"([^"]+)"/)
		if (match && match[1]) {
			currentAction = match[1]
		}

		// Determine if the cell has been run successfully
		const hasRun = cell.result && !cell.result.error

		// Handle keyboard shortcuts
		const handleKeyDown = (e) => {
			// Run cell on Ctrl+Enter or Cmd+Enter
			if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
				e.preventDefault()
				this.runCell(index)
			}
		}

		return html`
			<div class="Box cell ${hasRun ? 'cell-success' : ''}">
				<header>
					<h3>Cell ${index + 1}${currentAction ? ` - ${currentAction}` : ''}</h3>
					<menu>
						<button class="Button" onClick=${() => this.previewCell(index)}>Preview</button>
						<button class="Button" onClick=${() => this.runCell(index)}>Run</button>
						<button class="Button" onClick=${() => this.removeCell(index)}>Remove</button>
					</menu>
				</header>

				<select onChange=${(e) => this.handleActionSelect(index, e.target.value)} value=${currentAction}>
					<option value="">Select an action...</option>
					${availableActions.map((action) => html` <option value=${action}>${action}</option> `)}
				</select>

				<textarea
					value=${cell.code}
					onInput=${(e) => this.updateCell(index, e.target.value)}
					onKeyDown=${handleKeyDown}
					placeholder="Type code here. Press Ctrl+Enter to run."
				></textarea>

				${cell.preview &&
				html`
					<section class="preview">
						<h4>Preview</h4>
						<pre>${JSON.stringify(cell.preview, null, 2)}</pre>
					</section>
				`}
				${cell.result &&
				!cell.result.error &&
				html`
					<section class="success">
						<h4>Success</h4>
						<pre>${JSON.stringify(cell.result, null, 2)}</pre>
					</section>
				`}
				${cell.result &&
				cell.result.error &&
				html`
					<section class="error">
						<h4>Error</h4>
						<pre>${JSON.stringify(cell.result, null, 2)}</pre>
					</section>
				`}
			</div>
		`
	}

	renderGameState() {
		const {game} = this.state
		if (!game) return null

		return html`
			<div class="Box">
				<h2>Game State</h2>

				<section>
					<h3>Player</h3>
					<div>Health: ${game.state.player.currentHealth}/${game.state.player.maxHealth}</div>
					<div>Energy: ${game.state.player.currentEnergy}/${game.state.player.maxEnergy}</div>
					<div>Block: ${game.state.player.block}</div>
					${Object.keys(game.state.player.powers || {}).length > 0 &&
					html` <div>Powers: ${JSON.stringify(game.state.player.powers)}</div> `}
				</section>

				<section>
					<h3>Cards</h3>
					<div>Hand: ${game.state.hand.length} cards</div>
					<div>Draw pile: ${game.state.drawPile.length} cards</div>
					<div>Discard pile: ${game.state.discardPile.length} cards</div>
				</section>

				<section>
					<h3>Queue Information</h3>
					<div>
						<div>Future actions: ${game.future.list.length}</div>
						<pre class="state-pre">
${JSON.stringify(
								game.future.list.map((item) => ({
									type: item?.action?.type || 'unknown',
								})),
								null,
								2,
							)}</pre
						>

						<div>Past actions: ${game.past.list.length}</div>
						<pre class="state-pre">
${JSON.stringify(
								game.past.list.map((item) => ({
									type: item?.action?.type || 'unknown',
								})),
								null,
								2,
							)}</pre
						>
					</div>
				</section>

				<details>
					<summary>
						<h3>Full Game State</h3>
					</summary>
					<pre class="full-state-pre">${JSON.stringify(game.state, null, 2)}</pre>
				</details>
			</div>
		`
	}

	render(props, state) {
		const {game, cells} = state
		if (!game) return html`<div>Loading game...</div>`

		console.log({game, cells})

		return html`
			<div class="debug-ui">
				<header class="Box">
					<p>
						Explore the game API by writing and running code in cells below. Each cell can enqueue an action
						and then dequeue it to see the results. Select an action from the dropdown in each cell to
						generate code with common parameters. Press <kbd>Ctrl+Enter</kbd> to run a cell.
					</p>
					<menu>
						<button class="Button" onClick=${() => this.reset()}>New Game</button>
						<button class="Button" onClick=${() => game.undo()}>Undo Last Action</button>
					</menu>
				</header>

				<main>
					<article>
						${cells?.map((cell, i) => this.renderCell(cell, i))}
						<div class="add-cell-container">
							<button class="Button" onClick=${() => this.addCell()}>Add Cell</button>
						</div>
					</article>
					<aside>${this.renderGameState()}</aside>
				</main>
			</div>
			<style>
				:root {
					--bg: hsl(245, 20%, 49%);
				}
				.debug-ui {
					margin: 0 0.5rem;
				}
				.debug-ui menu {
					margin: 0;
					padding: 0;
				}
				.cell-success {
					border-left: 4px solid #4caf50;
				}

				.cell > header {
					display: flex;
					justify-content: space-between;
					align-items: center;
				}
				.cell h3,
				.cell h4,
				.cell pre {
					margin: 0;
				}
				.cell menu .Button {
					font-size: 1rem;
					padding-left: 0.4em;
					padding-right: 0.4em;
				}

				select,
				textarea,
				.cell pre,
				.full-state-pre {
					background: hsla(0, 0%, 100%, 0.5);
					padding: 0.4rem;
					border-radius: 3px;
					border: 0;
				}

				pre {
					margin: 0.5rem 0;
				}

				.full-state-pre {
					font-size: 12px;
					background: hsla(0, 0%, 100%, 0.5);
					max-height: 400px;
					overflow: auto;
				}

				select + textarea {
					margin-top: 2px;
				}

				textarea {
					width: 100%;
					min-height: 80px;
					font-family: monospace;
					font-size: 14px;
				}

				/* Result panels */
				.cell > section {
					padding: 0.5rem;
					border-radius: 3px;
				}

				.cell > section.preview {
					background-color: #f8f9fa;
				}

				.cell > section.success {
					background-color: #e8f5e9;
					border-color: 4px solid #4caf50;
				}

				.cell > section.error {
					background-color: #ffebee;
					border-color: 4px solid #f44336;
				}

				.cell > section.success h4 {
					color: #2e7d32;
				}

				.cell > section.error h4 {
					color: #c62828;
				}

				.add-cell-container {
					text-align: center;
				}

				main {
					display: grid;
					grid-template-columns: 1fr 1fr;
					gap: 1rem;
				}

				@media (max-width: 768px) {
					main {
						grid-template-columns: 1fr;
					}
				}
			</style>
		`
	}
}
