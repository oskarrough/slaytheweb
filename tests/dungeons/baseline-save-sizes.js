import test from 'ava'
import actions from '../../src/game/actions.js'
import {encode} from '../../src/ui/save-load.js'
import {createDefaultDungeon, createTestDungeon} from '../../src/content/dungeons.js'

/**
 * Baseline measurements for save sizes.
 * Run this before optimizations to establish baseline,
 * then run after to verify improvements.
 */

test('BASELINE: save sizes before optimization', (t) => {
	console.log('\n=== BASELINE SAVE SIZES (before optimization) ===\n')

	const results = []

	// 1. empty state
	let state = actions.createNewState()
	results.push({
		name: 'empty state',
		size: new Blob([encode(state)]).size,
	})

	// 2. with starter deck
	state = actions.createNewState()
	state = actions.addStarterDeck(state)
	results.push({
		name: 'with starter deck',
		size: new Blob([encode(state)]).size,
	})

	// 3. with test dungeon (small)
	state = actions.createNewState()
	state = actions.setDungeon(state, createTestDungeon())
	state = actions.addStarterDeck(state)
	results.push({
		name: 'with test dungeon',
		size: new Blob([encode(state)]).size,
	})

	// 4. with default dungeon (realistic game state)
	state = actions.createNewState()
	state = actions.setDungeon(state, createDefaultDungeon())
	state = actions.addStarterDeck(state)
	state = actions.drawCards(state)
	results.push({
		name: 'with default dungeon + cards in hand',
		size: new Blob([encode(state)]).size,
	})

	// print results
	results.forEach(r => {
		const kb = (r.size / 1024).toFixed(2)
		console.log(`${r.name.padEnd(40)} ${kb.padStart(8)} KB (${r.size} bytes)`)
	})

	// calculate total for realistic game state
	const realistic = results[3].size
	console.log(`\nRealistic game state: ${(realistic / 1024).toFixed(2)} KB`)
	console.log(`Target after optimization: ~${((realistic * 0.6) / 1024).toFixed(2)} KB (40% reduction)`)
	console.log('')

	// store for comparison
	t.context.baseline = results

	t.pass()
})

test('verify dungeon has edges before optimization', (t) => {
	const dungeon = createDefaultDungeon()

	// check that edges exist
	let totalEdges = 0
	dungeon.graph.forEach(floor => {
		floor.forEach(node => {
			if (node.edges && node.edges.length > 0) {
				totalEdges += node.edges.length
			}
		})
	})

	console.log(`\nDungeon edges verification:`)
	console.log(`  Total edges found: ${totalEdges}`)
	console.log(`  (should be > 0 before optimization)`)
	console.log('')

	t.true(totalEdges > 0, 'dungeon should have edges before optimization')
})

test('verify using plain JSON', (t) => {
	const state = actions.createNewState()
	const encoded = encode(state)

	// plain JSON should not have superjson structure
	const hasSuperjsonStructure = encoded.includes('"json":') && encoded.includes('"meta":')

	console.log(`\nJSON serialization verification:`)
	console.log(`  Using plain JSON: ${!hasSuperjsonStructure}`)
	console.log(`  (should be true after removing superjson)`)
	console.log('')

	t.false(hasSuperjsonStructure, 'should be using plain JSON after optimization')
})
