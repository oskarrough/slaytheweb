import test from 'ava'
import createNewGame from '../public/game/index.js'
// import {getTargets, getCurrRoom, isCurrentRoomCompleted} from '../public/game/utils'
import {createCard} from '../public/game/cards'

test('new game state is ok', (t) => {
	const game = createNewGame()
	t.true(game.state.dungeon.rooms.length > 0, 'we have a dungeon with rooms')
	delete game.state.dungeon // deleting for rest of test because can't deepequal ids
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

test('can add a card to hand', (t) => {
	const game = createNewGame()
	const strike = createCard('Strike')
	const newState = game.actions.addCardToHand(game.state, {card: strike})
	game.state = newState
	t.is(game.state.hand.length, 1)
	t.is(game.state.hand[0].id, strike.id)
})

test('can really add a card to hand', (t) => {
	const game = createNewGame()
	const strike = createCard('Strike')
	game.queue({type: 'addCardToHand', card: strike})
	game.update()
	t.is(game.state.hand.length, 1)
	t.is(game.state.hand[0].id, strike.id)
	game.undo()
	t.is(game.state.hand.length, 0)
	game.queue({type: 'drawCards'})
	game.update()
	t.is(game.state.hand.length, 5)
})
