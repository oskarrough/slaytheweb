import test from 'ava'
import {getMonster, isCurrentRoomCompleted} from '../public/game/utils'
import actions from '../public/game/actions'
import {createCard} from '../public/game/cards'
import {createSimpleDungeon} from '../public/game/dungeon-encounters'

const a = actions

// Each test gets a fresh game state with a dungeon set up.
test.beforeEach(t => {
	let state = a.createNewGame()
	state = a.setDungeon(state, createSimpleDungeon())
	t.context = {state}
})

test('new game state is ok', t => {
	const {state} = t.context
	t.true(state.dungeon.rooms.length > 0, 'we have a dungeon with rooms')
	delete state.dungeon // deleting for rest of test because can't deepequal ids
	t.deepEqual(state, {
		drawPile: [],
		hand: [],
		discardPile: [],
		player: {
			maxEnergy: 3,
			currentEnergy: 3,
			maxHealth: 100,
			currentHealth: 100,
			block: 0,
			powers: {}
		}
	})
})

test('drawing a starter deck adds it to the draw pile', t => {
	const {state} = t.context
	t.is(state.drawPile.length, 0)
	const state2 = a.drawStarterDeck(state)
	t.is(state2.drawPile.length, 10)
})

test('starter deck is shuffled', t => {
	const {state} = t.context
	const removeIds = arr =>
		arr.map(card => {
			delete card.id
			return card
		})
	const tries = Array(10)
	t.plan(tries.length)
	for (const index of tries) {
		let draw1 = a.drawStarterDeck(state)
		let draw2 = a.drawStarterDeck(state)
		t.notDeepEqual(removeIds(draw1.drawPile), removeIds(draw2.drawPile))
	}
})

test('can add a card to hand', t => {
	let {state} = t.context
	const strike = createCard('Strike')
	state = a.addCardToHand(state, {card: strike})
	t.is(state.hand.length, 1)
	t.is(state.hand[0].id, strike.id)
})

test('can draw cards from drawPile to hand', t => {
	const {state} = t.context
	const state2 = a.drawStarterDeck(state)
	t.is(state2.hand.length, 0, 'hand is empty to start with')
	const state3 = a.drawCards(state2)
	t.is(state3.hand.length, 5, 'cards have been added to the hand')
	t.is(state3.drawPile.length, 5, 'cards have been removed from deck')
})

test('recycling the discard pile is shuffled', t => {
	const getIds = arr => arr.map(card => card.id)
	let {state} = t.context
	state = a.drawStarterDeck(state)
	state = a.drawCards(state)
	let thirdDraw = a.endTurn(state)
	thirdDraw = a.endTurn(thirdDraw)
	t.notDeepEqual(getIds(state.hand), getIds(thirdDraw.hand), 'order is maintained')
})

test('getMonster utility works', t => {
	const {state} = t.context
	let room = state.dungeon.rooms[state.dungeon.index]
	t.deepEqual(getMonster(state, 'enemy0'), room.monsters[0])
	state.dungeon.index = 1
	room = state.dungeon.rooms[state.dungeon.index]
	t.deepEqual(getMonster(state, 'enemy1'), room.monsters[1])
	t.throws(() => getMonster(state, 'doesntexist'))
})

test('can manipulate player hp', t => {
	const {state} = t.context
	t.is(state.player.currentHealth, 100)
	const state2 = a.removeHealth(state, {target: 'player', amount: 10})
	t.is(state2.player.currentHealth, 90, 'can remove hp')
	t.is(state.player.currentHealth, 100, 'original state was not modified')
	const state3 = a.addHealth(state2, {target: 'player', amount: 20})
	t.is(state3.player.currentHealth, 110)
	t.is(state.player.currentHealth, 100)
	t.is(state2.player.currentHealth, 90)
})

test('can manipulate monster hp', t => {
	const {state} = t.context
	t.is(getMonster(state, 'enemy0').currentHealth, 42, 'og heath is ok')
	const state2 = a.removeHealth(state, {target: 'enemy0', amount: 10})
	t.is(state2.dungeon.rooms[0].monsters[0].currentHealth, 32, 'can remove hp')
	t.is(state.dungeon.rooms[0].monsters[0].currentHealth, 42, 'original state was not modified')

	const state3 = a.removeHealth(state2, {target: 'enemy0', amount: 10})
	t.is(state3.dungeon.rooms[0].monsters[0].currentHealth, 22, 'can remove hp')
	t.is(state2.dungeon.rooms[0].monsters[0].currentHealth, 32, 'original state was not modified')
	t.is(state.dungeon.rooms[0].monsters[0].currentHealth, 42, 'original state was not modified')
})

