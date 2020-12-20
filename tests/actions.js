import test from 'ava'
import actions from '../public/game/actions'
import {getTargets, getCurrRoom, isCurrentRoomCompleted} from '../public/game/utils'
import {createCard} from '../public/game/cards'
import {createTestDungeon} from '../public/content/dungeon-encounters'
import {MonsterRoom, Monster} from '../public/game/dungeon'

const a = actions

// Each test gets a fresh game state with a dungeon set up.
test.beforeEach((t) => {
	let state = a.createNewGame()
	state = a.setDungeon(state, createTestDungeon())
	t.context = {state}
})

test('new game state is ok', (t) => {
	const {state} = t.context
	t.true(state.dungeon.rooms.length > 0, 'we have a dungeon with rooms')
	delete state.dungeon // deleting for rest of test because can't deepequal ids
	t.deepEqual(state, {
		turn: 1,
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

test('drawing a starter deck adds it to the draw pile', (t) => {
	const {state} = t.context
	t.is(state.drawPile.length, 0)
	const state2 = a.addStarterDeck(state)
	t.is(state2.drawPile.length, 10)
})

test('starter deck is shuffled', (t) => {
	const {state} = t.context
	const removeIds = (arr) =>
		arr.map((card) => {
			delete card.id
			return card
		})
	const tries = Array(10).fill(10)
	t.plan(tries.length)
	tries.forEach(() => {
		let draw1 = a.addStarterDeck(state)
		let draw2 = a.addStarterDeck(state)
		t.notDeepEqual(removeIds(draw1.drawPile), removeIds(draw2.drawPile))
	})
})

test('can add a card to hand', (t) => {
	let {state} = t.context
	const strike = createCard('Strike')
	state = a.addCardToHand(state, {card: strike})
	t.is(state.hand.length, 1)
	t.is(state.hand[0].id, strike.id)
})

test('can draw cards from drawPile to hand', (t) => {
	const {state} = t.context
	const state2 = a.addStarterDeck(state)
	t.is(state2.hand.length, 0, 'hand is empty to start with')
	const state3 = a.drawCards(state2)
	t.is(state3.hand.length, 5, 'cards have been added to the hand')
	t.is(state3.drawPile.length, 5, 'cards have been removed from deck')
})

test('recycling the discard pile is shuffled', (t) => {
	const getIds = (arr) => arr.map((card) => card.id)
	let {state} = t.context
	state = a.addStarterDeck(state)
	state = a.drawCards(state)
	let thirdDraw = a.endTurn(state)
	thirdDraw = a.endTurn(thirdDraw)
	t.notDeepEqual(getIds(state.hand), getIds(thirdDraw.hand), 'order is maintained')
})

test('getTargets utility works', (t) => {
	const {state} = t.context
	let room = getCurrRoom(state)
	t.deepEqual(getTargets(state, 'enemy0')[0], room.monsters[0])
	state.dungeon.index = 1
	room = getCurrRoom(state)
	t.deepEqual(getTargets(state, 'enemy1')[0], room.monsters[1])
	t.throws(() => getTargets(state, 'doesntexist'))
	t.deepEqual(getTargets(state, 'player')[0], state.player)
})

test('can manipulate player hp', (t) => {
	const {state} = t.context
	t.is(state.player.currentHealth, 72)
	const state2 = a.removeHealth(state, {target: 'player', amount: 10})
	t.is(state2.player.currentHealth, 62, 'can remove hp')
	t.is(state.player.currentHealth, 72, 'immutable')
	const state3 = a.addHealth(state2, {target: 'player', amount: 20})
	t.is(state3.player.currentHealth, 72, 'cant go above maxhealth')
	t.is(state2.player.currentHealth, 62, 'immutable')
	t.is(state.player.currentHealth, 72, 'immutable')
})

test('can manipulate monster hp', (t) => {
	const {state} = t.context
	t.is(getTargets(state, 'enemy0')[0].currentHealth, 42, 'og heath is ok')
	const state2 = a.removeHealth(state, {target: 'enemy0', amount: 10})
	t.is(state2.dungeon.rooms[0].monsters[0].currentHealth, 32, 'can remove hp')
	t.is(state.dungeon.rooms[0].monsters[0].currentHealth, 42, 'immutable')
	const state3 = a.removeHealth(state2, {target: 'enemy0', amount: 10})
	t.is(state3.dungeon.rooms[0].monsters[0].currentHealth, 22, 'can remove hp')
	t.is(state2.dungeon.rooms[0].monsters[0].currentHealth, 32, 'immutable')
	t.is(state.dungeon.rooms[0].monsters[0].currentHealth, 42, 'immutable')
})

test('can not play a card without enough energy', (t) => {
	const {state} = t.context
	const card = createCard('Strike')
	t.is(state.player.currentEnergy, 3)
	state.player.currentEnergy = 0
	t.throws(() => a.playCard(state, {card}))
})

test('initial rooms monster hp is STILL as expected', (t) => {
	const {state} = t.context
	t.is(state.dungeon.rooms[0].monsters[0].currentHealth, 42)
})

test('can play a strike card from hand and see the effects on state', (t) => {
	const {state} = t.context
	const originalHealth = getTargets(state, 'enemy0')[0].currentHealth
	t.is(getTargets(state, 'enemy0')[0].currentHealth, originalHealth)
	const card = createCard('Strike')
	const state2 = a.playCard(state, {target: 'enemy0', card})
	t.is(getTargets(state, 'enemy0')[0].currentHealth, originalHealth)
	t.is(getTargets(state2, 'enemy0')[0].currentHealth, originalHealth - card.damage)
})

test('Applying weak makes a monster deal 25% less damage', (t) => {
	let {state} = t.context
	t.is(getTargets(state, 'player')[0].currentHealth, 72)
	t.deepEqual(
		getTargets(state, 'enemy0')[0].intents[1],
		{damage: 10},
		'second turn monster deals 10 dmg'
	)
	let nextState = a.endTurn(state)
	getTargets(nextState, 'enemy0')[0].powers.weak = 1
	nextState = a.endTurn(nextState)
	t.is(getTargets(nextState, 'player')[0].currentHealth, 65)
})

test('Applying weak makes you deal 25% less damage', (t) => {
	let {state} = t.context
	t.is(getTargets(state, 'enemy0')[0].currentHealth, 42)
	const card = createCard('Strike')
	let nextState = a.playCard(state, {target: 'enemy0', card})
	t.is(getTargets(nextState, 'enemy0')[0].currentHealth, 36)
	state.player.powers.weak = 1
	nextState = a.playCard(nextState, {target: 'enemy0', card})
	t.is(
		getTargets(nextState, 'enemy0')[0].currentHealth,
		32,
		'weak is rounded down. 25% of 6 is 4.5, so we deal 4 damage'
	)
})

test('block on enemy actually blocks damage', (t) => {
	const {state} = t.context
	const card = createCard('Strike')

	getTargets(state, 'enemy0')[0].block = 10
	getTargets(state, 'enemy0')[0].currentHealth = 12
	t.is(card.damage, 6)

	const state2 = a.playCard(state, {target: 'enemy0', card})
	t.is(getTargets(state2, 'enemy0')[0].block, 10 - 6, 'block was reduced')
	t.is(getTargets(state2, 'enemy0')[0].currentHealth, 12, 'so hp wasnt removed')
})

test('block on player actually blocks damage', (t) => {
	let state = a.createNewGame()
	state = a.setDungeon(state, createTestDungeon())
	state = a.endTurn(state)
	state = a.playCard(state, {card: createCard('Defend')})
	t.is(state.player.block, 5)
	const state2 = a.endTurn(state)
	t.is(getTargets(state2, 'player')[0].block, 0, 'block was reduced')
	t.is(getTargets(state2, 'player')[0].currentHealth, 67, 'so hp was not reduced')
})

test('can play a defend card from hand and see the effects on state', (t) => {
	const {state} = t.context
	t.is(state.player.block, 0)
	const card = createCard('Defend')
	const state2 = a.playCard(state, {card})
	t.is(state2.player.block, 5)
	const state3 = a.playCard(state2, {card})
	t.is(state3.player.block, 10)
})

test('when monster reaches 0 hp, you win!', (t) => {
	const {state} = t.context
	t.false(isCurrentRoomCompleted(state))
	const newState = a.removeHealth(state, {target: 'enemy0', amount: 42})
	t.true(isCurrentRoomCompleted(newState))
})

test('can discard a single card from hand', (t) => {
	const {state} = t.context
	const state2 = a.addStarterDeck(state)
	const state3 = a.drawCards(state2)
	t.is(state3.hand.length, 5)
	t.is(state3.discardPile.length, 0)
	const cardToDiscard = state3.hand[0]
	const state4 = a.discardCard(state3, {card: cardToDiscard})
	t.is(state4.hand.length, 4)
	t.is(state4.discardPile.length, 1)
})

test('can discard the entire hand', (t) => {
	const {state} = t.context
	const state2 = a.addStarterDeck(state)
	const state3 = a.drawCards(state2)
	t.is(state3.hand.length, 5)
	t.is(state3.discardPile.length, 0)
	const state4 = a.discardHand(state3)
	t.is(state4.hand.length, 0)
	t.is(state4.discardPile.length, 5)
})

test('we can reshuffle and draw', (t) => {
	let {state} = t.context
	const state2 = a.addStarterDeck(state)
	const state3 = a.drawCards(state2)
	const state4 = a.discardHand(state3)
	t.is(state4.discardPile.length, 5)
	const state5 = a.reshuffleAndDraw(state4)
	t.is(state5.hand.length, 5)
	t.is(state5.discardPile.length, 0)
})

test('ending a turn draws a new hand and recycles discard pile', (t) => {
	let {state} = t.context

	state = a.addStarterDeck(state)
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

test('ending a turn refreshes energy', (t) => {
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

test("ending a turn removes player's block", (t) => {
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

test('Vulnerable targets take 50% more damage', (t) => {
	let {state} = t.context
	const bashCard = createCard('Bash')
	const strikeCard = createCard('Strike')
	t.is(getTargets(state, 'enemy0')[0].currentHealth, 42, 'initial hp')
	state = a.playCard(state, {target: 'enemy0', card: bashCard})
	t.is(getTargets(state, 'enemy0')[0].currentHealth, 34)
	state = a.playCard(state, {target: 'enemy0', card: strikeCard})
	t.is(getTargets(state, 'enemy0')[0].currentHealth, 25, 'deals 50% more damage')
})

test('Vulnerable damage is rounded down', (t) => {
	let {state} = t.context
	const strike = createCard('Strike')
	strike.damage = 9
	getTargets(state, 'enemy0')[0].powers.vulnerable = 1
	let state2 = a.playCard(state, {target: 'enemy0', card: strike})
	t.is(getTargets(state2, 'enemy0')[0].currentHealth, 42 - 13)
})

test('Vulnerable power stacks', (t) => {
	let {state} = t.context
	const card = createCard('Bash')
	state.player.currentEnergy = 999
	state = a.playCard(state, {target: 'enemy0', card})
	t.is(state.dungeon.rooms[0].monsters[0].powers.vulnerable, card.powers.vulnerable)
	state = a.playCard(state, {target: 'enemy0', card})
	t.is(state.dungeon.rooms[0].monsters[0].powers.vulnerable, card.powers.vulnerable * 2)
})

test('Regen power stacks', (t) => {
	let {state} = t.context
	const card = createCard('Flourish')
	state.player.currentEnergy = 999
	state = a.playCard(state, {target: 'player', card})
	t.is(state.player.powers.regen, card.powers.regen, 'regen applied once')
	state = a.playCard(state, {target: 'player', card})
	t.is(state.player.powers.regen, card.powers.regen * 2, 'regen applied twice')
})

test('Flourish card adds a healing "regen" buff', (t) => {
	let {state} = t.context
	const flourish = createCard('Flourish')
	t.is(flourish.powers.regen, 5, 'card has regen power')
	t.is(state.player.currentHealth, 72)
	let state2 = a.playCard(state, {target: 'player', card: flourish})
	state2.dungeon.rooms[state.dungeon.index].monsters[0].intents = []
	t.is(state2.player.powers.regen, flourish.powers.regen, 'regen is applied to player')
	state2 = a.endTurn(state2)
	t.is(state2.player.currentHealth, 72, 'it doesnt go above max hp')
	t.is(state2.player.powers.regen, 4, 'stacks go down')
	state2.player.currentHealth = 10
	state2 = a.endTurn(state2)
	t.is(state2.player.currentHealth, 14)
	t.is(state2.player.powers.regen, 3)
	state2 = a.endTurn(state2)
	t.is(state2.player.currentHealth, 17)
	t.is(state2.player.powers.regen, 2)
	state2 = a.endTurn(state2)
	t.is(state2.player.currentHealth, 19)
	t.is(state2.player.powers.regen, 1)
	state2 = a.endTurn(state2)
	t.is(state2.player.currentHealth, 20)
	t.is(state2.player.powers.regen, 0)
	state2 = a.endTurn(state2)
	t.is(state2.player.currentHealth, 20)
})

test('target "all enemies" works for damage as well as power', (t) => {
	const {state} = t.context
	state.dungeon.index = 1
	const room = getCurrRoom(state)
	t.is(room.monsters.length, 2, 'we have two enemies')
	t.is(room.monsters[0].currentHealth, 24)
	t.is(room.monsters[1].currentHealth, 13)
	t.falsy(
		room.monsters[0].powers.vulnerable && room.monsters[1].powers.vulnerable,
		'none are vulnerable'
	)
	const card = createCard('Thunderclap')
	const nextState = a.playCard(state, {card})
	t.is(nextState.dungeon.rooms[nextState.dungeon.index].monsters[0].currentHealth, 24 - card.damage)
	t.is(nextState.dungeon.rooms[nextState.dungeon.index].monsters[1].currentHealth, 13 - card.damage)
	t.is(nextState.dungeon.rooms[nextState.dungeon.index].monsters[0].powers.vulnerable, 1)
	t.is(nextState.dungeon.rooms[nextState.dungeon.index].monsters[1].powers.vulnerable, 1)
})

test('add a reward card in the deck after winning a room', (t) => {
	// arrange
	let {state} = t.context
	state = a.addStarterDeck(state)
	state = a.drawCards(state)
	const room = new MonsterRoom(new Monster(), new Monster({hp: 20}))
	room.monsters.forEach((monster) => (monster.currentHealth = 0))
	const card = createCard('Strike')
	t.is(state.deck.length, 10)
	// act
	const newState = a.rewardPlayer(state, card)
	// assert
	t.is(newState.deck.length, 11)
})

test('can not play card if target doesnt match', (t) => {
	const {state} = t.context
	const card = createCard('Strike')
	t.throws(() => {
		a.playCard(state, {card, target: 'yolo'})
	})
	t.throws(() => {
		a.playCard(state, {card, target: 'enemy1'})
	})
	t.throws(() => {
		a.playCard(state, {card, target: 'naaah'})
	})
	a.playCard(state, {card, target: 'player'})
})

test.todo('playing defend on an enemy ?')
test.todo('Cleave targets all monsters')
test.todo('can apply a power to a specific monster')
test.todo("Clash can only be played if it's the only attack")

test('Summer of sam card gains 1 life', (t) => {
	const {state} = t.context
	const card = createCard('Summer of Sam')
	t.is(typeof card.use, 'function')
	state.player.currentHealth = 50
	const newState = a.playCard(state, {target: 'player', card})
	t.is(newState.player.currentHealth, 51, 'gain 1 life')
})
