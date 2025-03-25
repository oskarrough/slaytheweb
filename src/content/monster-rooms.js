import {Monster} from '../game/monster.js'
import {MonsterRoom} from '../game/rooms.js'
import {random} from '../utils.js'

// Groups of monster rooms of varying difficulty. Technically elites and bosses are just stronger monsters.
export const easyMonsters = {}
export const monsters = {}
export const elites = {}
export const bosses = {}

easyMonsters['Easy does it'] = MonsterRoom(
	Monster({
		hp: random(8, 14),
		intents: [{damage: 7}, {damage: 11}, {damage: 7}, {block: 9}],
		random: 2,
	}),
)
easyMonsters['Easy does it x2'] = MonsterRoom(
	Monster({
		hp: random(8, 14),
		intents: [{damage: 7}, {damage: 11}, {damage: 7}, {block: 9}],
		random: 2,
	}),
	Monster({
		hp: random(8, 14),
		intents: [{damage: 6}, {damage: 11}, {damage: 5}, {block: 5}],
		random: 1,
	}),
)

monsters['RNG does it'] = MonsterRoom(
	Monster({
		hp: random(18, 20),
		intents: [{damage: 7}, {damage: 11}, {damage: 7}, {block: 9}],
		random: 4,
	}),
)
monsters['Easy one'] = MonsterRoom(
	Monster({
		hp: random(33, 37),
		intents: [{vulnerable: 1}, {damage: 10}, {damage: 6}, {}, {weak: 1}],
		random: 2,
	}),
)
//not perfect copy of base game monster, but pretty close
//needs to gain strength (add to the 6 block)
monsters['jaw worm'] = MonsterRoom(
	Monster({
		hp: random(40, 44),
		intents: [{damage: 11}, {damage: 7, block: 5}, {block: 6}],
	}),
)
monsters['First double trouble'] = MonsterRoom(
	Monster({
		hp: random(13, 17),
		intents: [{damage: 7}, {block: 4, damage: 8}, {damage: 6}, {}, {block: 6}],
		random: 2,
	}),
	Monster({
		hp: 29,
		intents: [{damage: 9}, {damage: 8}, {weak: 1}, {damage: 6}, {}],
		random: 2,
	}),
)
monsters['Mid sized duo'] = MonsterRoom(
	Monster({
		hp: random(28, 32),
		intents: [{weak: 1}, {damage: 9}, {damage: 6}, {}, {weak: 1}],
		random: 2,
	}),
	Monster({
		hp: random(50, 54),
		intents: [{vulnerable: 1}, {damage: 6}, {damage: 9}, {block: 10}],
		random: 2,
	}),
)
monsters['Tiny Trio'] = MonsterRoom(
	Monster({hp: random(12, 15), random: 2, intents: [{damage: 6}]}),
	Monster({hp: random(12, 15), random: 2, intents: [{damage: 6}]}),
	Monster({hp: random(10, 16), random: 3, intents: [{damage: 6}]}),
)
monsters['monster10'] = MonsterRoom(
	Monster({
		hp: 28,
		intents: [{weak: 1}, {block: 10, damage: 10}, {damage: 21}],
	}),
)

elites['monster7'] = MonsterRoom(
	Monster({
		hp: 46,
		intents: [{damage: 12}, {block: 6, damage: 11}, {block: 5, damage: 16}, {}, {block: 6}],
	}),
)
elites['monster9'] = MonsterRoom(
	Monster({
		hp: 60,
		intents: [{damage: 12}, {damage: 11, weak: 1}, {damage: 4, block: 6}],
		random: 6,
	}),
)
elites['Tougher'] = MonsterRoom(Monster({hp: 70, block: 12, intents: [{block: 5}, {damage: 16}]}))
elites['The Trio'] = MonsterRoom(
	Monster({
		hp: random(39, 46),
		intents: [{weak: 1}, {damage: 10}],
	}),
	Monster({
		hp: random(39, 46),
		intents: [{damage: 10}, {weak: 1}, {damage: 4}],
	}),
	Monster({
		hp: random(39, 46),
		intents: [{damage: 2}, {damage: 10}, {damage: 8}],
	}),
)

bosses['The Large One'] = MonsterRoom(
	Monster({
		hp: random(100, 140),
		intents: [{damage: 16}, {block: 6}, {damage: 16}, {damage: 7}, {weak: 2}],
		random: 5,
	}),
)
bosses['Scale much?'] = MonsterRoom(
	Monster({
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
