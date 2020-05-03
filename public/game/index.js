import actions from './actions.js'
import ActionManager from './action-manager.js'

// EXPERIMENTAL: nothing in this file is currently used.

// While it's possible to play and do everything with actions directly and alone,
// you have to keep passing the state around. This is an attempt at an easier API,
// without changing any code outside of this file. If we see that this API is nicer we can refactor.

// Here's an example:
// ```
// const game = createNewGame()
// game.enqueue({type: 'drawCards'})
// // game.future.length === 1
// game.update()
// // game.future.length === 0
// // game.past.length === 1
// // game.state now includes the updated state.
// // You can also undo!
// game.undo()
// ```

// This exists because actions.createNewGame() doesn't set a dungeon and deck.
function gameState() {
	let state = actions.createNewGame()
	state = actions.setDungeon(state)
	state = actions.addStarterDeck(state)
	state = actions.drawCards(state)
	return state
}

export default function createNewGame() {
	const actionManager = ActionManager()
	return {
		state: gameState(),
		actions,
		enqueue: actionManager.enqueue,
		dequeue() {
			try {
				const nextState = actionManager.dequeue(this.state)
				this.state = nextState
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
