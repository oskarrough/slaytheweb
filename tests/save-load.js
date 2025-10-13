import test from 'ava'
import actions from '../src/game/actions.js'
import {encode, decode} from '../src/ui/save-load.js'

test('can save and load a game state', (t) => {
	let state = actions.createNewState()
	state = actions.setDungeon(state)
	state = actions.addStarterDeck(state)
	const x = state
	t.is(typeof x, 'object')
	const encoded = encode(x)
	t.is(typeof encoded, 'string')
	const decoded = decode(encoded)
	t.is(typeof decoded, 'object')
})

test('edges are stripped during encode', (t) => {
	let state = actions.createNewState()
	state = actions.setDungeon(state)

	// Count original edges
	let originalEdgeCount = 0
	state.dungeon.graph.forEach((floor) => {
		floor.forEach((node) => {
			if (node.edges && node.edges.length > 0) {
				originalEdgeCount += node.edges.length
			}
		})
	})

	t.true(originalEdgeCount > 0, 'original state should have edges')

	// Encode and check edges are NOT in the serialized string
	const encoded = encode(state)
	const parsed = JSON.parse(encoded)

	let encodedEdgeCount = 0
	parsed.dungeon.graph.forEach((floor) => {
		floor.forEach((node) => {
			if (node.edges) {
				encodedEdgeCount += node.edges.length
			}
		})
	})

	t.is(encodedEdgeCount, 0, 'encoded state should have no edges')
})

test('edges are reconstructed during decode', (t) => {
	let state = actions.createNewState()
	state = actions.setDungeon(state)

	// Capture original edges structure
	const originalEdges = new Map()
	state.dungeon.graph.forEach((floor, floorIndex) => {
		floor.forEach((node, nodeIndex) => {
			if (node.edges && node.edges.length > 0) {
				originalEdges.set(node.id, [...node.edges].sort())
			}
		})
	})

	t.true(originalEdges.size > 0, 'original state should have edges')

	// Encode and decode
	const encoded = encode(state)
	const decoded = decode(encoded)

	// Verify edges are reconstructed
	let reconstructedEdgeCount = 0
	decoded.dungeon.graph.forEach((floor) => {
		floor.forEach((node) => {
			if (node.edges && node.edges.length > 0) {
				reconstructedEdgeCount++
				// Verify this node's edges match original
				const original = originalEdges.get(node.id)
				const reconstructed = [...node.edges].sort()
				t.deepEqual(reconstructed, original, `edges for node ${node.id} should match original`)
			}
		})
	})

	t.is(reconstructedEdgeCount, originalEdges.size, 'all edges should be reconstructed')
})

test('dungeon navigation works after save/load cycle', (t) => {
	let state = actions.createNewState()
	state = actions.setDungeon(state)

	// Start at beginning (0,0)
	t.is(state.dungeon.y, 0)
	t.is(state.dungeon.x, 0)

	// Find a valid move from starting position
	const startNode = state.dungeon.graph[0][0]
	t.true(startNode.edges.length > 0, 'start node should have edges')

	// Get first floor nodes that are connected
	const firstFloor = state.dungeon.graph[1]
	const targetNode = firstFloor.find((node) => startNode.edges.includes(node.id))
	t.truthy(targetNode, 'should find connected node on first floor')
	const targetX = firstFloor.indexOf(targetNode)

	// Move to that node
	state = actions.move(state, {move: {x: targetX, y: 1}})
	t.is(state.dungeon.y, 1)
	t.is(state.dungeon.x, targetX)

	// Save and load
	const encoded = encode(state)
	const loaded = decode(encoded)

	// Verify position is preserved
	t.is(loaded.dungeon.y, 1)
	t.is(loaded.dungeon.x, targetX)

	// Verify we can continue navigating
	const currentNode = loaded.dungeon.graph[loaded.dungeon.y][loaded.dungeon.x]
	t.true(Array.isArray(currentNode.edges), 'current node should have edges array')
	t.true(currentNode.edges.length > 0, 'current node should have edges to next floor')

	// Find a valid next move
	const nextFloor = loaded.dungeon.graph[2]
	const nextTarget = nextFloor.find((node) => currentNode.edges.includes(node.id))
	t.truthy(nextTarget, 'should be able to find next move after load')
})

// Set() serialization no longer needed - we don't use Set/Map in game state
test.skip('can serialize Set()', (t) => {
	const set = new Set()
	set.add(42)
	const obj = {set}
	const encoded = encode(obj)
	const decoded = decode(encoded)
	t.true(decoded.set.has(42))
})
