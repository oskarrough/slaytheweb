import ActionManager from './action-manager.js'
import actions from './actions.js'

/** @typedef {import('./actions.js').State} State */

/**
 * @typedef {object} Game
 * @prop {State} state
 * @prop {object} actions
 * @prop {Function} enqueue - stores an action in the "future"
 * @prop {Function} dequeue - runs the oldest "future" action, and stores result in the "past"
 * @prop {Function} undo - undoes the last "past" action
 * @prop {{list: Array<{type: string}>}} future
 * @prop {{list: Array<{action: string, state: State}>}} past
 */

/**
 * Creates a new game
 * @param {boolean} debug - whether to log actions to the console
 * @returns {Game}
 */
export default function createNewGame(debug = false) {
	const actionManager = ActionManager({debug})

	/**
	 * @returns {State} with a dungeon, start deck and cards drawn
	 */
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
