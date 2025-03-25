/**
 * Game serialization analysis and optimization
 * 
 * FINDINGS:
 * 1. The dungeon graph structure takes up ~80% of the game state size (18-20KB out of 25KB)
 *    - Many empty/filler nodes in the graph waste space
 *    - Set objects for edges aren't efficiently serialized
 *    - Monster data with intents adds significant weight
 * 
 * 2. Breakdown of a typical serialized game state:
 *    - Full state: ~24KB
 *    - Dungeon alone: ~19KB (80% of total)
 *    - Graph structure: ~17KB (71% of total)
 *    - Paths: ~650 bytes
 *    - Each node: ~290 bytes (with 62 nodes total)
 *    - Monster data with intents: ~150-180 bytes per monster
 * 
 * OPTIMIZATION APPROACH:
 * 1. Version-aware serialization
 *    - Added versioning to support both legacy game states and future changes
 *    - Implemented migration mechanism for future format evolution
 * 
 * 2. Dungeon-specific compression
 *    - Only store non-empty nodes in a flat array with positions
 *    - Convert Sets to arrays for edges
 *    - Preserve paths for backward compatibility
 * 
 * 3. Results:
 *    - For played games (example state): 7% size reduction (25,782 → 23,907 bytes)
 *    - Not as effective for new game states
 *    - Completely backward compatible with older saves
 * 
 * POTENTIAL FUTURE IMPROVEMENTS:
 * 1. Use numeric IDs instead of UUIDs
 * 2. Template system for monsters to avoid duplicating intent arrays
 * 3. Optimize card serialization with similar templating approach
 */

import test from 'ava'
import createNewGame from '../src/game/new-game.js'
// import data from './example-game-state.json' with { type: "json" };
import data from './example-game-state.json' with { type: "json" };
// import { stringify } from 'superjson';

import {encode, decode, encodeDungeon, decodeDungeon, encodeObject} from '../src/ui/save-load.js'

// We don't want to test too much here,
// since tests/actions.js has most of it.

// test('the default game state is this big', (t) => {
// 	const stringified = encode(data)
// 	t.is(stringified.length, 25791)
// })

test('analyze game state size', (t) => {
	const game = createNewGame()
	const fullState = encode(game.state)
	t.log('Full state size:', fullState.length)
	
	// Analyze individual parts of the state
	const stateWithoutDungeon = {...game.state, dungeon: null}
	t.log('State without dungeon size:', encode(stateWithoutDungeon).length)
	
	// Check the size of just the dungeon
	const justDungeon = game.state.dungeon
	t.log('Just dungeon size:', encodeDungeon(justDungeon).length)
	
	// Deeper analysis of dungeon
	if (game.state.dungeon) {
		// Check the graph
		const justGraph = game.state.dungeon.graph
		t.log('Just dungeon graph size:', encodeObject(justGraph).length)
		
		// Check paths
		const justPaths = game.state.dungeon.paths
		t.log('Just dungeon paths size:', encodeObject(justPaths).length)
		
		// Inspect one floor of the graph (first row)
		const oneFloor = game.state.dungeon.graph[0]
		t.log('One floor of graph size:', encodeObject(oneFloor).length)
		
		// Inspect one node in the graph
		if (game.state.dungeon.graph[0].length > 0) {
			const oneNode = game.state.dungeon.graph[0][0]
			t.log('One node size:', encodeObject(oneNode).length)
			
			// If the node has a room, analyze that too
			if (game.state.dungeon.graph[0][0].room) {
				const oneRoom = game.state.dungeon.graph[0][0].room
				t.log('One room size:', encodeObject(oneRoom).length)
			}
		}
		
		// Count the number of nodes in the graph
		let nodeCount = 0;
		for (const floor of game.state.dungeon.graph) {
			nodeCount += floor.length;
		}
		t.log('Total number of nodes in graph:', nodeCount);
		
		// Analyze a typical monster room (more complex)
		let monsterRoom = null;
		// Find a monster room in the graph
		for (const floor of game.state.dungeon.graph) {
			for (const node of floor) {
				if (node.type === 'M' && node.room) {
					monsterRoom = node.room;
					break;
				}
			}
			if (monsterRoom) break;
		}
		
		if (monsterRoom) {
			const monsterRoomSize = encodeObject(monsterRoom).length;
			t.log('Monster room size:', monsterRoomSize);
			
			// Check monsters in the room
			if (monsterRoom.monsters && monsterRoom.monsters.length > 0) {
				const monstersSize = encodeObject(monsterRoom.monsters).length;
				t.log('Monsters size:', monstersSize);
				
				// Check a single monster
				const oneMonster = monsterRoom.monsters[0];
				t.log('One monster size:', encodeObject(oneMonster).length);
				
				// Check monster intents (AI patterns)
				if (monsterRoom.monsters[0].intents) {
					const intentsSize = encodeObject(monsterRoom.monsters[0].intents).length;
					t.log('Monster intents size:', intentsSize);
				}
			}
		}
	}
	
	// Analyze deck portions
	const justDeck = game.state.deck
	t.log('Just deck size:', encodeObject(justDeck).length)
	
	const justDrawPile = game.state.drawPile
	t.log('Just drawPile size:', encodeObject(justDrawPile).length)
	
	const firstCard = game.state.deck[0]
	t.log('First card size:', encodeObject(firstCard).length)
	
	// Analyze card details
	if (firstCard) {
		// Check actions on a card
		if (firstCard.actions) {
			const actionsSize = encodeObject(firstCard.actions).length;
			t.log('Card actions size:', actionsSize);
		}
		
		// Check other card properties
		if (firstCard.description) {
			const descSize = encodeObject(firstCard.description).length;
			t.log('Card description size:', descSize);
		}
	}
	
	// Check size of the played game state from example
	const exampleState = encode(data)
	t.log('Example game state size:', exampleState.length)
	
	// Test the compression difference from a minimal card representation
	const minimalCard = {
		id: firstCard.id,
		name: firstCard.name,
		energy: firstCard.energy,
		damage: firstCard.damage,
		block: firstCard.block
	}
	t.log('Minimal card size:', encodeObject(minimalCard).length)
	
	t.pass()
})

