import actions from './actions.js'
import ActionManager from './action-manager.js'

// This function returns a "game" object which wraps and controls a "game state".
// You enqueue actions on the game object, and then dequeue them.

// Here's an example:
// ```
// const game = createNewGame()
// game.enqueue({type: 'drawCards'})
// // game.future.length === 1
// game.dequeue()
// // game.future.length === 0
// // game.past.length === 1
// // game.state now includes the updated state.
// // You can also undo!
// game.undo()
// ```

/**
 * @typedef {Object} Game
 * @prop {import('./actions.js').State} state
 * @prop {object} actions
 * @prop {Function} enqueue
 * @prop {Function} dequeue
 * @prop {Function} undo
 * @prop {Array<import('./actions.js').State>} future
 * @prop {Array<import('./actions.js').State>} past
 */

/**
 * Creates a new game
 * @param {boolean} debug - whether to log actions to the console
 * @returns {Game}
 */
export default function createNewGame(debug = false) {
	const actionManager = ActionManager({debug})

	// Adds a dungeon, starter deck and draws cards.
	function createNewState() {
		let state = actions.createNewState()
		state = actions.setDungeon(state)
		state = actions.addStarterDeck(state)
		state = actions.drawCards(state)
		return state
	}

	return {
		state: createNewState(),
		actions,
		enqueue: actionManager.enqueue,
		dequeue() {
			try {
				const nextState = actionManager.dequeue(this.state)
				if (nextState) this.state = nextState
			} catch (err) {
				console.warn(err)
			}
		},
		undo() {
			const prevGame = actionManager.undo()
			if (prevGame) this.state = prevGame.state
			return prevGame
		},
		future: actionManager.future,
		past: actionManager.past,
	}
}
