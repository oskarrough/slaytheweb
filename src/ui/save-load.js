import superjson from 'superjson'
import {setToArray} from '../utils.js'

/**
 * Helpers to save and load the entire game state.
 * We use `superjson` insetad of JSON.stringify/parse,
 * because the state contains Set()s and Map()s.
 */

/**
 * Encodes a game state into a string.
 * @param {object} state
 * @returns {string}
 */
export function encode(state) {
	return superjson.stringify(state)
}

/**
 * Decodes a serialized game state string back into an object.
 * @param {string} state
 * @returns {object}
 */
export function decode(state) {
	return superjson.parse(state)
}

/**
 * Encodes a game state and stores it in the URL as a hash parameter.
 * @param {object} state
 */
export function saveToUrl(state) {
	try {
		location.hash = encodeURIComponent(encode(state))
	} catch (err) {
		console.log(err)
	}
}

/**
 * Reads a game state from the URL and decodes it.
 * @returns {object}
 */
export function loadFromUrl() {
	const state = decodeURIComponent(window.location.hash.split('#')[1])
	const decoded = decode(state)

	// Migrate old Set edges to arrays
	if (decoded.dungeon?.graph) {
		decoded.dungeon.graph.forEach(floor => {
			floor.forEach(node => {
				if (node.edges) node.edges = setToArray(node.edges)
			})
		})
	}

	return decoded
}
