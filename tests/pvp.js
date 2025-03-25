// @ts-ignore
import test from 'ava'
import createNewGame from '../src/game/new-game.js'
import {createCard} from '../src/game/cards.js'

// make sure that our 

test('it all', (t) => {
	const game = createNewGame()
	t.is(game.state.player.currentHealth, 72)
	// can add a card
	const strike = createCard('Strike')
	game.enqueue({type: 'addCardToHand', card: strike})
	t.is(game.future.list.length, 1)
	t.is(game.past.list.length, 0)
	game.dequeue()
	t.is(game.future.list.length, 0)
	t.is(game.past.list.length, 1)
	t.is(game.state.hand.length, 6)
	t.is(game.state.hand[game.state.hand.length - 1].name, strike.name)
	// we can undo
	game.undo()
	t.is(game.state.hand.length, 5)
	// and draw cards again
	game.enqueue({type: 'drawCards'})
	game.dequeue()
	t.is(game.state.hand.length, 10)
})

test('game also contains actions', (t) => {
	const game = createNewGame()
	game.enqueue({type: 'discardHand'})
	game.dequeue()
	game.state = game.actions.drawCards(game.state)
	t.is(game.state.hand.length, 5)
})

test('game has a createdAt timestamp', (t) => {
	const game = createNewGame()
	t.is(typeof game.state.createdAt, 'number')
	t.falsy(game.state.endedAt)
})

test('game has a endedAt timestamp if you are dead', (t) => {
	const game = createNewGame()
	t.is(game.state.player.currentHealth, 72)
	game.state = game.actions.removeHealth(game.state, {amount: 72, target: 'player'})
	t.is(game.state.player.currentHealth, 0)
	t.truthy(game.state.endedAt)
})
