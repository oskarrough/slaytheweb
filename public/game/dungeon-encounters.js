import Dungeon, {CampfireRoom, MonsterRoom, Monster} from './dungeon.js'

// Define some different monsters.
const normal = new MonsterRoom(new Monster())
const elite = new MonsterRoom(new Monster({hp: 24}), new Monster({hp: 20}))
const boss = new MonsterRoom(new Monster({hp: 150}), new Monster())

// An example dungeon showcasing some different fights.
export const createSimpleDungeon = () =>
	new Dungeon({
		rooms: [normal, elite, new CampfireRoom(), boss]
	})
