import {Queue} from '../utils.js'
import actions from './actions.js'

/** @typedef {import('./actions.js').State} State */

/**
 * @typedef {object} FutureAction
 * @prop {string} type - the name of a function in actions.js
 * @prop {any} [any] - arguments are passed to the action
 */

/**
 * @typedef {object} PastAction
 * @prop {string} type - the name of a function in actions.js
 * @prop {State} state
 */

/**
 * @typedef {object} ActionManager
 * @prop {function(FutureAction):void} enqueue
 * @prop {function(State):State} dequeue
 * @prop {function():PastAction} undo
 * @prop {Queue} future
 * @prop {Queue} past
 */

/**
 * The action manager makes use of queues to keep track of future and past actions in the game state + undo.
 * @param {object} props
 * @param {boolean} props.debug - whether to log actions to the console
 * @returns {ActionManager} action manager
 */
export default function ActionManager(props) {
	const future = new Queue()
	const past = new Queue()

	/**
	 * Enqueued items are added to the "future" list
	 * @param {FutureAction} action
	 */
	function enqueue(action) {
		if (props.debug) console.log('am:enqueue', action)
		future.enqueue({action})
	}

	/**
	 * Dequeing runs the oldest action (from the `future` queue) on the state.
	 * The action is then moved to the `past` queue.
	 * @param {State} state
	 * @returns {State} new state
	 */
	function dequeue(state) {
		// Get the oldest action
		const {action} = future.dequeue() || {}
		if (props.debug) console.log('am:dequeue', action)
		if (!action) return state
		// Run it on the state
		let nextState
		try {
			nextState = actions[action.type](state, action)
		} catch (err) {
			console.warn('am:Failed running action', action)
			throw new Error(err)
		}
		// Move the action along with its state to the past
		past.enqueue({action, state})
		return nextState
	}

	/**
	 * Returns an object with the most recently run action and how the state looked before.
	 * @returns {PastAction}
	 */
	function undo() {
		if (props.debug) console.log('am:undo')
		return this.past.list.pop()
	}

	return {
		enqueue,
		dequeue,
		undo,
		future,
		past,
	}
}
