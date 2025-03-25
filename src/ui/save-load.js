import superjson from 'superjson'

/**
 * Helpers to save and load the entire game state.
 * We use `superjson` instead of JSON.stringify/parse,
 * because the state contains Set()s and Map()s.
 */

/** @typedef {import('../game/dungeon.js').Dungeon} Dungeon */
/** @typedef {import('../game/dungeon.js').Graph} Graph */
/** @typedef {import('../game/dungeon.js').MapNode} MapNode */
/** @typedef {import('../game/actions.js').State} GameState */

// Current version of the game state format
const CURRENT_VERSION = 1

/**
 * Extended game state with version information
 * @typedef {GameState & {_version?: number}} VersionedGameState
 */

/**
 * Compresses a dungeon structure for more efficient serialization
 * @param {Dungeon} dungeon - The dungeon to compress
 * @returns {object} A compressed representation of the dungeon
 */
function compressDungeon(dungeon) {
	// Create a compressed representation
	const compressed = {
		id: dungeon.id,
		x: dungeon.x,
		y: dungeon.y,
		// Only store active rooms and their positions
		rooms: [],
		// Store edges as arrays of indices rather than Sets
		edges: [],
		// Current position and path
		pathTaken: dungeon.pathTaken
	}
	
	// Extract and store only rooms that exist (not empty nodes)
	dungeon.graph.forEach((floor, y) => {
		floor.forEach((node, x) => {
			if (node.type) {
				// Store minimal information about each room
				const room = {
					id: node.id,
					pos: [y, x],
					type: node.type,
					didVisit: node.didVisit
				}
				
				// Only include room data if it has a room
				if (node.room) {
					room.room = node.room
				}
				
				compressed.rooms.push(room)
				
				// Convert Set of edges to array of room IDs
				if (node.edges && node.edges.size > 0) {
					compressed.edges.push({
						from: node.id,
						to: Array.from(node.edges)
					})
				}
			}
		})
	})
	
	// Also preserve the paths for backwards compatibility
	compressed.paths = dungeon.paths
	
	return compressed
}

/**
 * Expands a compressed dungeon back to its full structure
 * @param {object} compressed - The compressed dungeon
 * @returns {Dungeon} The expanded dungeon
 */
function expandDungeon(compressed) {
	// If it's already an uncompressed dungeon (has graph property), return as is
	if (compressed.graph) {
		return compressed
	}
	
	// Reconstruct the graph from the compressed format
	/** @type {Graph} */
	const graph = []
	let maxY = 0
	let maxX = 0
	
	// First find the dimensions needed
	compressed.rooms.forEach(room => {
		const [y, x] = room.pos
		maxY = Math.max(maxY, y)
		maxX = Math.max(maxX, x)
	})
	
	// Initialize the graph with empty nodes
	for (let y = 0; y <= maxY; y++) {
		const floor = []
		for (let x = 0; x <= maxX; x++) {
			// Create a basic empty node with required properties
			floor.push({
				id: `empty_${y}_${x}`,
				type: '',  // Empty string for no type
				edges: new Set(),
				didVisit: false
			})
		}
		graph.push(floor)
	}
	
	// Place the rooms in the graph
	compressed.rooms.forEach(room => {
		const [y, x] = room.pos
		graph[y][x] = {
			id: room.id,
			type: room.type,
			room: room.room,
			edges: new Set(),
			didVisit: room.didVisit
		}
	})
	
	// Reconstruct the edges
	compressed.edges.forEach(edge => {
		// Find the node with this ID
		let fromNode = null
		findNode: for (let y = 0; y < graph.length; y++) {
			for (let x = 0; x < graph[y].length; x++) {
				if (graph[y][x].id === edge.from) {
					fromNode = graph[y][x]
					break findNode
				}
			}
		}
		
		if (fromNode) {
			// Add all edges
			edge.to.forEach(toId => {
				fromNode.edges.add(toId)
			})
		}
	})
	
	return {
		id: compressed.id,
		graph,
		paths: compressed.paths,
		x: compressed.x,
		y: compressed.y,
		pathTaken: compressed.pathTaken
	}
}

/**
 * Migrates a game state from one version to another
 * @param {VersionedGameState} state - Game state to migrate
 * @param {number} fromVersion - Current version
 * @param {number} toVersion - Target version
 * @returns {VersionedGameState} The migrated state
 */
function migrateState(state, fromVersion, toVersion) {
	// If coming from version 0 (no version), add version property
	if (fromVersion === 0) {
		state._version = toVersion
		return state
	}
	
	// Add more migration logic here when you introduce breaking changes
	// For example:
	// if (fromVersion === 1 && toVersion >= 2) {
	//    // Convert version 1 format to version 2
	// }
	
	return state
}

/**
 * Encodes just a dungeon structure into a string using compression
 * @param {Dungeon} dungeon 
 * @returns {string}
 */
export function encodeDungeon(dungeon) {
	const compressed = compressDungeon(dungeon)
	return superjson.stringify(compressed)
}

/**
 * Decodes a dungeon from an encoded string
 * @param {string} encodedDungeon 
 * @returns {Dungeon}
 */
export function decodeDungeon(encodedDungeon) {
	const compressed = superjson.parse(encodedDungeon)
	return expandDungeon(compressed)
}

/**
 * Encodes any object using superjson for testing/analysis
 * @param {any} object 
 * @returns {string}
 */
export function encodeObject(object) {
	return superjson.stringify(object)
}

/**
 * Decodes any object from a superjson string for testing/analysis
 * @param {string} encodedObject 
 * @returns {any}
 */
export function decodeObject(encodedObject) {
	return superjson.parse(encodedObject)
}

/**
 * Encodes a game state into a string.
 * @param {GameState} state
 * @returns {string}
 */
export function encode(state) {
	// Make a copy so we don't modify the original
	/** @type {VersionedGameState} */
	const stateCopy = {...state}
	
	// Add version information
	stateCopy._version = CURRENT_VERSION
	
	// Compress the dungeon if it exists
	if (stateCopy.dungeon) {
		stateCopy.dungeon = compressDungeon(stateCopy.dungeon)
	}
	
	return superjson.stringify(stateCopy)
}

/**
 * Decodes a serialized game state string back into an object.
 * @param {string} state
 * @returns {GameState}
 */
export function decode(state) {
	// Parse the state
	/** @type {VersionedGameState} */
	const parsed = superjson.parse(state)
	
	// Check version and migrate if necessary
	const version = parsed._version || 0
	if (version !== CURRENT_VERSION) {
		migrateState(parsed, version, CURRENT_VERSION)
	}
	
	// If the state has a dungeon, expand it
	if (parsed.dungeon) {
		parsed.dungeon = expandDungeon(parsed.dungeon)
	}
	
	return parsed
}

/**
 * Encodes a game state and stores it in the URL as a hash parameter.
 * @param {GameState} state
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
 * @returns {GameState}
 */
export function loadFromUrl() {
	const state = decodeURIComponent(window.location.hash.split('#')[1])
	return decode(state)
}
