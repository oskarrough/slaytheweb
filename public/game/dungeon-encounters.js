import Dungeon, {CampfireRoom, MonsterRoom, Monster} from './dungeon.js'

// An example dungeon showcasing some different rooms.
export const createSimpleDungeon = () => {
	const intents = [{block: 7}, {damage: 10}, {damage: 10}]
	const normal = () => MonsterRoom(Monster({intents}))
	const elite = () => MonsterRoom(Monster({hp: 24, intents}), Monster({hp: 20, intents}))
	const boss = () => MonsterRoom(Monster({hp: 150, intents}), Monster({intents}))
	return Dungeon({
		rooms: [normal(), elite(), CampfireRoom(), boss()]
	})
}

