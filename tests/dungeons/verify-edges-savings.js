import test from 'ava'
import {createDefaultDungeon} from '../../src/content/dungeons.js'

test('verify actual edges data', (t) => {
	const dungeon = createDefaultDungeon()

	let totalEdges = 0
	let nodesWithEdges = 0
	let maxEdgesOnNode = 0
	let edgesPerNode = []

	console.log('\n=== EDGES ANALYSIS ===\n')

	dungeon.graph.forEach((floor, y) => {
		floor.forEach((node, x) => {
			if (node.edges && node.edges.length > 0) {
				nodesWithEdges++
				totalEdges += node.edges.length
				edgesPerNode.push(node.edges.length)
				if (node.edges.length > maxEdgesOnNode) {
					maxEdgesOnNode = node.edges.length
				}
			}
		})
	})

	const avgEdges = (totalEdges / nodesWithEdges).toFixed(2)

	console.log(`Total nodes with edges: ${nodesWithEdges}`)
	console.log(`Total edge references: ${totalEdges}`)
	console.log(`Average edges per node: ${avgEdges}`)
	console.log(`Max edges on single node: ${maxEdgesOnNode}`)
	console.log('')

	// measure actual size
	const withEdges = JSON.stringify(dungeon)
	const withoutEdges = JSON.stringify(dungeon, (key, value) => {
		if (key === 'edges') return undefined
		return value
	})

	const sizeWith = new Blob([withEdges]).size
	const sizeWithout = new Blob([withoutEdges]).size
	const savings = sizeWith - sizeWithout
	const percent = ((savings / sizeWith) * 100).toFixed(1)

	console.log('Size comparison (using JSON.stringify):')
	console.log(`  With edges: ${(sizeWith / 1024).toFixed(2)} KB`)
	console.log(`  Without edges: ${(sizeWithout / 1024).toFixed(2)} KB`)
	console.log(`  Savings: ${(savings / 1024).toFixed(2)} KB (${percent}%)`)
	console.log('')

	// sample an edge array
	const sampleNode = dungeon.graph.flat().find(n => n.edges && n.edges.length > 0)
	console.log('Sample node.edges:')
	console.log(`  ${JSON.stringify(sampleNode.edges)}`)
	console.log(`  Size: ${new Blob([JSON.stringify(sampleNode.edges)]).size} bytes`)
	console.log('')

	t.pass()
})
