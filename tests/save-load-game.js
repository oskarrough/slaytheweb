// @ts-ignore
import test from 'ava'
import actions from '../src/game/actions.js'
import {encode, decode} from '../src/ui/save-load.js'
// import {saveGame, loadGame} from '../src/ui/save-load.js'
// import exampleSaveGame from './example-save-state.js'

// Each test gets a fresh dungeon with a dungeon and cards.
test.beforeEach((t) => {
	let state = actions.createNewState()
	state = actions.setDungeon(state)
	state = actions.addStarterDeck(state)
	t.context = {state}
})

test('can save and load a game state', (t) => {
	const {state} = t.context
	const x = state
	// const x = state.dungeon.graph[1]
	// console.log(1, x)
	t.is(typeof x, 'object')
	const encoded = encode(x)
	// console.log(2, encoded)
	t.is(typeof encoded, 'string')
	const decoded = decode(encoded)
	// console.log(3, decoded)
	t.is(typeof decoded, 'object')
})

test('can serialize Set()', (t) => {
	const set = new Set()
	set.add(42)
	const obj = {set}
	const encoded = encode(obj)
	const decoded = decode(encoded)
	t.true(decoded.set.has(42))
})
