// A dungeon consists of different encounters and campfires.
// An encounter is a fight against one or more monsters.
// A campfire gives our hero the opportunity to rest, remove or upgrade a card.

const exampleDungeon = [
	encounter1,
	campfire,
	encounter2,
	encounter3,
	campfire,
	encounter2
]

// Either rest, upgrade or remove a card
const campfire = {
	rest() {
		console.log('rest')
	},
	upgrade(card) {
		console.log('upgrade card', card)
	},
	remove(card) {
		console.log('remove card', card)
	}
}

const encounter1 = {
	enemies: [monster1]
}

const encounter2 = {
	enemies: [monster2]
}

const encounter3 = {
	enemies: [monster1, monster1, monster1]
}


// Weak, Strong and Elite monsters
class Monster {
	constructor({id, hp, damage}) {
		this.id = id
		this.hp = hp
		this.damage = random(damage)
	}
	beforeBattle() {}
	takeTurn() {}
}

const monster1 = {
	intents: []
}

const monster2 = {}

