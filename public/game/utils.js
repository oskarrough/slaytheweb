// Returns a random-looking string for ids.
export function uuid(a) {
	return a
		? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
		: ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid)
}

// Returns a new, shuffled version of an array.
// See https://bost.ocks.org/mike/shuffle/
export function shuffle(array) {
	// Make a copy
	array = array.slice()
	var m = array.length
	var t
	var i

	// While there remain elements to shuffle…
	while (m) {
		// Pick a remaining element…
		i = Math.floor(Math.random() * m--)

		// And swap it with the current element.
		t = array[m]
		array[m] = array[i]
		array[i] = t
	}

	return array
}

// Support a target like "enemyx", where x is the order of the monster.
export function getMonster(state, target) {
	if (target === 'player') {
		return state.player
	}
	if (target.startsWith('enemy')) {
		const index = target.split('enemy')[1]
		// console.log({index, number: state.dungeon.roomNumber, room: state.dungeon.rooms[state.dungeon.roomNumber]})
		const monster = state.dungeon.rooms[state.dungeon.roomNumber].monsters[index]
		if (!monster) {
			throw new Error(`could not find "${target}" in room ${state.dungeon.roomNumber}`)
		}
		return monster
	}
	throw new Error(`Can not find monster with target: "${target}"`)
}

// Check if the current room in a game has been cleared.
export function isCurrentRoomCompleted(state) {
	const room = state.dungeon.rooms[state.dungeon.roomNumber || 0]

	if (room.type === 'monster') {
		const deadMonsters = room.monsters.filter(m => m.currentHealth < 1)
		return deadMonsters.length === room.monsters.length
	}

	if (room.type === 'campfire') {
		// @todo
	}
}
