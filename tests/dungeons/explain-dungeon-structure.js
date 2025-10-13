import test from 'ava'
import {createDefaultDungeon} from '../../src/content/dungeons.js'
import {encode} from '../../src/ui/save-load.js'

test('explain dungeon concepts with actual data', (t) => {
	const dungeon = createDefaultDungeon()

	console.log('\n=== DUNGEON STRUCTURE EXPLAINED ===\n')

	console.log('DUNGEON top-level properties:')
	console.log(Object.keys(dungeon))
	console.log('')

	console.log('GRAPH: 2d array of nodes (floors with nodes)')
	console.log(`  ${dungeon.graph.length} floors`)
	console.log(`  floor 0 has ${dungeon.graph[0].length} nodes (start)`)
	console.log(`  floor 1 has ${dungeon.graph[1].length} nodes`)
	console.log(`  floor 11 has ${dungeon.graph[11].length} nodes (boss)`)
	console.log('')

	console.log('NODE: a point on the map')
	const sampleNode = dungeon.graph[1][0]
	console.log('  sample node from floor 1, index 0:')
	console.log(`    id: "${sampleNode.id}"`)
	console.log(`    type: "${sampleNode.type}"`)
	console.log(`    edges: [${sampleNode.edges.map(id => `"${id.substring(0, 8)}..."`).join(', ')}]`)
	console.log(`    didVisit: ${sampleNode.didVisit}`)
	console.log(`    room: ${sampleNode.room ? sampleNode.room.type : 'undefined'}`)
	console.log('')

	console.log('EDGES: which nodes connect to which (stored as array of target node IDs)')
	console.log(`  node "${sampleNode.id.substring(0, 8)}..." connects to ${sampleNode.edges.length} other nodes`)
	console.log(`  edge IDs: [${sampleNode.edges.map(id => `"${id.substring(0, 8)}..."`).join(', ')}]`)
	console.log('')

	console.log('PATHS: possible routes through dungeon from start to boss')
	console.log(`  ${dungeon.paths.length} paths`)
	console.log('  each path is array of moves')
	console.log('  each move is [[fromY, fromX], [toY, toX]]')
	console.log('  path 0 first 3 moves:')
	dungeon.paths[0].slice(0, 3).forEach((move, i) => {
		console.log(`    move ${i}: from [${move[0]}] to [${move[1]}]`)
	})
	console.log('')

	console.log('RELATIONSHIP:')
	console.log('  - paths describe routes through the graph')
	console.log('  - edges are computed FROM paths and stored ON nodes')
	console.log('  - so: paths → edges (edges are derived)')
	console.log('')

	// now analyze redundancy
	const withoutEdges = JSON.parse(JSON.stringify(dungeon))
	withoutEdges.graph.forEach(floor => {
		floor.forEach(node => {
			delete node.edges
		})
	})

	const sizeOriginal = new Blob([encode(dungeon)]).size
	const sizeWithoutEdges = new Blob([encode(withoutEdges)]).size
	const savings = sizeOriginal - sizeWithoutEdges

	console.log('REDUNDANCY TEST:')
	console.log(`  original: ${(sizeOriginal / 1024).toFixed(2)} KB`)
	console.log(`  without edges: ${(sizeWithoutEdges / 1024).toFixed(2)} KB`)
	console.log(`  savings: ${(savings / 1024).toFixed(2)} KB (${((savings / sizeOriginal) * 100).toFixed(1)}%)`)
	console.log('')

	// test if we can reconstruct edges from paths
	console.log('CAN WE RECONSTRUCT?')
	console.log('  edges can be reconstructed by walking paths and setting node.edges')
	console.log('  see dungeon.js:290 storePathOnGraph()')
	console.log('')

	// test removing empty nodes
	const withoutEmpty = JSON.parse(JSON.stringify(dungeon))
	let emptyCount = 0
	withoutEmpty.graph = withoutEmpty.graph.map(floor => {
		return floor.filter(node => {
			if (!node.type) {
				emptyCount++
				return false
			}
			return true
		})
	})

	const sizeWithoutEmpty = new Blob([encode(withoutEmpty)]).size
	const savingsEmpty = sizeOriginal - sizeWithoutEmpty

	console.log('EMPTY NODES TEST:')
	console.log(`  empty nodes found: ${emptyCount}`)
	console.log(`  original: ${(sizeOriginal / 1024).toFixed(2)} KB`)
	console.log(`  without empty nodes: ${(sizeWithoutEmpty / 1024).toFixed(2)} KB`)
	console.log(`  savings: ${(savingsEmpty / 1024).toFixed(2)} KB (${((savingsEmpty / sizeOriginal) * 100).toFixed(1)}%)`)
	console.log('  BUT: this breaks paths since they reference [y,x] coordinates')
	console.log('  need to either:')
	console.log('    a) store paths as node IDs instead of coordinates, or')
	console.log('    b) keep empty nodes but minimize their data')
	console.log('')

	// test both optimizations together
	const minimal = JSON.parse(JSON.stringify(dungeon))
	minimal.graph.forEach(floor => {
		floor.forEach(node => {
			delete node.edges
		})
	})
	const sizeMinimal = new Blob([encode(minimal)]).size
	const savingsTotal = sizeOriginal - sizeMinimal

	console.log('COMBINED (just remove edges):')
	console.log(`  original: ${(sizeOriginal / 1024).toFixed(2)} KB`)
	console.log(`  without edges: ${(sizeMinimal / 1024).toFixed(2)} KB`)
	console.log(`  total savings: ${(savingsTotal / 1024).toFixed(2)} KB (${((savingsTotal / sizeOriginal) * 100).toFixed(1)}%)`)
	console.log('')

	t.pass()
})
