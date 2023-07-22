import Queue from './queue.js'
import actions from './actions.js'

/**
 * @typedef {Object} Action
 * @prop {string} type - name of the action to call
 * @prop {*} anything - pass it what you need
 */

// The action manager makes use of queues to keep track of future and past actions in the game state + undo.
export default function ActionManager(props) {
	const future = new Queue()
	const past = new Queue()

	/**
	 * Enqueued items are added to the "future" list. An action looks like this:
	 * {type: 'dealDamage', amount: 7, ... }
	 * @param {Object} action
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
	 * @returns {Action}
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
