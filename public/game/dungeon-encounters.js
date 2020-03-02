import Dungeon, {MonsterRoom, Monster} from './dungeon.js'

export const encounter1 = new MonsterRoom(new Monster())
export const encounter2 = new MonsterRoom(new Monster({hp: 24}), new Monster({hp: 20}))
export const encounter3 = new MonsterRoom(new Monster(), new Monster(), new Monster())

export const createSimpleDungeon = () => new Dungeon({rooms: [encounter1, encounter2, encounter3]})
