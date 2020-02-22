import test from 'ava'
import actions from '../public/game/actions'
import {createCard} from '../public/game/cards'

const a = actions

// Each test gets a fresh game state.
test.beforeEach(t => {
	t.context = {state: a.createNewGame()}
})

test('new game state is ok', t => {
	const {state} = t.context
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

test('can draw cards from drawPile to hand', t => {
	const {state} = t.context
	const state2 = a.drawStarterDeck(state)
	t.is(state2.hand.length, 0, 'hand is empty to start with')
	const state3 = a.drawCards(state2)
	t.is(state.hand.length, 0, 'immutable, should not be modified')
	t.is(state2.hand.length, 0, 'immutable, should not be modified')
	t.is(state3.hand.length, 5, 'cards have been added to the hand')
	t.is(state3.drawPile.length, 5, 'cards have been removed from deck')
})

test('can manipulate player hp', t => {
	const {state} = t.context
	t.is(state.player.currentHealth, 100)
	const state2 = a.changeHealth(state, {target: 'player', amount: -10})
	t.is(state2.player.currentHealth, 90)
	const state3 = a.changeHealth(state2, {target: 'player', amount: 10})
	t.is(state3.player.currentHealth, 100)
})

test('can manipulate monster hp', t => {
	const {state} = t.context
	t.is(state.monster.currentHealth, 42)
	const state2 = a.changeHealth(state, {target: 'monster', amount: 8})
	t.is(state2.monster.currentHealth, 50)
	const state3 = a.changeHealth(state2, {target: 'monster', amount: -50})
	t.is(state3.monster.currentHealth, 0)
})

test('can not play a card without enough energy', t => {
	const {state} = t.context
	const card = createCard('Strike')
	t.is(state.player.currentEnergy, 3)
	state.player.currentEnergy = 0
	t.throws(() => a.playCard(state, {card}))
})

test('can play a strike card from hand and see the effects on state', t => {
	const {state} = t.context
	const originalHealth = state.monster.currentHealth
	const card = createCard('Strike')
	const state2 = a.playCard(state, {card})
	t.is(state2.monster.currentHealth, originalHealth - card.damage)
})

test('can play a defend card from hand and see the effects on state', t => {
	const {state} = t.context
	t.is(state.player.block, 0)
	const card = createCard('Defend')
	const state2 = a.playCard(state, {card})
	t.is(state2.player.block, 5)
	const state3 = a.playCard(state2, {card})
	t.is(state3.player.block, 10)
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
	const state2 = a.playCard(state, {card})
	t.is(state2.player.currentEnergy, 2)
	const state3 = a.playCard(state2, {card})
	t.is(state3.player.currentEnergy, 1)
	const newTurn = a.endTurn(state3)
	t.is(newTurn.player.currentEnergy, 3)
})

test("ending a turn removes player's block", t => {
	const {state} = t.context
	t.is(state.player.block, 0)
	const card = createCard('Defend')
	const state2 = a.playCard(state, {card})
	t.is(state2.player.block, 5)
	const state3 = a.playCard(state2, {card})
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

test('when monster reaches 0 hp, you win!', t => {
	const {state} = t.context
	t.is(state.monster.currentHealth, 42)
	const newState = a.changeHealth(state, {target: 'monster', amount: -42})
	t.is(newState.monster.currentHealth, 0)
})

test('Bash card adds a vulnerable power and it doubles damage', t => {
	let {state} = t.context
	const bashCard = createCard('Bash')
	const strikeCard = createCard('Strike')

	state = a.playCard(state, {card: bashCard})
	t.is(state.monster.currentHealth, 34)
	t.is(state.monster.vulnerable, 2)
	state = a.endTurn(state)
	t.is(state.monster.vulnerable, 1)
	state = a.endTurn(state)
	t.falsy(state.monster.vulnerable)
	state = a.playCard(state, {card: bashCard})
	t.is(state.monster.currentHealth, 26)
	t.truthy(state.monster.vulnerable)
	state = a.playCard(state, {card: strikeCard})
	t.is(state.monster.currentHealth, 14)
})

test('Flourish card adds a working "regen" buff', t => {
	let {state} = t.context
	const card = createCard('Flourish')
	t.is(card.regen, 5, 'card has regen power')
	t.is(state.player.currentHealth, 100)
	state = a.playCard(state, {card})
	t.is(state.player.regen, card.regen, 'regen is applied to player')
	state = a.endTurn(state)
	t.is(state.player.currentHealth, 105, 'ending your turn adds hp')
	t.is(state.player.regen, 4, 'stacks go down')
	state = a.endTurn(state)
	t.is(state.player.currentHealth, 109)
	t.is(state.player.regen, 3)
	state = a.endTurn(state)
	t.is(state.player.currentHealth, 112)
	t.is(state.player.regen, 2)
	state = a.endTurn(state)
	t.is(state.player.currentHealth, 114)
	t.is(state.player.regen, 1)
	state = a.endTurn(state)
	t.is(state.player.currentHealth, 115)
	t.is(state.player.regen, 0)
	state = a.endTurn(state)
	t.is(state.player.currentHealth, 115)
})
	state = a.playCard(state, {card})
})

// test.skip('Sucker Punch applies weak', t => {
// 	let {state} = t.context
// 	const card = createCard('Sucker Punch')
// 	state = a.playCard(state, {card})
// })

test.skip('Cleave damages all monsters', t => {
	let {state} = t.context
	const card = createCard('Cleave')
	state = a.playCard(state, {card})
})

// test.only('Clash can only be played if it\'s the only attack', t => {
// 	let {state} = t.context
// 	const clashCard = createCard('Clash')
// 	const defendCard = createCard('Defend')
// 	state.hand.push(clashCard)
// 	state.hand.push(defendCard)
// 	t.throws(() => a.playCard(state, {card: clashCard}))
// })

