import test from 'ava'
import createNewGame from '../public/game/index.js'
import {createCard} from '../public/game/cards'

// We don't want to test too much here,
// since tests/actions.js has most of it.

test('new game state is ok', (t) => {
	const game = createNewGame()
	t.true(game.state.dungeon.rooms.length > 0, 'we have a dungeon with rooms')
	// delete things we can't deepEqual because of random ids
	delete game.state.dungeon
	game.state.deck = []
	game.state.drawPile = []
	t.deepEqual(game.state, {
		deck: [],
		drawPile: [],
		hand: [],
		discardPile: [],
		player: {
			maxEnergy: 3,
			currentEnergy: 3,
			maxHealth: 72,
			currentHealth: 72,
			block: 0,
			powers: {},
		},
	})
})

test('it all', (t) => {
	const game = createNewGame()
	// can add a card
	const strike = createCard('Strike')
	game.queue({type: 'addCardToHand', card: strike})
	game.update()
	t.is(game.state.hand.length, 1)
	t.is(game.state.hand[0].id, strike.id)
	// we can undo
	game.undo()
	// and draw cards
	t.is(game.state.hand.length, 0)
	game.queue({type: 'drawCards'})
	game.update()
	t.is(game.state.hand.length, 5)
})
