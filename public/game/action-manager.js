import Queue from '../game/queue.js'
import actions from '../game/actions.js'

export default function() {
	const future = new Queue()
	const past = new Queue()

	function enqueue(action) {
		future.add({action})
	}

	function dequeue(state) {
		const {action} = future.takeFromBottom()
		if (!action) return

		let nextState
		try {
			nextState = actions[action.type](state, action)
		} catch (err) {
			throw new Error(err)
		}

		console.log('dequeue', {state, action, nextState})
		past.add({state, action})
		return nextState
	}

	function undo() {
		return this.past.takeFromTop()
	}

	return {
		enqueue,
		dequeue,
		undo,
		future,
		past
	}
}

