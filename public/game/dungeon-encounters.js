import Dungeon, {MonsterRoom, Monster} from './dungeon.js'

// This file contains ready-to-use dungeons filled with rooms and exciting monsters.

// Use a list of intents to describe what the monster should do each turn.
// Supported intents: block, damage, vulnerable and weak.
const intents = [{block: 7}, {damage: 10}, {damage: 10}]
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
	{damage: 50}
]

const normalRoom = () => MonsterRoom(Monster({intents}))
const eliteRoom = () =>
	MonsterRoom(Monster({hp: 24, intents}), Monster({hp: 13, intents: scalingIntents}))
const bossRoom = () => MonsterRoom(Monster({hp: 92, intents}), Monster({intents: scalingIntents}))

// const CultistMonster = () =>
// 	Monster({
// 		// hp: 48-54,
// 		hp: 48,
// 		intents: [{weak: 1}, {damage: 6}]
// 	})

export const createSimpleDungeon = () => {
	return Dungeon({
		rooms: [
			// MonsterRoom(CultistMonster()),
			normalRoom(),
			eliteRoom(),
			bossRoom()
		]
	})
}
