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

// Get the value at "path" of "object"
// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_get
export const get = (obj, path, defaultValue) => {
	const travel = regexp =>
		String.prototype.split
			.call(path, regexp)
			.filter(Boolean)
			.reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj)
	const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/)
	return result === undefined || result === obj ? defaultValue : result
}

// Support a target like "enemyx", where x is the order of the monster.
export function getMonster(obj, target) {
	let path = target
	// console.log({pathbefore: path})
	if (target.includes('enemy')) {
		const monsterIndex = target.split('enemy')[1]
		path = `dungeon.rooms[0].monsters[${monsterIndex}]`
	}
	// console.log({pathafter: path})
	const result = get(obj, path)
	// console.log({result})
	return result
}
