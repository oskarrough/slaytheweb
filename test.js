const test = require('ava')
import actions from './public/game/actions'

test('can create an attack card', t => {
	const card = actions.createCard('Strike')
	t.is(card.name, 'Strike')
	t.is(card.type, 'Attack')
	t.is(typeof card.damage, 'number')
	t.is(typeof card.cost, 'number')
	t.true(card.hasOwnProperty('effects'))
})

test('can create a skill card', t => {
	const card = actions.createCard('Defend')
	t.is(card.type, 'Skill')
	t.is(typeof card.block, 'number')
})

test('card name must be exact', t => {
	t.throws(() => actions.createCard('Naaaah doesnt exist'))
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

test.todo('starter deck is shuffled')

test('can draw cards from deck to hand', t => {
	const state1 = actions.createNewGame()
	const state2 = actions.drawStarterDeck({state: state1})
	t.is(state2.hand.length, 0, 'hand is empty to start with')
	const state3 = actions.drawCards({state: state2, amount: 2})
	t.is(state1.hand.length, 0, 'immutable, should not be modified')
	t.is(state2.hand.length, 0, 'immutable, should not be modified')
	t.is(state3.hand.length, 2, 'cards have been added to the hand')
	t.is(state3.deck.length, 7, 'cards have been removed from deck')
})

test('can manipulate hp', t => {
	const state = actions.createNewGame()
	t.is(state.player1.currentHealth, 100)
	const state2 = actions.removeHealth({state, amount: 10})
	t.is(state2.player1.currentHealth, 90)
	const state3 = actions.addHealth({state: state2, amount: 2})
	t.is(state3.player1.currentHealth, 92)
})

// test('bar', async t => {
// 	const bar = Promise.resolve('bar')
// 	t.is(await bar, 'bar')
// })

test.todo('can play a strike card from hand and see the effects on state')
test.todo('can play a defend card from hand and see the effects on state')
