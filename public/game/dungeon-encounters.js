import Dungeon, {CampfireRoom, MonsterRoom, Monster} from './dungeon.js'

// An example dungeon showcasing some different rooms.
export const createSimpleDungeon = () => {
	const intents = [{block: 7}, {damage: 10}, {damage: 10}]
	// const intents2 = [{damage: 6}, {damage: 5}, {damage: 8}]
	const dangerousIntents = [
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
	const normal = () => MonsterRoom(Monster({intents}))
	const elite = () =>
		MonsterRoom(Monster({hp: 24, intents}), Monster({hp: 13, intents: dangerousIntents}))
	const boss = () => MonsterRoom(Monster({hp: 150, intents}), Monster({intents: dangerousIntents}))
	return Dungeon({
		rooms: [normal(), elite(), CampfireRoom(), boss()]
	})
}
