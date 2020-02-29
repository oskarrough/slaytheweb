import test from 'ava'
import actions from '../public/game/actions'

const a = actions

// Each test gets a fresh game state.
test.beforeEach(t => {
	let state = a.createNewGame(state)
	state = a.drawStarterDeck(state)
	state = a.drawCards(state)
	t.context = {state}
})

test.todo('what to do')
