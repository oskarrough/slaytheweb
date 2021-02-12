import {dungeonMap} from './map.js'
import {uuid} from './utils.js'
import {shuffle, range} from './utils.js'
import {monsters} from '../content/dungeon-encounters.js'

// A dungeon is where the adventure starts.
export default function Dungeon(options = {}) {
	const dungeon = dungeonMap(options)

	// Add "room" to all valid node in the graph.
	dungeon.graph.forEach((row, level) => {
		row.map((node) => {
			if (node.type) {
				node.room = createRandomRoom(node.type, level)
			}
		})
	})

	// Pass it your desired room type as well as the level,
	// and it'll return a (more or less) random room to use.
	function createRandomRoom(type, level) {
		if (level === 0) return StartRoom()
		if (level === dungeon.graph.length - 1) return BossRoom()
		// if (type === 'M' && level < 5) return randomEasyMonster()
		if (type === 'M') return monsters[shuffle(Object.keys(monsters))[0]]
		if (type === 'E') return MonsterRoom(Monster({intents: [{damage: 10}, {block: 5}], hp: 30}))
		if (type === 'C') return CampfireRoom()
		// return MonsterRoom(Monster({intents: [{block: 5}], hp: 10}))
		throw new Error(`Could not match node type ${type} with a dungeon room`)
	}

	return dungeon
}

export function StartRoom() {
	return {
		id: uuid(),
		type: 'start',
	}
}

export function BossRoom() {
	return {
		id: uuid(),
		type: 'boss',
	}
}

// A campfire gives our hero the opportunity to rest, remove or upgrade a card.
export function CampfireRoom() {
	return {
		id: uuid(),
		type: 'campfire',
		// choices: ['rest', 'remove', 'upgrade'],
	}
}

// A monster room has one or more monsters.
export function MonsterRoom(...monsters) {
	return {
		id: uuid(),
		type: 'monster',
		monsters,
	}
}

// A monster has health, probably some damage and a list of intents.
// Use a list of intents to describe what the monster should do each turn.
// Supported intents: block, damage, vulnerable and weak.
// Intents are cycled through as the monster plays its turn.
export function Monster(props = {}) {
	let intents = props.intents

	// By setting props.random to a number, all damage intents will be randomized with this range.
	if (typeof props.random === 'number') {
		intents = props.intents.map((intent) => {
			if (intent.damage) {
				let newDamage = shuffle(range(5, intent.damage - props.random))[0]
				intent.damage = newDamage
			}
			return intent
		})
	}

	return {
		id: uuid(),
		currentHealth: props.currentHealth || props.hp || 42,
		maxHealth: props.hp || 42,
		block: props.block || 0,
		powers: props.powers || {},
		// A list of "actions" the monster will take each turn.
		// Example: [{damage: 6}, {block: 2}, {}, {weak: 2}]
		// ... meaning turn 1, deal 6 damage, turn 2 gain 2 block, turn 3 do nothing, turn 4 apply 2 weak
		intents: intents || [],
		// A counter to keep track of which intent to run next.
		nextIntent: 0,
	}
}
