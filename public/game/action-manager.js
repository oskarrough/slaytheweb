function actionManager() {
	const future = new Queue()
	const past = new Queue()

	function enqueue(action) {
		future.add(action)
	}
	function dequeue() {
		const action = future.next()
		if (!action) return
		runAction(action)
	}
	function undo() {
		const action = past.next()
		if (!action) return
		runAction(action)
	}
	function runAction(action) {
		past.add(action)
		try {
			return actions[action.type](this.state, action)
		} catch (err) {
			console.error(err)
		}
	}
	return {
		enqueue,
		dequeue,
		undo
	}
}

