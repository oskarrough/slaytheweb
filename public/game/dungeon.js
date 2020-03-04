import {uuid} from './utils.js'

// A dungeon is where the adventure starts. It has a path of rooms, you know where you are and you can continue to the next room.
export default function Dungeon(props) {
	this.id = uuid()
	this.rooms = props.rooms
	this.roomNumber = 0
	function getCurrentRoom() {
		return this.rooms[this.roomNumber]
	}
	function goToNextRoom() {
		if (this.roomNumber === this.rooms.length - 1) throw new Error('Already at last room')
		this.roomNumber = this.roomNumber + 1
		return this.roomNumber
	}
	return {
		id: this.id,
		roomNumber: this.roomNumber,
		rooms: this.rooms,
		getCurrentRoom,
		goToNextRoom
	}
}

// Room types: Monster, Elite, Boss, Campfire, Shop, Treasure and Event

// A campfire gives our hero the opportunity to rest, remove or upgrade a card.
export function CampfireRoom() {
	let complete = false
	function takeChoice(which) {
		if (complete) throw new Error('You already made your choice...')
		console.log('@todo campfire choice:', which)
		complete = true
	}
	function rest() {
		takeChoice('rest')
	}
	function upgrade(card) {
		takeChoice('upgrade')
	}
	function remove(card) {
		takeChoice('remove')
	}
	function isComplete() {
		return complete
	}
	return {id: uuid(), type: 'campfire', rest, upgrade, remove, isComplete}
}

export function MonsterRoom(...monsters) {
	function isComplete() {
		const dead = monsters.filter(m => m.currentHealth < 1)
		return dead.length === monsters.length
	}
	return {
		id: uuid(),
		type: 'monster',
		monsters,
		isComplete
	}
}

// A monster has health, probably some damage and a list of intents.
// Intents are cycled through as the monster plays its turn.
export function Monster(props = {}) {
	// const id = uuid()
	const maxHealth = props.hp || 42
	const currentHealth = props.hp || 42
	const damage = props.damage || 5
	// const damage = randomBetween(props.damage - 1, props.damage + 1)
	// const intents = ['attack', 'block', 'attack', 'attack']
	return {
		maxHealth,
		currentHealth,
		damage,
		powers: {}
	}
}
