import {Monster} from '../game/monster.js'
import {MonsterRoom} from '../game/rooms.js'
import Dungeon from '../game/dungeon.js'

export const createDefaultDungeon = () => {
	return Dungeon({
		width: 6,
		height: 10,
		minRooms: 3,
		maxRooms: 4,
		customPaths: '0235',
	})
}

// This is the dungeon used in tests. Don't change it without running tests.
export const createTestDungeon = () => {
	const dungeon = Dungeon({width: 1, height: 3})
	const intents = [{block: 7}, {damage: 10}, {damage: 8}, {}, {damage: 14}]
	// Add monster rooms on the first three nodes
	dungeon.graph[1][0].room = MonsterRoom(Monster({hp: 42, intents}))
	dungeon.graph[2][0].room = MonsterRoom(Monster({hp: 24, intents}), Monster({hp: 13, intents}))
	dungeon.graph[3][0].room = MonsterRoom(Monster({hp: 42, intents}))
	return dungeon
}

