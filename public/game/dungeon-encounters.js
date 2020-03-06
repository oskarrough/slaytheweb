import Dungeon, {CampfireRoom, MonsterRoom, Monster} from './dungeon.js'

// An example dungeon showcasing some different rooms.
export const createSimpleDungeon = () => {
	const normal = () => MonsterRoom(Monster())
	const elite = () => MonsterRoom(Monster({hp: 24}), Monster({hp: 20}))
	const boss = () => MonsterRoom(Monster({hp: 150}), Monster())
	return Dungeon({
		rooms: [normal(), elite(), CampfireRoom(), boss()]
	})
}
