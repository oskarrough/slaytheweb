// @ts-ignore
import test from 'ava'
import {createTestDungeon} from '../src/content/dungeon-encounters.js'
import actions from '../src/game/actions.js'
import Dungeon from '../src/game/dungeon.js'
import {MonsterRoom, Monster} from '../src/game/dungeon-rooms.js'
import {getCurrRoom, isCurrRoomCompleted, isDungeonCompleted} from '../src/game/utils-state.js'

const a = actions

test('can create rooms with many monsters', (t) => {
	const room = MonsterRoom(Monster(), Monster())
	t.is(room.monsters.length, 2)
})

test('can create a dungeon', (t) => {
	const d = Dungeon({height: 5, width: 1})
	t.is(d.graph.length, 5 + 2) // +2 because start+end
})

test('can set a dungeon', (t) => {
	const dungeon = Dungeon()
	let state = a.createNewState()
	state = a.setDungeon(state, dungeon)
	t.deepEqual(state.dungeon.id, dungeon.id, 'setting dungeon works')
})

test('we know when a monster room is won', (t) => {
	let state = a.createNewState()
	state = a.setDungeon(state, createTestDungeon())
	state.dungeon.y = 1
	t.false(isCurrRoomCompleted(state))
	getCurrRoom(state).monsters[0].currentHealth = 0
	t.true(isCurrRoomCompleted(state))
})

test('we know when a monster room with many monsters is completed', (t) => {
	let state = a.createNewState()
	state = a.setDungeon(state, Dungeon({height: 1, width: 1}))
	state.dungeon.graph[1][0].room = MonsterRoom(Monster(), Monster())
	state.dungeon.y = 1
	t.false(isCurrRoomCompleted(state))
	t.false(isDungeonCompleted(state))
	getCurrRoom(state).monsters[0].currentHealth = 0
	t.false(isCurrRoomCompleted(state), 'one more to kill')
	getCurrRoom(state).monsters[1].currentHealth = 0
	t.true(isCurrRoomCompleted(state))
})

test('we know when the entire dungeon is compelete', (t) => {
	let state = a.createNewState()
	state = a.setDungeon(state, createTestDungeon())
	state.dungeon.y = 1
	getCurrRoom(state).monsters[0].currentHealth = 0
	state.dungeon.y = 2
	getCurrRoom(state).monsters[0].currentHealth = 0
	getCurrRoom(state).monsters[1].currentHealth = 0
	state.dungeon.y = 3
	getCurrRoom(state).monsters[0].currentHealth = 0
	state.dungeon.y = 4
	getCurrRoom(state).monsters[0].currentHealth = 0
	t.true(isDungeonCompleted(state))
})

test.todo('we know when a campfire has been used')

test('we can navigate a dungeon', (t) => {
	let state = a.createNewState()
	state = a.setDungeon(state, Dungeon())
	t.is(state.dungeon.x, 0)
	t.is(state.dungeon.y, 0)
	// Go through the next room.
	const nextState = a.move(state, {move: {x: 0, y: 1}})
	t.is(nextState.dungeon.x, 0)
	t.is(nextState.dungeon.y, 1)
})
