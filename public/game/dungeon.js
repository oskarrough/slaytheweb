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
export class Monster {
	constructor(props = {}) {
		this.id = uuid()
		this.maxHealth = props.hp || 42
		this.currentHealth = props.hp || 42
		this.damage = props.damage || 5
		// this.damage = random(5)
		this.intents = ['attack', 'block', 'attack', 'attack']
	}
	beforeBattle() {}
	takeTurn() {
		console.log('takeTurn')
	}
}

// export const encounter1 = new MonsterRoom(new Monster())
// export const encounter2 = new MonsterRoom(new Monster({hp: 24}), new Monster({hp: 20}))
// export const encounter3 = new MonsterRoom(new Monster(), new Monster(), new Monster())
