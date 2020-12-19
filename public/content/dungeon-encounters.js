import Dungeon, {MonsterRoom, Monster, CampfireRoom} from '../game/dungeon.js'
import {random} from '../game/utils.js'

// Hello. With the imported functions above you can create a dungeon with different rooms and monsters.
// This file contains the example dungeon used in Slay the Web.

// Use a list of intents to describe what the monster should do each turn.
// Supported intents: block, damage, vulnerable and weak.
const intents = [{block: 7}, {damage: 10}, {damage: 8}, {}, {damage: 14}]

const scalingIntents = [
	{damage: 1},
	{damage: 2},
	{damage: 3},
	{damage: 4},
	{damage: 5},
	{damage: 6},
	{damage: 7},
	{damage: 8},
	{damage: 9},
	{damage: 10},
	{damage: 15},
	{damage: 20},
	{damage: 30},
	{damage: 50},
]

const ScalingMonster = () =>
	Monster({
		hp: 13,
		intents: scalingIntents,
	})

const STSMonster = () =>
	Monster({
		hp: 46,
		intents: [{damage: 12}, {block: 6, damage: 11}, {block: 5, damage: 16}, {}, {block: 6}],
	})

const CultistMonster = () =>
	Monster({
		hp: 48,
		intents: [{weak: 1}, {damage: 6}],
	})

const RandomMonster = () =>
	Monster({
		hp: random(18, 25),
		intents: [{damage: 5}, {damage: 10}, {damage: 5}, {damage: 12}],
		random: 2,
	})

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
			MonsterRoom(Monster({hp: 18, intents})),
			MonsterRoom(RandomMonster()),
			MonsterRoom(Monster({intents}), ScalingMonster()),
			MonsterRoom(STSMonster()),
			MonsterRoom(CultistMonster()),
			MonsterRoom(Monster({hp: 24, intents}), Monster({hp: 13, intents: scalingIntents})),
			MonsterRoom(RandomMonster({hp: 92, intents}), Monster({intents: scalingIntents})),
			MonsterRoom(TrioMonsterA(), TrioMonsterB(), TrioMonsterA()),
		],
	})
}

// This is the dungeon used in tests. Don't change it without running tests.
export const createTestDungeon = () => {
	return Dungeon({
		rooms: [
			MonsterRoom(Monster({hp: 42, intents})),
			MonsterRoom(Monster({hp: 24, intents}), Monster({hp: 13, intents})),
		],
	})
}