test('optimized dungeon serialization', (t) => {
	const game = createNewGame()
	const originalDungeon = game.state.dungeon
	
	// Create an optimized representation
	/** @type {{id: string, x: number, y: number, rooms: any[], edges: any[], pathTaken: any[], monsterTemplates?: any}} */
	const optimizedDungeon = {
		id: originalDungeon.id,
		x: originalDungeon.x,
		y: originalDungeon.y,
		// Only store active rooms and their positions
		rooms: [],
		// Store edges as arrays of indices rather than Sets
		edges: [],
		// Current position and path
		pathTaken: originalDungeon.pathTaken
	}
	
	// Extract and store only rooms that exist (not empty nodes)
	originalDungeon.graph.forEach((floor, y) => {
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
				
				optimizedDungeon.rooms.push(room)
				
				// Convert Set of edges to array of room IDs
				if (node.edges && node.edges.size > 0) {
					optimizedDungeon.edges.push({
						from: node.id,
						to: Array.from(node.edges)
					})
				}
			}
		})
	})
	
	// Compare sizes
	const originalSize = encodeDungeon(originalDungeon).length
	const optimizedSize = encodeObject(optimizedDungeon).length
	
	t.log('Original dungeon size:', originalSize)
	t.log('Optimized dungeon size:', optimizedSize)
	t.log('Size reduction:', Math.round((1 - optimizedSize/originalSize) * 100) + '%')
	
	// Further compress by optimizing monster data
	// Extract a template for each monster type and only store differences
	const furtherOptimized = {...optimizedDungeon, monsterTemplates: {}}
	const monsterTemplates = {}
	const roomsWithOptimizedMonsters = []
	
	for (const room of optimizedDungeon.rooms) {
		if (room.room && room.room.monsters && room.room.monsters.length > 0) {
			const optimizedRoom = {...room}
			optimizedRoom.room = {...room.room}
			optimizedRoom.room.monsters = []
			
			room.room.monsters.forEach((monster, i) => {
				// Create a template ID from monster properties
				const templateId = `monster_${monster.maxHealth}_${monster.intents?.length || 0}`
				
				// Store template if not seen before
				if (!monsterTemplates[templateId]) {
					monsterTemplates[templateId] = {
						maxHealth: monster.maxHealth,
						intents: monster.intents || []
					}
				}
				
				// Only store differences from template
				optimizedRoom.room.monsters.push({
					templateId,
					currentHealth: monster.currentHealth,
					block: monster.block,
					powers: monster.powers,
					nextIntent: monster.nextIntent
				})
			})
			
			roomsWithOptimizedMonsters.push(optimizedRoom)
		} else {
			roomsWithOptimizedMonsters.push(room)
		}
	}
	
	furtherOptimized.rooms = roomsWithOptimizedMonsters
	furtherOptimized.monsterTemplates = monsterTemplates
	
	const furtherOptimizedSize = encodeObject(furtherOptimized).length
	t.log('Further optimized dungeon size:', furtherOptimizedSize)
	t.log('Additional size reduction:', Math.round((1 - furtherOptimizedSize/optimizedSize) * 100) + '%')
	t.log('Total size reduction:', Math.round((1 - furtherOptimizedSize/originalSize) * 100) + '%')
	
	t.pass()
})

