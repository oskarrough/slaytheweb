import test from 'ava'
import actions from '../src/game/actions.js'
import {encode, decode} from '../src/ui/save-load.js'

test('can save and load a game state', (t) => {
	let state = actions.createNewState()
	state = actions.setDungeon(state)
	state = actions.addStarterDeck(state)
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

// Set() serialization no longer needed - we don't use Set/Map in game state
test.skip('can serialize Set()', (t) => {
	const set = new Set()
	set.add(42)
	const obj = {set}
	const encoded = encode(obj)
	const decoded = decode(encoded)
	t.true(decoded.set.has(42))
})
