const test = require('ava')
import actions from './public/game/actions'

test('foo', t => {
	t.pass()
})

test('bar', async t => {
	const bar = Promise.resolve('bar')
	t.is(await bar, 'bar')
})

test('new game state is ok', t => {
	const state = actions.createNewGame()
	t.deepEqual(state, {
		deck: [],
		hand: [],
		discardPile: [],
		player1: {
			maxEnergy: 3,
			currentEnergy: 3,
			maxHealth: 100,
			currentHealth: 100
		},
		player2: {
			maxHealth: 42,
			currentHealth: 42
		}
	})
})

test('drawing a starter deck actually adds it to the deck', t => {
	const state = actions.createNewGame()
	t.is(state.deck.length, 0)
	const newState = actions.drawStarterDeck({state})
	t.is(newState.deck.length, 9)
})

// test('bar', async t => {
// 	const bar = Promise.resolve('bar')
// 	t.is(await bar, 'bar')
// })

test.todo('can draw cards from deck into hand')
test.todo('can play a card from hand and see the effects on state')
