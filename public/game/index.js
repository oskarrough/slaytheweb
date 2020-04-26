import actions from './actions.js'
import ActionManager from './action-manager.js'

function createNewState() {
	let state = actions.createNewGame()
	state = actions.setDungeon(state)
	// state = actions.addStarterDeck(state)
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
	}
	return game
}