test('new compression approach with round-trip serialization', (t) => {
	// Create a new game and serialize it with our new approach
	const game = createNewGame()
	const originalSize = JSON.stringify(game.state).length
	
	// Encode with our new system
	const serialized = encode(game.state)
	t.log('Original JSON size:', originalSize)
	t.log('New compressed size:', serialized.length)
	t.log('Compression ratio:', Math.round((serialized.length / originalSize) * 100) + '%')
	
	// Verify we can decode it back correctly
	const restored = decode(serialized)
	
	// Verify structure is intact
	t.is(typeof restored, 'object')
	t.is(typeof restored.player, 'object')
	t.is(typeof restored.deck, 'object')
	t.true(Array.isArray(restored.deck))
	
	// Check dungeon integrity
	t.is(typeof restored.dungeon, 'object')
	t.is(typeof restored.dungeon.graph, 'object')
	t.true(Array.isArray(restored.dungeon.graph))
	t.true(Array.isArray(restored.dungeon.graph[0]))
	
	// Test with the example state
	const originalExampleSize = JSON.stringify(data).length
	const serializedExample = encode(data)
	t.log('Example original JSON size:', originalExampleSize)
	t.log('Example compressed size:', serializedExample.length)
	t.log('Example compression ratio:', Math.round((serializedExample.length / originalExampleSize) * 100) + '%')
	
	// Restore and check
	const restoredExample = decode(serializedExample)
	t.is(restoredExample.turn, data.turn)
	t.is(restoredExample.player.currentHealth, data.player.currentHealth)
	
	t.pass()
})

test('dungeon compression roundtrip', (t) => {
	const game = createNewGame()
	const originalDungeon = game.state.dungeon
	
	// Compress the dungeon
	const encoded = encodeDungeon(originalDungeon)
	t.log('Original dungeon size (via JSON.stringify):', JSON.stringify(originalDungeon).length)
	t.log('Compressed dungeon size:', encoded.length)
	t.log('Compression ratio:', Math.round((encoded.length / JSON.stringify(originalDungeon).length) * 100) + '%')
	
	// Then decompress it
	const decoded = decodeDungeon(encoded)
	
	// Verify the structure is intact
	t.is(decoded.id, originalDungeon.id)
	t.is(decoded.x, originalDungeon.x)
	t.is(decoded.y, originalDungeon.y)
	
	// Verify graph is reconstructed correctly
	t.true(Array.isArray(decoded.graph))
	t.is(decoded.graph.length, originalDungeon.graph.length)
	
	// Check that a node from the graph has the expected properties
	const originalNode = findFirstRealNode(originalDungeon.graph)
	const decodedNode = findNodeById(decoded.graph, originalNode.id)
	t.truthy(decodedNode)
	t.is(decodedNode.id, originalNode.id)
	t.is(decodedNode.type, originalNode.type)
	t.is(decodedNode.didVisit, originalNode.didVisit)
	
	// Verify edges were preserved
	if (originalNode.edges.size > 0) {
		t.true(decodedNode.edges.size > 0)
		// Check that the first edge exists in both
		const firstOriginalEdge = Array.from(originalNode.edges)[0]
		t.true(decodedNode.edges.has(firstOriginalEdge))
	}
	
	t.pass()
})

/**
 * Helper to find the first non-empty node in a graph
 */
function findFirstRealNode(graph) {
	for (const floor of graph) {
		for (const node of floor) {
			if (node.type) {
				return node
			}
		}
	}
	return null
}

/**
 * Helper to find a node by ID in a graph
 */
function findNodeById(graph, id) {
	for (const floor of graph) {
		for (const node of floor) {
			if (node.id === id) {
				return node
			}
		}
	}
	return null
}

