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
		drawPile: [],
		hand: [],
		discardPile: [],
		player: {
			maxEnergy: 3,
			currentEnergy: 3,
			maxHealth: 100,
			currentHealth: 100
		},
		monster: {
			maxHealth: 42,
			currentHealth: 42
		}
	})
})

test('drawing a starter deck actually adds it to the deck', t => {
	const state = actions.createNewGame()
	t.is(state.drawPile.length, 0)
	const newState = actions.drawStarterDeck({state})
	t.is(newState.drawPile.length, 9)
})

test.todo('starter deck is shuffled')

test('can draw cards from drawPile to hand', t => {
	const state1 = actions.createNewGame()
	const state2 = actions.drawStarterDeck({state: state1})
	t.is(state2.hand.length, 0, 'hand is empty to start with')
	const state3 = actions.drawCards({state: state2, amount: 2})
	t.is(state1.hand.length, 0, 'immutable, should not be modified')
	t.is(state2.hand.length, 0, 'immutable, should not be modified')
	t.is(state3.hand.length, 2, 'cards have been added to the hand')
	t.is(state3.drawPile.length, 7, 'cards have been removed from deck')
})

test('can manipulate player hp', t => {
	const state = actions.createNewGame()
	t.is(state.player.currentHealth, 100)
	const state2 = actions.changeHealth({state, target: 'player', amount: -10})
	t.is(state2.player.currentHealth, 90)
	const state3 = actions.changeHealth({state: state2, target: 'player', amount: 10})
	t.is(state3.player.currentHealth, 100)
})

test('can manipulate monster hp', t => {
	const state = actions.createNewGame()
	t.is(state.monster.currentHealth, 42)
	const state2 = actions.changeHealth({state, target: 'monster', amount: 8})
	t.is(state2.monster.currentHealth, 50)
	const state3 = actions.changeHealth({state: state2, target: 'monster', amount: -50})
	t.is(state3.monster.currentHealth, 0)
})

test('can play a strike card from hand and see the effects on state', t => {
	const state = actions.createNewGame()
	const originalHealth = state.monster.currentHealth
	const card = actions.createCard('Strike')
	const newState = actions.playCard({state, card})
	t.is(newState.monster.currentHealth, originalHealth - card.damage)
})

test.todo('can play a defend card from hand and see the effects on state')
test.todo('ending a turn refreshes energy')
test.todo('ending a turn discards your hand')
test.todo('ending a turn draws again')
