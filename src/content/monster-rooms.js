import {Monster} from '../game/monster.js'
import {MonsterRoom} from '../game/rooms.js'
import {random} from '../utils.js'

// Groups of monster rooms of varying difficulty. Technically elites and bosses are just stronger monsters.
export const monsters = {}
export const elites = {}
export const bosses = {}

monsters['Lone Orc Scout'] = MonsterRoom(
	Monster({
		name: 'Orc Scout',
		sprite: [0, 2],
		hp: random(8, 14),
		intents: [{damage: 7}, {damage: 11}, {damage: 7}, {block: 9}],
		random: 2,
	}),
)
monsters['Orc Patrol'] = MonsterRoom(
	Monster({
		name: 'Orc Archer',
		sprite: [0, 5],
		hp: random(8, 14),
		intents: [{damage: 7}, {damage: 11}, {damage: 7}, {block: 9}],
		random: 2,
	}),
	Monster({
		name: 'Orc Scout',
		sprite: [0, 2],
		hp: random(8, 14),
		intents: [{damage: 6}, {damage: 11}, {damage: 5}, {block: 5}],
		random: 1,
	}),
)

monsters['Orc Warrior'] = MonsterRoom(
	Monster({
		name: 'Orc Warrior',
		sprite: [0, 0],
		hp: random(18, 20),
		intents: [{damage: 7}, {damage: 11}, {damage: 7}, {block: 9}],
		random: 4,
	}),
)
monsters['Skeleton Warrior'] = MonsterRoom(
	Monster({
		name: 'Skeleton Warrior',
		sprite: [4, 0],
		hp: random(33, 37),
		intents: [{vulnerable: 1}, {damage: 10}, {damage: 6}, {}, {weak: 1}],
		random: 2,
	}),
)
//not perfect copy of base game monster, but pretty close
//needs to gain strength (add to the 6 block)
monsters['Jaw Worm'] = MonsterRoom(
	Monster({
		name: 'Jaw Worm',
		sprite: [6, 2],
		hp: random(40, 44),
		intents: [{damage: 11}, {damage: 7, block: 5}, {block: 6}],
	}),
)
monsters['Slime and Shaman'] = MonsterRoom(
	Monster({
		name: 'Small Slime',
		sprite: [2, 0],
		hp: random(13, 17),
		intents: [{damage: 7}, {block: 4, damage: 8}, {damage: 6}, {}, {block: 6}],
		random: 2,
	}),
	Monster({
		name: 'Orc Shaman',
		sprite: [0, 1],
		hp: 29,
		intents: [{damage: 9}, {damage: 8}, {weak: 1}, {damage: 6}, {}],
		random: 2,
	}),
)
monsters['Ghost and Berserker'] = MonsterRoom(
	Monster({
		name: 'Ghost',
		sprite: [5, 3],
		hp: random(28, 32),
		intents: [{weak: 1}, {damage: 9}, {damage: 6}, {}, {weak: 1}],
		random: 2,
	}),
	Monster({
		name: 'Orc Berserker',
		sprite: [0, 3],
		hp: random(50, 54),
		intents: [{vulnerable: 1}, {damage: 6}, {damage: 9}, {block: 10}],
		random: 2,
	}),
)
monsters['Rat Pack'] = MonsterRoom(
	Monster({name: 'Giant Rat', sprite: [6, 11], hp: random(12, 15), random: 2, intents: [{damage: 6}]}),
	Monster({name: 'Giant Rat', sprite: [6, 11], hp: random(12, 15), random: 2, intents: [{damage: 6}]}),
	Monster({name: 'Giant Rat', sprite: [6, 11], hp: random(10, 16), random: 3, intents: [{damage: 6}]}),
)
monsters['Troll Bruiser'] = MonsterRoom(
	Monster({
		name: 'Troll',
		sprite: [1, 2],
		hp: 28,
		intents: [{weak: 1}, {block: 10, damage: 10}, {damage: 21}],
	}),
)

elites['Death Knight'] = MonsterRoom(
	Monster({
		name: 'Death Knight',
		sprite: [4, 3],
		hp: 46,
		intents: [{damage: 12}, {block: 6, damage: 11}, {block: 5, damage: 16}, {}, {block: 6}],
	}),
)
elites['Orc Warchief'] = MonsterRoom(
	Monster({
		name: 'Orc Warchief',
		sprite: [0, 4],
		hp: 60,
		intents: [{damage: 12}, {damage: 11, weak: 1}, {damage: 4, block: 6}],
		random: 6,
	}),
)
elites['Two-Headed Ettin'] = MonsterRoom(
	Monster({name: 'Ettin', sprite: [1, 0], hp: 70, block: 12, intents: [{block: 5}, {damage: 16}]}),
)
elites['Dark Covenant'] = MonsterRoom(
	Monster({
		name: 'Ghost Cultist',
		sprite: [5, 3],
		hp: random(39, 46),
		intents: [{weak: 1}, {damage: 10}],
	}),
	Monster({
		name: 'Hag',
		sprite: [5, 4],
		hp: random(39, 46),
		intents: [{damage: 10}, {weak: 1}, {damage: 4}],
	}),
	Monster({
		name: 'Wraith',
		sprite: [5, 2],
		hp: random(39, 46),
		intents: [{damage: 2}, {damage: 10}, {damage: 8}],
	}),
)

bosses['Ancient Dragon'] = MonsterRoom(
	Monster({
		name: 'Ancient Dragon',
		sprite: [8, 2],
		hp: random(100, 140),
		intents: [{damage: 16}, {block: 6}, {damage: 16}, {damage: 7}, {weak: 2}],
		random: 5,
	}),
)
bosses['Slime King'] = MonsterRoom(
	Monster({
		name: 'Slime King',
		sprite: [2, 1],
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
	}),
)
