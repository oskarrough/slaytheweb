import {uuid} from './utils.js'
import {shuffle, range} from './utils.js'

// A dungeon is where the adventure starts.
export default function Dungeon(props) {
	if (!props.rooms) throw new Error('You must pass in rooms to create a dungeon')
	return {
		id: uuid(),
		rooms: props.rooms,
		index: 0,
	}
}

// A campfire gives our hero the opportunity to rest, remove or upgrade a card.
export function CampfireRoom() {
	return {
		id: uuid(),
		type: 'campfire',
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
		maxHealth: props.hp || 42,
		currentHealth: props.currentHealth || props.hp || 42,
		damage: props.damage || 5,
		block: props.block || 0,
		powers: props.powers || {},
		intents: intents || [],
		nextIntent: 0,
	}
}
