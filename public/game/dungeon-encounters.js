import Dungeon, {CampfireRoom, MonsterRoom, Monster} from './dungeon.js'

// An example dungeon showcasing some different rooms.
export const createSimpleDungeon = () => {
	const normal = () =>
		MonsterRoom(
			Monster({
				intents: [{block: 7}, {damage: 10}, {damage: 10}]
			})
		)
	const elite = () => MonsterRoom(Monster({hp: 24}), Monster({hp: 20}))
	const boss = () => MonsterRoom(Monster({hp: 150}), Monster())
	return Dungeon({
		rooms: [normal(), elite(), CampfireRoom(), boss()]
	})
}
