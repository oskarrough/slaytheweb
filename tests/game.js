import test from 'ava'
import actions from '../public/game/actions'
import {createCard} from '../public/game/cards'

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
			currentHealth: 100,
			block: 0
		},
		monster: {
			maxHealth: 42,
			currentHealth: 42
		}
	})
})

test('drawing a starter deck adds it to the draw pile', t => {
	const state = actions.createNewGame()
	t.is(state.drawPile.length, 0)
	const newState = actions.drawStarterDeck({state})
	t.is(newState.drawPile.length, 9)
})

test('starter deck is shuffled', t => {
	const state = actions.createNewGame()
	const removeIds = arr =>
		arr.map(card => {
			delete card.id
			return card
		})
	const tries = Array(10)
	t.plan(tries.length)
	for (const index of tries) {
		let draw1 = actions.drawStarterDeck({state})
		let draw2 = actions.drawStarterDeck({state})
		t.notDeepEqual(removeIds(draw1.drawPile), removeIds(draw2.drawPile))
	}
})

test('can draw cards from drawPile to hand', t => {
	const state = actions.createNewGame()
	const state2 = actions.drawStarterDeck({state})
	t.is(state2.hand.length, 0, 'hand is empty to start with')
	const state3 = actions.drawCards({state: state2, amount: 2})
	t.is(state.hand.length, 0, 'immutable, should not be modified')
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

test('can not play a card without enough energy', t => {
	const state = actions.createNewGame()
	const card = createCard('Strike')
	t.is(state.player.currentEnergy, 3)
	state.player.currentEnergy = 0
	t.throws(() => actions.playCard({state, card}))
})

test('can play a strike card from hand and see the effects on state', t => {
	const state = actions.createNewGame()
	const originalHealth = state.monster.currentHealth
	const card = createCard('Strike')
	const newState = actions.playCard({state, card})
	t.is(newState.monster.currentHealth, originalHealth - card.damage)
})

test('can play a defend card from hand and see the effects on state', t => {
	const state = actions.createNewGame()
	t.is(state.player.block, 0)
	const card = createCard('Defend')
	const state2 = actions.playCard({state: state, card})
	t.is(state2.player.block, 5)
	const state3 = actions.playCard({state: state2, card})
	t.is(state3.player.block, 10)
})

test('can discard a single card from hand', t => {
	const state = actions.createNewGame()
	const state2 = actions.drawStarterDeck({state})
	const state3 = actions.drawCards({state: state2, amount: 5})
	t.is(state3.hand.length, 5)
	t.is(state3.discardPile.length, 0)
	const cardToDiscard = state3.hand[0]
	const state4 = actions.discardCard({state: state3, card: cardToDiscard})
	t.is(state4.hand.length, 4)
	t.is(state4.discardPile.length, 1)
})

test('can discard the entire hand', t => {
	const state = actions.createNewGame()
	const state2 = actions.drawStarterDeck({state: state})
	const state3 = actions.drawCards({state: state2, amount: 5})
	t.is(state3.hand.length, 5)
	t.is(state3.discardPile.length, 0)
	const state4 = actions.discardHand({state: state3})
	t.is(state4.hand.length, 0)
	t.is(state4.discardPile.length, 5)
})

test('ending a turn refreshes energy', t => {
	const state = actions.createNewGame()
	t.is(state.player.currentEnergy, 3)
	const card = createCard('Defend')
	const state2 = actions.playCard({state, card})
	t.is(state2.player.currentEnergy, 2)
	const state3 = actions.playCard({state: state2, card})
	t.is(state3.player.currentEnergy, 1)
	const newTurn = actions.endTurn({state: state3})
	t.is(newTurn.player.currentEnergy, 3)
})

test('ending a turn removes player\'s block', t => {
	const state = actions.createNewGame()
	t.is(state.player.block, 0)
	const card = createCard('Defend')
	const state2 = actions.playCard({state: state, card})
	t.is(state2.player.block, 5)
	const state3 = actions.playCard({state: state2, card})
	t.is(state3.player.block, 10)
	const newTurn = actions.endTurn({state: state3})
	t.is(newTurn.player.block, 0)
})

test('ending a turn discards your hand', t => {
	const state = actions.createNewGame()
	const state2 = actions.drawStarterDeck({state})
	const state3 = actions.drawCards({state: state2, amount: 5})
	t.is(state3.hand.length, 5)
	t.is(state3.discardPile.length, 0)
	const state4 = actions.endTurn({state: state3})
	t.is(state4.hand.length, 0)
	t.is(state4.discardPile.length, 5)
})

test('ending a turn draws a new hand', t => {
	let state = actions.createNewGame()
	state = actions.drawStarterDeck({state})
	state = actions.drawCards({state, amount: 4})
	t.is(state.hand.length, 4)
	state = actions.drawCards({state, amount: 4})
	t.is(state.hand.length, 8)
})
