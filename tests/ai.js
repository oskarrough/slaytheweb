import test from 'ava'
import actions from '../public/game/actions'
import Dungeon, {MonsterRoom, Monster} from '../public/game/dungeon.js'
// import {getTargets, isCurrentRoomCompleted} from '../public/game/utils'
// import {createCard} from '../public/game/cards'
// import {createSimpleDungeon} from '../public/game/dungeon-encounters'

const a = actions

const createDungeon = () =>
	Dungeon({
		rooms: [
			MonsterRoom(
				Monster({
					blockPower: 7,
					intents: ['block', 'damage', 'damage']
				})
			)
		]
	})

const monster = state => state.dungeon.rooms[0].monsters[0]

test('monster cycles through intents on its turn', t => {
	let state = a.setDungeon(a.createNewGame(), createDungeon())

	t.is(monster(state).intents.length, 3)

	state = a.endTurn(state)
	t.is(monster(state).nextIntent, 0)

	state = a.takeMonsterTurn(state)
	t.is(monster(state).nextIntent, 1)

	state = a.takeMonsterTurn(state)
	t.is(monster(state).nextIntent, 2)

	state = a.takeMonsterTurn(state)
	t.is(monster(state).nextIntent, 0)
})

test('monster does damage and block', t => {
	let state = a.setDungeon(a.createNewGame(), createDungeon())

	t.is(state.player.currentHealth, 100)
	t.is(monster(state).damage, 5)
	t.is(monster(state).block, 0)
	t.is(monster(state).blockPower, 7)
	t.deepEqual(monster(state).intents, ['block', 'damage', 'damage'])

	state = a.takeMonsterTurn(state)
	// The value "7" is hardcoded in the action for now.
	t.is(monster(state).block, 7)
	state = a.takeMonsterTurn(state)
	t.is(state.player.currentHealth, 95)
	state = a.endTurn(state)
	state = a.takeMonsterTurn(state)
	t.is(state.player.currentHealth, 90)
	state = a.endTurn(state)
	state = a.takeMonsterTurn(state)
	t.is(monster(state).block, 7, 'block doesnt stack')
	state = a.endTurn(state)
})
