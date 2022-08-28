import Dungeon from '../game/dungeon.js'
import {MonsterRoom, Monster} from '../game/dungeon-rooms.js'
import {random} from '../game/utils.js'

// Hello. With the imported functions above you can create a dungeon with different rooms and monsters.

// This is the dungeon currently used.
export const dungeonWithMap = () => {
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
	// The tests rely on the first room having a single monster, second two monsters.
	const intents = [{block: 7}, {damage: 10}, {damage: 8}, {}, {damage: 14}]
	dungeon.graph[1][0].room = MonsterRoom(Monster({hp: 42, intents}))
	dungeon.graph[2][0].room = MonsterRoom(Monster({hp: 24, intents}), Monster({hp: 13, intents}))
	dungeon.graph[3][0].room = MonsterRoom(Monster({hp: 42, intents}))
	return dungeon
}

// Here are some different monsters we use in the game.

export const easyMonsters = {}
export const monsters = {}
export const elites = {}
export const bosses = {}

easyMonsters['Easy does it'] = MonsterRoom(
	Monster({
		hp: random(8, 13),
		intents: [{damage: 7}, {damage: 11}, {damage: 7}, {block: 9}],
		random: 2,
	})
)
easyMonsters['Easy does it x2'] = MonsterRoom(
	Monster({
		hp: random(8, 13),
		intents: [{damage: 7}, {damage: 11}, {damage: 7}, {block: 9}],
		random: 2,
	}),
	Monster({
		hp: random(8, 13),
		intents: [{damage: 6}, {damage: 11}, {damage: 5}, {block: 5}],
		random: 1,
	})
)
monsters['RNG does it'] = MonsterRoom(
	Monster({
		hp: random(18, 20),
		intents: [{damage: 7}, {damage: 11}, {damage: 7}, {block: 9}],
		random: 4,
	})
)
monsters['Easy one'] = MonsterRoom(
	Monster({
		hp: random(33, 37),
		intents: [{vulnerable: 1}, {damage: 10}, {damage: 6}, {}, {weak: 1}],
		random: 2,
	})
)
monsters['First double trouble'] = MonsterRoom(
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
monsters['Mid sized duo'] = MonsterRoom(
	Monster({
		hp: random(28, 32),
		intents: [{weak: 1}, {damage: 9}, {damage: 6}, {}, {weak: 1}],
		random: 2,
	}),
	Monster({
		hp: random(50, 54),
		intents: [{vulnerable: 1}, {damage: 6}, {damage: 9}, {block: 10}],
		random: 2,
	})
)
monsters['Tiny Trio'] = MonsterRoom(
	Monster({hp: random(12, 15), random: 2, intents: [{damage: 6}]}),
	Monster({hp: random(12, 15), random: 2, intents: [{damage: 6}]}),
	Monster({hp: random(10, 16), random: 3, intents: [{damage: 6}]})
)
elites['monster7'] = MonsterRoom(
	Monster({
		hp: 46,
		intents: [{damage: 12}, {block: 6, damage: 11}, {block: 5, damage: 16}, {}, {block: 6}],
	})
)
monsters['monster10'] = MonsterRoom(
	Monster({
		hp: 28,
		intents: [{weak: 1}, {block: 10, damage: 10}, {damage: 21}],
	})
)

elites['monster9'] = MonsterRoom(
	Monster({
		hp: 60,
		intents: [{damage: 12}, {damage: 11, weak: 1}, {damage: 4, block: 6}],
		random: 6,
	})
)
elites['Tougher'] = MonsterRoom(Monster({hp: 70, block: 12, intents: [{block: 5}, {damage: 16}]}))
elites['The Trio'] = MonsterRoom(
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

bosses['The Large One'] = MonsterRoom(
	Monster({
		hp: random(100, 140),
		intents: [{damage: 16}, {block: 6}, {damage: 16}, {damage: 7}, {weak: 2}],
		random: 5,
	})
)
bosses['Scale much?'] = MonsterRoom(
	Monster({
		hp: 62,
		intents: [
			{damage: 5},
			{damage: 8},
			{damage: 12},
			{damage: 17},
			{damage: 23},
			{damage: 30},
			{damage: 38},
			{damage: 45},
		],
	})
)
