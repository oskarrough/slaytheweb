import superjson from 'superjson'
import {getAllIntentTemplates, registerIntentTemplate} from '../content/intent-templates.js'

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
	// Create a deep clone to avoid modifying the original state
	const stateToEncode = superjson.parse(superjson.stringify(state))
	
	// Optimize monster intents to reduce serialized size
	if (stateToEncode.dungeon) {
		const intentTemplates = {}
		let intentIdCounter = 0
		
		// Walk through the dungeon graph and replace monster intents with references
		for (const floor of stateToEncode.dungeon.graph) {
			for (const node of floor) {
				if (node.room?.monsters?.length) {
					for (const monster of node.room.monsters) {
						if (monster.intents && monster.intents.length) {
							// Create a signature for this intent array
							const signature = JSON.stringify(monster.intents)
							
							// Check if we've seen this intent pattern before
							let intentId = Object.keys(intentTemplates).find(
								id => JSON.stringify(intentTemplates[id]) === signature
							)
							
							// If not, add it to our templates
							if (!intentId) {
								intentId = `intent_${intentIdCounter++}`
								intentTemplates[intentId] = monster.intents
							}
							
							// Replace the intents with a reference
							monster._intentRef = intentId
							delete monster.intents
						}
					}
				}
			}
		}
		
		// Only add intent templates if we found any
		if (Object.keys(intentTemplates).length > 0) {
			stateToEncode._intentTemplates = intentTemplates
		}
	}
	
	return superjson.stringify(stateToEncode)
}

/**
 * Decodes a serialized game state string back into an object.
 * @param {string} state
 * @returns {object}
 */
export function decode(state) {
	const decoded = superjson.parse(state)
	
	// Restore monster intents from templates if they exist
	if (decoded._intentTemplates && decoded.dungeon) {
		const templates = decoded._intentTemplates
		
		// Walk through the dungeon graph and restore monster intents from references
		for (const floor of decoded.dungeon.graph) {
			for (const node of floor) {
				if (node.room?.monsters?.length) {
					for (const monster of node.room.monsters) {
						if (monster._intentRef) {
							// Restore intents from template
							monster.intents = templates[monster._intentRef]
							delete monster._intentRef
						}
					}
				}
			}
		}
		
		// Remove the templates from the state
		delete decoded._intentTemplates
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
