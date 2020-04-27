import test from 'ava'
import createNewGame from '../public/game/index.js'
import {createCard} from '../public/game/cards'

// We don't want to test too much here,
// since tests/actions.js has most of it.

test('it all', (t) => {
	const game = createNewGame()
	t.is(game.state.player.currentHealth, 72)
	// can add a card
	const strike = createCard('Strike')
	game.queue({type: 'addCardToHand', card: strike})
	game.dequeue()
	t.is(game.state.hand.length, 1)
	t.is(game.state.hand[0].id, strike.id)
	// we can undo
	game.undo()
	// and draw cards
	t.is(game.state.hand.length, 0)
	game.queue({type: 'drawCards'})
	game.dequeue()
	t.is(game.state.hand.length, 5)
})
