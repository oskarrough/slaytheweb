import Queue from '../game/queue.js'
import actions from '../game/actions.js'

// The action manager makes use of queues to keep track of
// future and past actions in the game state. Also allowing us to undo.
// Actions are always run one sequentially.
export default function () {
	return {
		future: new Queue(),
		past: new Queue(),

		// Enqueued items are added to the "future" list.
		enqueue(action) {
			future.addToTop({action})
		},

		// Once dequeued, they end up in the "past".
		// Returns a new state.
		dequeue(state) {
			const {action} = future.takeFromBottom() || {}
			let nextState
			if (!action) return
			try {
				nextState = actions[action.type](state, action)
			} catch (err) {
				throw new Error(err)
			}
			past.addToTop({state, action})
			return nextState
		},

		// Undo the latest action from the passt.
		undo() {
			return this.past.takeFromTop()
		}
	}
}
