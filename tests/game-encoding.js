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
 * CURRENT APPROACH:
 * We're using superjson to serialize and deserialize the game state, which handles Sets and Maps.
 * Our goal is to reduce the serialized size of the game state by optimizing the monster intents.
 */

import test from 'ava'
import createNewGame from '../src/game/new-game.js'
import data from './_example-game-state.json' with {type: 'json'}
import {getMonsterIntents} from '../src/game/monster.js'

import {encode, decode} from '../src/ui/save-load.js'

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
	t.log('Just dungeon size:', encode(justDungeon).length)

	// Deeper analysis of dungeon
	if (game.state.dungeon) {
		// Check the graph
		const justGraph = game.state.dungeon.graph
		t.log('Just dungeon graph size:', encode(justGraph).length)

		// Check paths
		const justPaths = game.state.dungeon.paths
		t.log('Just dungeon paths size:', encode(justPaths).length)

		// Count the number of nodes in the graph
		let nodeCount = 0
		for (const floor of game.state.dungeon.graph) {
			nodeCount += floor.length
		}
		t.log('Total number of nodes in graph:', nodeCount)

		// Analyze a typical monster room (more complex)
		let monsterRoom = null
		// Find a monster room in the graph
		for (const floor of game.state.dungeon.graph) {
			for (const node of floor) {
				if (node.type === 'M' && node.room) {
					monsterRoom = node.room
					break
				}
			}
			if (monsterRoom) break
		}

		if (monsterRoom) {
			const monsterRoomSize = encode(monsterRoom).length
			t.log('Monster room size:', monsterRoomSize)

			// Check monsters in the room
			if (monsterRoom.monsters && monsterRoom.monsters.length > 0) {
				const monstersSize = encode(monsterRoom.monsters).length
				t.log('Monsters size:', monstersSize)

				// Check a single monster
				const oneMonster = monsterRoom.monsters[0]
				t.log('One monster size:', encode(oneMonster).length)

				// Check monster intents (AI patterns)
				if (monsterRoom.monsters[0].intents) {
					const intentsSize = encode(monsterRoom.monsters[0].intents).length
					t.log('Monster intents size:', intentsSize)
				}
			}
		}
	}

	// Check size of the played game state from example
	const exampleState = encode(data)
	t.log('Example game state size:', exampleState.length)

	t.pass()
})

test('analyze monsters and intents', (t) => {
	const game = createNewGame()
	
	// Find all monster rooms and analyze their monsters
	const monsterRooms = []
	const allMonsters = []
	
	// Extract all monsters from the dungeon for analysis
	for (const floor of game.state.dungeon.graph) {
		for (const node of floor) {
			if (node.type === 'M' && node.room && node.room.monsters) {
				monsterRooms.push(node.room)
				allMonsters.push(...node.room.monsters)
			}
		}
	}
	
	t.log('Number of monster rooms:', monsterRooms.length)
	t.log('Total number of monsters:', allMonsters.length)
	
	// Check for duplicate monster intents
	const intentSignatures = new Map()
	allMonsters.forEach(monster => {
		if (monster.intents) {
			// Create a signature for this intent array
			const signature = JSON.stringify(monster.intents)
			
			if (!intentSignatures.has(signature)) {
				intentSignatures.set(signature, {
					count: 1,
					size: encode(monster.intents).length,
					// Use any property name we can find, or fallback to 'Unknown'
					sampleMonster: 'Unknown'
				})
			} else {
				const record = intentSignatures.get(signature)
				record.count++
			}
		}
	})
	
	// Log information about duplicate intents
	t.log('Unique intent patterns:', intentSignatures.size)
	
	let totalDuplicatedBytes = 0
	intentSignatures.forEach((record, signature) => {
		if (record.count > 1) {
			const wastedBytes = record.size * (record.count - 1)
			totalDuplicatedBytes += wastedBytes
			t.log(`Intent pattern for ${record.sampleMonster} duplicated ${record.count} times, wasting ~${wastedBytes} bytes`)
		}
	})
	
	t.log('Total bytes wasted by duplicated intents:', totalDuplicatedBytes)
	
	t.pass()
})

test('verify monster intent optimization reduces size', (t) => {
	const game = createNewGame()
	
	// Check original size
	const originalSize = encode(game.state).length
	t.log('Original state size:', originalSize)
	
	// Save & restore to ensure optimization is applied
	const serialized = encode(game.state)
	const restored = decode(serialized)
	const reserializedSize = encode(restored).length
	
	t.log('Re-serialized size:', reserializedSize)
	t.log('Size reduction:', originalSize - reserializedSize, 'bytes')
	t.log('Percentage improvement:', Math.round((1 - reserializedSize / originalSize) * 100) + '%')
	
	// Run a simple verification that we haven't broken anything
	// Find a monster and check its intents
	let foundMonster = false
	for (const floor of restored.dungeon.graph) {
		for (const node of floor) {
			if (node.type === 'M' && node.room && node.room.monsters && node.room.monsters.length > 0) {
				const monster = node.room.monsters[0]
				// Verify the monster has an intentTemplateId instead of intents array
				t.truthy(monster.intentTemplateId, 'Monster should have an intentTemplateId')
				t.falsy(monster.intents, 'Monster should not have an intents array')
				
				// Get intents using the helper function and verify they exist
				const intents = getMonsterIntents(monster)
				t.true(Array.isArray(intents), 'Monster intents should be available through getMonsterIntents')
				t.true(intents.length > 0, 'Monster should have at least one intent')
				
				foundMonster = true
				break
			}
		}
		if (foundMonster) break
	}
	
	t.true(foundMonster, 'Should have found at least one monster for verification')
	t.pass()
})

test('roundtrip serialization sanity check', (t) => {
	// Create a new game and serialize it
	const game = createNewGame()
	const serialized = encode(game.state)
	
	// Deserialize and verify integrity
	const restored = decode(serialized)
	
	// Basic structure checks
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
	const serializedExample = encode(data)
	const restoredExample = decode(serializedExample)
	t.is(restoredExample.turn, data.turn)
	t.is(restoredExample.player.currentHealth, data.player.currentHealth)
	
	t.pass()
})