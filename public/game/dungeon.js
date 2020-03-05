import {uuid} from './utils.js'

// A dungeon is where the adventure starts. It has a path of rooms, you know where you are and you can continue to the next room.
export default function Dungeon(props) {
	if (!props.rooms) throw new Error('You must pass in rooms to create a dungeon')
	this.id = uuid()
	this.rooms = props.rooms
	this.roomNumber = props.roomNumber || 0
}

// A campfire gives our hero the opportunity to rest, remove or upgrade a card.
export function CampfireRoom() {
	this.id = uuid()
	this.type = 'campfire'
}

// A monster room has one or more monsters.
export function MonsterRoom(...monsters) {
	this.id = uuid()
	this.type = 'monster'
	this.monsters = monsters
}

// A monster has health, probably some damage and a list of intents.
// Intents are cycled through as the monster plays its turn.
export function Monster(props = {}) {
	this.maxHealth = props.hp || 42
	this.currentHealth = props.hp || 42
	this.damage = props.damage || 5
	this.powers = {}
	// this.damage = randomBetween(props.damage - 1, props.damage + 1)
	// this.intents = ['attack', 'block', 'attack', 'attack']
}

// A couple of utilities
export function isMonsterRoomCleared(state) {
	const room = state.dungeon.rooms[state.dungeon.roomNumber || 0]
	const deadMonsters = room.monsters.filter(m => m.currentHealth < 1)
	return deadMonsters.length === room.monsters.length
}
