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

// test('bar', async t => {
// 	const bar = Promise.resolve('bar')
// 	t.is(await bar, 'bar')
// })

test.todo('can draw cards from deck into hand')
test.todo('can play a strike card from hand and see the effects on state')
test.todo('can play a defend card from hand and see the effects on state')
