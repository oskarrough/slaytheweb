import {storePathOnGraph} from '../game/dungeon.js'

/**
 * Helpers to save and load the entire game state.
 * Uses standard JSON.stringify/parse for serialization.
 */

/**
 * Encodes a game state into a string.
 * Strips redundant data (edges) that can be reconstructed on load.
 * @param {object} state
 * @returns {string}
 */
export function encode(state) {
	// Deep clone to avoid mutating original state
	const cloned = JSON.parse(JSON.stringify(state))

	// Strip edges from dungeon graph (they're reconstructed from paths on load)
	if (cloned.dungeon?.graph) {
		cloned.dungeon.graph.forEach((floor) => {
			floor.forEach((node) => {
				delete node.edges
			})
		})
	}

	return JSON.stringify(cloned)
}

/**
 * Decodes a serialized game state string back into an object.
 * Reconstructs edges from paths if needed.
 * @param {string} state
 * @returns {object}
 */
export function decode(state) {
	const decoded = JSON.parse(state)

	// Reconstruct edges from paths
	if (decoded.dungeon?.graph && decoded.dungeon?.paths) {
		decoded.dungeon.paths.forEach((path) => {
			storePathOnGraph(decoded.dungeon.graph, path)
		})
	}

	return decoded
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
	return decode(state)
}
