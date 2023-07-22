import Queue from './queue.js'
import actions from './actions.js'

/**
 * @typedef {Object} FutureAction
 * @prop {string} type
 * @prop {any} [any] - arguments are passed to the action
 */

/**
 * @typedef {Object} PastAction
 * @prop {string} type
 * @prop {import('./actions.js').State} state
 */

/**
 * @typedef {Object} ActionManagerReally
 * @prop {Function} enqueue - stores an action in the "future"
 * @prop {Function} dequeue - runs the oldest "future" action, and stores result in the "past"
 * @prop {Function} undo - undoes the last "past" action
 * @prop {Queue} future
 * @prop {Queue} past
	* /

/**
 * The action manager makes use of queues to keep track of future and past actions in the game state + undo.
 * @param {Object} props
 * @prop {boolean} props.debug - whether to log actions to the console
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
	 * Deqeueing runs the oldest action (from the `future` queue) on the state.
	 * The action is then moved to the `past` queue.
	 * @param {import('./actions.js').State} state
	 * @returns {import('./actions.js').State} new state
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
