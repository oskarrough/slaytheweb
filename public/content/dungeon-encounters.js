import Dungeon, {MonsterRoom, Monster, CampfireRoom} from '../game/dungeon.js'
import {random} from '../game/utils.js'

// Hello. With the imported functions above you can create a dungeon with different rooms and monsters.
// This file contains the example dungeon used in Slay the Web.

const TrioMonsterA = () =>
	Monster({
		hp: random(39, 46),
		intents: [{weak: 1}, {damage: 10}],
	})

const TrioMonsterB = () =>
	Monster({
		hp: random(39, 46),
		intents: [{damage: 10}, {weak: 1}],
	})

export const createSimpleDungeon = () => {
	return Dungeon({
		rooms: [
			MonsterRoom(
				Monster({
					hp: random(18, 20),
					intents: [{damage: 7}, {damage: 11}, {damage: 7}, {block: 9}],
					random: 2,
				})
			),
			MonsterRoom(
				Monster({
					hp: random(43, 47),
					intents: [{vulnerable: 1}, {damage: 10}, {damage: 6}, {}, {weak: 1}],
					random: 2,
				})
			),
			CampfireRoom(),
			MonsterRoom(
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
			),
			CampfireRoom(),
			MonsterRoom(
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
			),
			MonsterRoom(Monster({hp: 70, block: 12, intents: [{block: 5}, {damage: 16}]})),
			CampfireRoom(),
			MonsterRoom(
				Monster({hp: random(12, 15), random: 1, intents: [{damage: 6}]}),
				Monster({hp: random(12, 15), random: 1, intents: [{damage: 6}]}),
				Monster({hp: random(10, 16), random: 3, intents: [{damage: 6}]})
			),
			// TreasureRoom(),
			CampfireRoom(),
			MonsterRoom(
				Monster({
					hp: 46,
					intents: [{damage: 12}, {block: 6, damage: 11}, {block: 5, damage: 16}, {}, {block: 6}],
				})
			),
			// UnknownRoom(),
			MonsterRoom(TrioMonsterA(), TrioMonsterB(), TrioMonsterA()),
			MonsterRoom(Monster({hp: 60, intents: [{damage: 12}], random: 5})),
			MonsterRoom(
				Monster({
					hp: 48,
					intents: [{weak: 1}, {block: 10, damage: 10}, {damage: 21}],
				})
			),
			CampfireRoom(),
			MonsterRoom(
				Monster({
					hp: random(160, 190),
					intents: [{damage: 12}, {block: 6}, {damage: 16}, {damage: 7}, {weak: 2}],
					random: 5,
				})
			),
		],
	})
}

// This is the dungeon used in tests. Don't change it without running tests.
export const createTestDungeon = () => {
	const intents = [{block: 7}, {damage: 10}, {damage: 8}, {}, {damage: 14}]
	return Dungeon({
		rooms: [
			MonsterRoom(Monster({hp: 42, intents})),
			MonsterRoom(Monster({hp: 24, intents}), Monster({hp: 13, intents})),
		],
	})
}
