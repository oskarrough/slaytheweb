import test from 'ava'
import actions from '../public/game/actions'
import Dungeon, {MonsterRoom, Monster} from '../public/game/dungeon.js'
// import {getTargets, isCurrentRoomCompleted} from '../public/game/utils'
// import {createCard} from '../public/game/cards'
// import {createSimpleDungeon} from '../public/game/dungeon-encounters'
import {getTargets} from '../public/game/utils.js'

const a = actions

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

test('monster does damage and block', t => {
	let state = a.setDungeon(a.createNewGame(), createDungeon())
	// Establish our baseline.
	t.is(state.player.currentHealth, 100)
	t.is(monster(state).block, 0)
	// And play through some turns
	state = a.endTurn(state)
	t.is(monster(state).block, 7)
	state = a.endTurn(state)
	t.is(state.player.currentHealth, 90)
	state = a.endTurn(state)
	t.is(state.player.currentHealth, 80)
	state = a.endTurn(state)
	t.is(monster(state).block, 7, 'block doesnt stack')
	state = a.endTurn(state)
})

test('monster can apply vulnerable', t => {
	let state = a.setDungeon(a.createNewGame(), createDungeon())
	// Overwrite the "first" monster.
	const monster = Monster({
		intents: [{vulnerable: 2}, {weak: 5}]
	})
	state.dungeon.rooms[0].monsters[0] = monster
	state = a.endTurn(state)
	t.is(state.player.powers.vulnerable, 2)
	// state = a.endTurn(state)
	// t.is(state.player.powers.vulnerable, 1)
	// t.is(state.player.powers.weak, 5)
	// state = a.endTurn(state)
	// state = a.endTurn(state)
	// t.is(state.player.powers.vulnerable, 0)
	// t.is(state.player.powers.weak, 4)
})
