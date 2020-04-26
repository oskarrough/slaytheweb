import actions from './actions.js'
import ActionManager from './action-manager.js'

// While it's possible to play and do everything with actions directly and alone,
// you have to keep passing the state around. This is an attempt at an easier API.

// Here's an example:
// ```
// const game = createNewGame()
// game.queue({type: 'drawCards'})
// // game.future.length === 1
// game.update()
// // game.future.length === 0
// // game.past.length === 1
// // game.state now includes the updated state.
// // You can also undo!
// game.undo()
// ```
function createNewState() {
	let state = actions.createNewGame()
	state = actions.setDungeon(state)
	state = actions.addStarterDeck(state)
	// state = actions.drawCards(state)
	return state
}

export default function createNewGame() {
	const actionManager = ActionManager()
	const game = {
		state: createNewState(),
		actions,
		queue: actionManager.enqueue,
		update() {
			const nextState = actionManager.dequeue(this.state)
			this.state = nextState
		},
		undo() {
			const prevGame = actionManager.undo()
			this.state = prevGame.state
		},
		future: actionManager.future,
		past: actionManager.past,
	}
	return game
}