test('can not play a card without enough energy', t => {
	const {state} = t.context
	const card = createCard('Strike')
	t.is(state.player.currentEnergy, 3)
	state.player.currentEnergy = 0
	t.throws(() => a.playCard(state, {card}))
})

test('initial rooms monster hp is STILL as expected', t => {
	const {state} = t.context
	t.is(state.dungeon.rooms[0].monsters[0].currentHealth, 42)
})

test('can play a strike card from hand and see the effects on state', t => {
	const {state} = t.context
	const originalHealth = getMonster(state, 'enemy0').currentHealth
	t.is(getMonster(state, 'enemy0').currentHealth, originalHealth)
	const card = createCard('Strike')
	const state2 = a.playCard(state, {target: 'enemy0', card})
	t.is(getMonster(state, 'enemy0').currentHealth, originalHealth)
	t.is(getMonster(state2, 'enemy0').currentHealth, originalHealth - card.damage)
})

test('can play a defend card from hand and see the effects on state', t => {
	const {state} = t.context
	t.is(state.player.block, 0)
	const card = createCard('Defend')
	const state2 = a.playCard(state, {target: 'player', card})
	t.is(state2.player.block, 5)
	const state3 = a.playCard(state2, {target: 'player', card})
	t.is(state3.player.block, 10)
})

test('when monster reaches 0 hp, you win!', t => {
	const {state} = t.context
	const newState = a.removeHealth(state, {target: 'enemy0', amount: 42})
	t.false(isCurrentRoomCompleted(state))
	t.true(isCurrentRoomCompleted(newState))
})

test('can discard a single card from hand', t => {
	const {state} = t.context
	const state2 = a.drawStarterDeck(state)
	const state3 = a.drawCards(state2)
	t.is(state3.hand.length, 5)
	t.is(state3.discardPile.length, 0)
	const cardToDiscard = state3.hand[0]
	const state4 = a.discardCard(state3, {card: cardToDiscard})
	t.is(state4.hand.length, 4)
	t.is(state4.discardPile.length, 1)
})

test('can discard the entire hand', t => {
	const {state} = t.context
	const state2 = a.drawStarterDeck(state)
	const state3 = a.drawCards(state2)
	t.is(state3.hand.length, 5)
	t.is(state3.discardPile.length, 0)
	const state4 = a.discardHand(state3)
	t.is(state4.hand.length, 0)
	t.is(state4.discardPile.length, 5)
})

test('ending a turn refreshes energy', t => {
	const {state} = t.context
	t.is(state.player.currentEnergy, 3)
	const card = createCard('Defend')
	const state2 = a.playCard(state, {target: 'player', card})
	t.is(state2.player.currentEnergy, 2)
	const state3 = a.playCard(state2, {target: 'player', card})
	t.is(state3.player.currentEnergy, 1)
	const newTurn = a.endTurn(state3)
	t.is(newTurn.player.currentEnergy, 3)
})

test("ending a turn removes player's block", t => {
	const {state} = t.context
	t.is(state.player.block, 0)
	const card = createCard('Defend')
	const state2 = a.playCard(state, {target: 'player', card})
	t.is(state2.player.block, 5)
	const state3 = a.playCard(state2, {target: 'player', card})
	t.is(state3.player.block, 10)
	const newTurn = a.endTurn(state3)
	t.is(newTurn.player.block, 0)
})

test('ending a turn draws a new hand and recycles discard pile', t => {
	let {state} = t.context

	state = a.drawStarterDeck(state)
	t.is(state.drawPile.length, 10)
	t.is(state.hand.length, 0)
	t.is(state.discardPile.length, 0)

	state = a.drawCards(state)
	t.is(state.drawPile.length, 5)
	t.is(state.hand.length, 5)
	t.is(state.discardPile.length, 0)

	state = a.endTurn(state)
	t.is(state.drawPile.length, 0)
	t.is(state.hand.length, 5)
	t.is(state.discardPile.length, 5)

	// now there is nothing in draw pile, so it should recycle discard pile.
	state = a.endTurn(state)
	t.is(state.drawPile.length, 5)
	t.is(state.hand.length, 5)
	t.is(state.discardPile.length, 0)
})

