/* eslint-disable no-unused-vars */
import Dungeon from '../game/dungeon.js'
import {MonsterRoom, Monster} from '../game/dungeon-rooms.js'
import {random} from '../game/utils.js'

// Hello. With the imported functions above you can create a dungeon with different rooms and monsters.
// This file contains the example dungeon used in Slay the Web.

export const dungeonWithMap = () => {
	return Dungeon({
		width: 6,
		height: 7,
		minRooms: 3,
		maxRooms: 4,
		customPaths: '0235',
	})
}

// This is the dungeon used in tests. Don't change it without running tests.
export const createTestDungeon = () => {
	const dungeon = Dungeon({width: 1, height: 3})
	// The tests rely on the first room having a single monster, second two monsters.
	const intents = [{block: 7}, {damage: 10}, {damage: 8}, {}, {damage: 14}]
	dungeon.graph[1][0].room = MonsterRoom(Monster({hp: 42, intents}))
	dungeon.graph[2][0].room = MonsterRoom(Monster({hp: 24, intents}), Monster({hp: 13, intents}))
	return dungeon
}

// Here are some different monsters we use in the game.
export const monsters = {}
monsters['Necromancer'] = MonsterRoom(
	Monster({
		hp: random(18, 20),
		intents: [{damage: 7}, {damage: 11}, {damage: 7}, {block: 9}],
		random: 2,
	})
)
monsters['monster2'] = MonsterRoom(
	Monster({
		hp: random(43, 47),
		intents: [{vulnerable: 1}, {damage: 10}, {damage: 6}, {}, {weak: 1}],
		random: 2,
	})
)
monsters['monster3'] = MonsterRoom(
	Monster({
		hp: random(13, 17),
		intents: [{damage: 7}, {block: 4, damage: 8}, {damage: 6}, {}, {block: 6}],
		random: 2,
	}),
	Monster({
		hp: 29,
		intents: [{damage: 9}, {damage: 8}, {weak: 1}, {damage: 6}, {}],
		random: 2,
	})
)
monsters['monster4'] = MonsterRoom(
	Monster({
		hp: random(34, 36),
		intents: [{weak: 1}, {damage: 10}, {damage: 6}, {}, {weak: 1}],
		random: 2,
	}),
	Monster({
		hp: random(56, 58),
		intents: [{vulnerable: 1}, {damage: 6}, {damage: 9}, {block: 10}],
		random: 2,
	})
)
monsters['monster5'] = MonsterRoom(
	Monster({hp: 70, block: 12, intents: [{block: 5}, {damage: 16}]})
)
monsters['monster6'] = MonsterRoom(
	Monster({hp: random(12, 15), random: 1, intents: [{damage: 6}]}),
	Monster({hp: random(12, 15), random: 1, intents: [{damage: 6}]}),
	Monster({hp: random(10, 16), random: 3, intents: [{damage: 6}]})
)
monsters['monster7'] = MonsterRoom(
	Monster({
		hp: 46,
		intents: [{damage: 12}, {block: 6, damage: 11}, {block: 5, damage: 16}, {}, {block: 6}],
	})
)
monsters['monster8'] = MonsterRoom(
	Monster({
		hp: random(39, 46),
		intents: [{weak: 1}, {damage: 10}],
	}),
	Monster({
		hp: random(39, 46),
		intents: [{damage: 10}, {weak: 1}],
	}),
	Monster({
		hp: random(39, 46),
		intents: [{weak: 1}, {damage: 10}],
	})
)
monsters['monster9'] = MonsterRoom(Monster({hp: 60, intents: [{damage: 12}], random: 5}))
monsters['monster10'] = MonsterRoom(
	Monster({
		hp: 48,
		intents: [{weak: 1}, {block: 10, damage: 10}, {damage: 21}],
	})
)
monsters['monster11'] = MonsterRoom(
	Monster({
		hp: random(100, 140),
		intents: [{damage: 12}, {block: 6}, {damage: 16}, {damage: 7}, {weak: 2}],
		random: 5,
	})
)
