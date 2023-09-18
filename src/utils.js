// A collection of utility functions.

/**
 * Creates a random-looking string for ids.
 * @param {number} [a]
 * @returns {string}
 */
export function uuid(a) {
	return a
		? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
		: // @ts-ignore
		  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid)
}

/**
 * Returns a new, shuffled version of an array.
 * See https://bost.ocks.org/mike/shuffle/
 * @param {Array} array
 * @returns {Array}
 */
export function shuffle(array) {
	// Make a copy
	array = array.slice()
	let m = array.length
	let t
	let i

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

/**
 * Returns a range of numbers.
 * Example: range(3) === [1,2,3] or range(3, 6) === [6,7,8]
 * range(3, 2) = [2,3,4]
 * @param {*} size
 * @param {*} startAt
 * @returns {Array<number>}
 */
export function range(size, startAt = 0) {
	return [...Array(size).keys()].map((i) => i + startAt)
}

/**
 * @param {number} from
 * @param {number} to
 * @returns {number} a random number within the range
 */
export function random(from, to) {
	const r = range(1 + to - from, from) // random(2,4) = range(3,2)
	if (from === to) return from // e.g. 5-5 returns 5 instead of 0
	return shuffle(r)[0]
}

export function clamp(x, lower, upper) {
	return Math.max(lower, Math.min(x, upper))
}

/**
 * @param {Array|string} list
 * @returns {any} random item from the list
 */
export function pick(list) {
	return shuffle(Array.from(list))[0]
}

/**
 * A queue is a list of objects that are inserted and removed first-in-first-out (FIFO).
 */
export default class Queue {
	constructor(items = []) {
		this.list = items
	}
	/** Enqueue and add an item at the end of the queue. */
	enqueue(item) {
		this.list.push(item)
	}
	/** Dequeue and remove an item at the front of the queue. */
	dequeue() {
		return this.list.shift()
	}
}
