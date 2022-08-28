import test from 'ava'
import actions from '../public/game/actions'
import Dungeon from '../public/game/dungeon.js'
import {MonsterRoom, Monster} from '../public/game/dungeon-rooms.js'

const a = actions

// Each test gets a fresh game state with a dungeon set up.
// Prepare a dungeon with a test monster and set starting floor to 1.
test.beforeEach((t) => {
	let state = a.createNewGame()
	state = a.setDungeon(state, Dungeon({width: 3, height: 1}))
	state.dungeon.y = 1
	state.dungeon.graph[1][0].room = MonsterRoom(
		Monster({intents: [{block: 7}, {damage: 10}, {damage: 10}]})
	)
	t.context = {state}
})

const defaultHp = 72

const monster = (state) => state.dungeon.graph[1][0].room.monsters[0]

test('monster cycles through intents on its turn', (t) => {
	let {state} = t.context
	t.is(monster(state).intents.length, 3)
	t.is(monster(state).nextIntent, 0)
	state = a.endTurn(state)
	t.is(monster(state).nextIntent, 1)
	state = a.endTurn(state)
	t.is(monster(state).nextIntent, 2)
	state = a.endTurn(state)
	t.is(monster(state).nextIntent, 0)
})

test('monster can do damage and gain block', (t) => {
	let {state} = t.context
	// Establish our baseline.
	t.is(state.player.currentHealth, defaultHp)
	t.is(monster(state).block, 0)
	// And play through some turns
	state = a.endTurn(state)
	t.is(monster(state).block, 7)
	state = a.endTurn(state)
	t.is(state.player.currentHealth, 62)
	state = a.endTurn(state)
	t.is(state.player.currentHealth, 52)
	state = a.endTurn(state)
	t.is(monster(state).block, 7, 'block doesnt stack')
})

test('monsters can do several things at once', (t) => {
	const {state} = t.context
	// Overwrite monster to gain block and damage in same turn.
	state.dungeon.graph[1][0].room.monsters[0].intents = [{block: 5, damage: 6}]
	const nextTurn = a.endTurn(state)
	t.is(nextTurn.player.currentHealth, defaultHp - 6)
	t.is(monster(nextTurn).block, 5)
})

test('monster can apply vulnerable and weak', (t) => {
	let {state} = t.context

	// Overwrite monster to deal vulnerable every turn.
	const monster = Monster({intents: [{vulnerable: 2}]})
	state.dungeon.graph[1][0].room.monsters[0] = monster

	state = a.endTurn(state)
	t.is(state.player.powers.vulnerable, 2)
	state = a.endTurn(state)
	t.is(state.player.powers.vulnerable, 4)
	state = a.endTurn(state)
	t.is(state.player.powers.vulnerable, 6)
})

test('two monsters both do damage in same turn', (t) => {
	const {state} = t.context
	const intents = [{damage: 10}]
	state.dungeon.graph[1][0].room = MonsterRoom(Monster({intents}), Monster({intents}))
	t.is(state.player.currentHealth, defaultHp)
	const nextState = a.endTurn(state)
	t.is(nextState.player.currentHealth, 52)
})

test('dead monsters dont play', (t) => {
	let {state} = t.context
	t.is(state.player.currentHealth, defaultHp)
	state = a.endTurn(state)
	t.is(monster(state).block, 7)
	state = a.endTurn(state)
	t.is(state.player.currentHealth, 62)
	state = a.setHealth(state, {target: 'enemy0', amount: 0})
	state = a.endTurn(state)
	t.is(state.player.currentHealth, 62, 'monster is dead so nothing happened')
})

test('when multiple monsters attack in same turn, player block is removed between each', (t) => {
	let {state} = t.context
	state.dungeon.graph[1][0].room.monsters = [
		Monster({intents: [{damage: 8}]}),
		Monster({intents: [{damage: 6}]}),
		Monster({intents: [{damage: 4}]}),
	]
	t.is(state.player.currentHealth, 72)
	state.player.block = 5
	const next = a.endTurn(state)
	t.is(next.player.currentHealth, 72 + 5 - (8 + 6 + 4))
})