test('Bash card adds a vulnerable power and it doubles damage', t => {
	let {state} = t.context
	const bashCard = createCard('Bash')
	const strikeCard = createCard('Strike')

	t.is(state.dungeon.rooms[0].monsters[0].currentHealth, 42, 'checking initial health to be sure')

	state = a.playCard(state, {target: 'enemy0', card: bashCard})
	t.is(
		getMonster(state, 'enemy0').powers.vulnerable,
		bashCard.powers.vulnerable,
		'power is applied to monster before dealing damage'
	)
	t.is(getMonster(state, 'enemy0').currentHealth, 34, '...and after dealing damage')

	t.is(getMonster(state, 'enemy0').powers.vulnerable, 2, 'power is applied')
	state = a.endTurn(state)
	t.is(getMonster(state, 'enemy0').powers.vulnerable, 1, 'power stacks go down')
	t.is(getMonster(state, 'enemy0').currentHealth, 34)

	state = a.endTurn(state)
	t.is(getMonster(state, 'enemy0').powers.vulnerable, 0, 'power stacks go down')

	state = a.playCard(state, {target: 'enemy0', card: bashCard})
	t.is(getMonster(state, 'enemy0').currentHealth, 26)
	t.is(getMonster(state, 'enemy0').powers.vulnerable, 2)

	state = a.playCard(state, {target: 'enemy0', card: strikeCard})
	t.is(getMonster(state, 'enemy0').currentHealth, 14, 'deals double damage')
	state = a.endTurn(state)
	state = a.endTurn(state)
	state = a.endTurn(state)
	state = a.endTurn(state)
	t.is(getMonster(state, 'enemy0').powers.vulnerable, 0, 'stacks dont go negative')
})

test('Flourish card adds a working "regen" buff', t => {
	let {state} = t.context
	const card = createCard('Flourish')
	t.is(card.powers.regen, 5, 'card has regen power')
	t.is(state.player.currentHealth, 100)
	state = a.playCard(state, {target: 'player', card})
	t.is(state.player.powers.regen, card.powers.regen, 'regen is applied to player')
	state = a.endTurn(state)
	t.is(state.player.currentHealth, 105, 'ending your turn adds hp')
	t.is(state.player.powers.regen, 4, 'stacks go down')
	state = a.endTurn(state)
	t.is(state.player.currentHealth, 109)
	t.is(state.player.powers.regen, 3)
	state = a.endTurn(state)
	t.is(state.player.currentHealth, 112)
	t.is(state.player.powers.regen, 2)
	state = a.endTurn(state)
	t.is(state.player.currentHealth, 114)
	t.is(state.player.powers.regen, 1)
	state = a.endTurn(state)
	t.is(state.player.currentHealth, 115)
	t.is(state.player.powers.regen, 0)
	state = a.endTurn(state)
	t.is(state.player.currentHealth, 115)
})

test('You can stack regen power', t => {
	let {state} = t.context
	const card = createCard('Flourish')
	t.is(state.player.currentHealth, 100)
	state.player.currentEnergy = 999
	state = a.playCard(state, {card})
	t.is(state.player.powers.regen, card.powers.regen, 'regen applied once')
	state = a.playCard(state, {card})
	t.is(state.player.powers.regen, card.powers.regen * 2, 'regen applied twice')
})

// test.skip('Sucker Punch applies weak', t => {
// 	let {state} = t.context
// 	const card = createCard('Sucker Punch')
// 	state = a.playCard(state, {card})
// })

// test.skip('Cleave damages all monsters', t => {
// 	let {state} = t.context
// 	const card = createCard('Cleave')
// 	state = a.playCard(state, {card})
// })

// test.skip('Clash can only be played if it\'s the only attack', t => {
// 	let {state} = t.context
// 	const clashCard = createCard('Clash')
// 	const defendCard = createCard('Defend')
// 	state.hand.push(clashCard)
// 	state.hand.push(defendCard)
// 	t.throws(() => a.playCard(state, {card: clashCard}))
// })

test.todo('can apply a power to a specific monster')
