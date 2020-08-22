import Queue from '../game/queue.js'
import actions from '../game/actions.js'

// The action manager makes use of queues to keep track of
// future and past actions in the game state. Also allowing us to undo.
export default function () {
	const future = new Queue()
	const past = new Queue()

	// Enqueued items are added to the "future" list. An action looks like this:
	// {type: 'dealDamage', amount: 7, ... }
	function enqueue(action) {
		future.enqueue({action})
	}

	// Deqeueing means running the oldest action in the queue on a game state.
	// The action is then moved to the "past". Returns the next state.
	function dequeue(state) {
		const {action} = future.dequeue() || {}
		let nextState
		if (!action) return
		try {
			nextState = actions[action.type](state, action)
		} catch (err) {
			throw new Error(err)
		}
		past.enqueue({state, action})
		return nextState
	}

	// Returns an object with the most recently run action and how the state looked before.
	function undo() {
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
