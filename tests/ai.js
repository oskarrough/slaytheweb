import test from 'ava'
import actions from '../public/game/actions'
import Dungeon, {MonsterRoom, Monster} from '../public/game/dungeon.js'
// import {getTargets, isCurrentRoomCompleted} from '../public/game/utils'
// import {createCard} from '../public/game/cards'
// import {createSimpleDungeon} from '../public/game/dungeon-encounters'
import {getTargets} from '../public/game/utils.js'

const a = actions

const defaultHp = 72

const createDungeon = () =>
	Dungeon({
		rooms: [
			MonsterRoom(
				Monster({
					intents: [{block: 7}, {damage: 10}, {damage: 10}]
				})
			)
		]
	})

const monster = state => state.dungeon.rooms[0].monsters[0]

test('monster cycles through intents on its turn', t => {
	let state = a.setDungeon(a.createNewGame(), createDungeon())
	t.is(monster(state).intents.length, 3)
	t.is(monster(state).nextIntent, 0)
	state = a.endTurn(state)
	t.is(monster(state).nextIntent, 1)
	state = a.endTurn(state)
	t.is(monster(state).nextIntent, 2)
	state = a.endTurn(state)
	t.is(monster(state).nextIntent, 0)
})

test('monster can do damage and gain block', t => {
	let state = a.setDungeon(a.createNewGame(), createDungeon())
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

test('monster can apply vulnerable and weak', t => {
	let state = a.setDungeon(a.createNewGame(), createDungeon())
	// Overwrite the "first" monster.
	const monster = Monster({
		intents: [{vulnerable: 2}, {weak: 5}]
	})
	state.dungeon.rooms[0].monsters[0] = monster
	state = a.endTurn(state)
	t.is(state.player.powers.vulnerable, 2)
	state = a.endTurn(state)
	t.is(state.player.powers.vulnerable, 1)
	t.is(state.player.powers.weak, 5)
	state = a.endTurn(state)
	state = a.endTurn(state)
	t.is(state.player.powers.vulnerable, 1, '1 because it lost one and gained 2')
	t.is(state.player.powers.weak, 8, 'same logic')
})

test('two monsters both do damage in same turn', t => {
	const intents = [{damage: 10}]
	const dungeon = Dungeon({
		rooms: [MonsterRoom(Monster({intents}), Monster({intents}))]
	})
	const state = a.setDungeon(a.createNewGame(), dungeon)
	t.is(state.player.currentHealth, defaultHp)
	const nextState = a.endTurn(state)
	t.is(nextState.player.currentHealth, 52)
})

test('dead monsters dont play', t => {
	let state = a.setDungeon(a.createNewGame(), createDungeon())
	t.is(state.player.currentHealth, defaultHp)
	// t.deepEqual(monster(state).intents[monster(state).nextIntent], {block: 7})
	state = a.endTurn(state)
	t.is(monster(state).block, 7)
	// t.deepEqual(monster(state).intents[monster(state).nextIntent], {damage: 10})
	state = a.endTurn(state)
	t.is(state.player.currentHealth, 62)
	monster(state).currentHealth = 0
	// t.deepEqual(monster(state).intents[monster(state).nextIntent], {damage: 10})
	state = a.endTurn(state)
	t.is(state.player.currentHealth, 62, 'monster is dead so nothing happened')
})
