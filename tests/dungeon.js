import test from 'ava'
import actions from '../public/game/actions'
import Dungeon, {
	CampfireRoom,
	MonsterRoom,
	Monster,
	isCurrentMonsterRoomCleared
} from '../public/game/dungeon'

const a = actions

// Each test gets a fresh game state.
test.beforeEach(t => {
	let state = a.createNewGame()
	state = a.drawStarterDeck(state)
	state = a.drawCards(state)
	t.context = {state}
})

test('can create a dungeon', t => {
	const simpleDungeon = Dungeon({
		rooms: [MonsterRoom(Monster()), CampfireRoom(), MonsterRoom(Monster())]
	})
	t.is(simpleDungeon.rooms.length, 3)
	t.is(simpleDungeon.rooms[0].type, 'monster')
	t.is(simpleDungeon.rooms[0].monsters.length, 1)
	t.is(simpleDungeon.rooms[1].type, 'campfire')
	t.is(simpleDungeon.rooms[2].type, 'monster')
})

test('can create rooms with many monsters', t => {
	const room = new MonsterRoom(new Monster(), new Monster({hp: 20}))
	t.is(room.monsters.length, 2)
	t.is(room.monsters[1].maxHealth, 20)
})

test('we know when a monster room is won', t => {
	const room = new MonsterRoom(new Monster())
	const state = {
		dungeon: {
			rooms: [room]
		}
	}
	t.false(isCurrentMonsterRoomCleared(state))
	room.monsters[0].currentHealth = 0
	t.true(isCurrentMonsterRoomCleared(state))
})

test('we know when a monster room with many monsters is won', t => {
	const room = new MonsterRoom(new Monster(), new Monster())
	const state = {dungeon: {rooms: [room]}}
	t.false(isCurrentMonsterRoomCleared(state))
	room.monsters[0].currentHealth = 0
	t.false(isCurrentMonsterRoomCleared(state))
	room.monsters[1].currentHealth = 0
	t.true(isCurrentMonsterRoomCleared(state))
})

test.skip('we know when a campfire has been used', t => {
	const camp = new CampfireRoom()
	t.false(camp.isComplete)
	camp.rest()
	t.true(camp.isComplete)
})

test('we can navigate a dungeon', t => {
	// Prepare a game with a dungeon.
	let state = a.createNewGame()
	const dungeon = Dungeon({
		rooms: [CampfireRoom(), CampfireRoom(), CampfireRoom()]
	})

	state = a.setDungeon(state, {dungeon})
	t.deepEqual(state.dungeon, dungeon, 'setting dungeon works')

	// Go to the next room.
	state = a.goToNextRoom(state)
	t.is(state.dungeon.roomNumber, 1)
	t.is(state.dungeon.rooms[state.dungeon.roomNumber].id, dungeon.rooms[1].id)

	state = a.goToNextRoom(state)
	t.is(state.dungeon.roomNumber, 2)
	t.is(state.dungeon.rooms[state.dungeon.roomNumber].id, dungeon.rooms[2].id)

	t.throws(() => a.goToNextRoom(state), null, 'can go further than last room')
})

test('context...', t => {
	const {state} = t.context
	t.falsy(state.dungeon)

	const room = new CampfireRoom()
	t.is(room.type, 'campfire')

	const dungeon = new Dungeon({rooms: [room]})
	t.is(dungeon.rooms[0].type, 'campfire')
	const state2 = actions.setDungeon(state, {dungeon})
	t.is(state2.dungeon.id, dungeon.id, 'setting a dungeon works?!')
	t.is(state2.dungeon.rooms[0].type, 'campfire')
})
