import {uuid} from './utils.js'

// A dungeon is where the adventure starts. It has a path of rooms, you know where you are and you can continue to the next room.
export default class Dungeon {
	constructor(props) {
		if (props.rooms.length) this.rooms = props.rooms
		this.currentIndex = 0
	}
	get currentRoom() {
		return this.rooms[this.currentIndex]
	}
	goToNextRoom() {
		if (this.currentIndex === this.rooms.length - 1) throw new Error('Already at last room')
		this.currentIndex++
	}
}

// Room types: Monster, Elite, Boss, Campfire, Shop, Treasure and Event
class Room {
	constructor(type) {
		this.type = type
		this.id = uuid()
	}
	get isComplete() {
		return false
	}
}

// A campfire gives our hero the opportunity to rest, remove or upgrade a card.
export class CampfireRoom extends Room {
	constructor() {
		super('campfire')
	}
	rest() {
		console.log('rest')
	}
	upgrade(card) {
		console.log('upgrade card', card)
	}
	remove(card) {
		console.log('remove card', card)
	}
}

export class MonsterRoom extends Room {
	constructor(...monsters) {
		super('monster')
		this.monsters = monsters
	}
	get isComplete() {
		const dead = this.monsters.filter(m => m.currentHealth < 1)
		return dead.length === this.monsters.length
	}
}

// A monster has health, probably some damage and a list of intents.
// Intents are cycled through as the monster plays its turn.

export function Monster(props = {}) {
	// const id = uuid()
	const maxHealth = props.hp || 42
	const currentHealth = props.hp || 42
	const damage = props.damage || 5
	// const damage = random(5)
	// const intents = ['attack', 'block', 'attack', 'attack']
	return {
		maxHealth,
		currentHealth,
		damage,
		powers: {}
	}
}
