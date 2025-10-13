import test from 'ava'
import actions from '../../src/game/actions.js'
import {encode} from '../../src/ui/save-load.js'
import {createTestDungeon, createDefaultDungeon} from '../../src/content/dungeons.js'

function analyzeSize(state, label) {
	const encoded = encode(state)
	const bytes = new Blob([encoded]).size
	const kb = (bytes / 1024).toFixed(2)

	return {
		label,
		bytes,
		kb,
		encoded: encoded.substring(0, 100) + '...',
		breakdown: {
			dungeon: state.dungeon ? JSON.stringify(state.dungeon).length : 0,
			deck: JSON.stringify(state.deck).length,
			drawPile: JSON.stringify(state.drawPile).length,
			hand: JSON.stringify(state.hand).length,
			discardPile: JSON.stringify(state.discardPile).length,
		}
	}
}

test('analyze save sizes at different game stages', (t) => {
	const results = []

	// stage 1: empty state
	let state = actions.createNewState()
	results.push(analyzeSize(state, 'empty state'))

	// stage 2: with starter deck
	state = actions.createNewState()
	state = actions.addStarterDeck(state)
	results.push(analyzeSize(state, 'with starter deck'))

	// stage 3: with test dungeon (has monsters with intents)
	state = actions.createNewState()
	state = actions.setDungeon(state, createTestDungeon())
	state = actions.addStarterDeck(state)
	results.push(analyzeSize(state, 'with test dungeon'))

	// stage 4: after drawing cards
	state = actions.createNewState()
	state = actions.setDungeon(state, createTestDungeon())
	state = actions.addStarterDeck(state)
	state = actions.drawCards(state)
	results.push(analyzeSize(state, 'after drawing 5 cards'))

	// stage 5: with default dungeon (full 6x10 grid with random paths)
	state = actions.createNewState()
	state = actions.setDungeon(state, createDefaultDungeon())
	state = actions.addStarterDeck(state)
	results.push(analyzeSize(state, 'with default dungeon'))

	console.log('\n=== SAVE SIZE ANALYSIS ===\n')
	results.forEach((r) => {
		console.log(`${r.label}:`)
		console.log(`  Total: ${r.kb} KB (${r.bytes} bytes)`)
		console.log(`  Breakdown:`)
		console.log(`    dungeon: ${(r.breakdown.dungeon / 1024).toFixed(2)} KB`)
		console.log(`    deck: ${(r.breakdown.deck / 1024).toFixed(2)} KB`)
		console.log(`    drawPile: ${(r.breakdown.drawPile / 1024).toFixed(2)} KB`)
		console.log(`    hand: ${(r.breakdown.hand / 1024).toFixed(2)} KB`)
		console.log(`    discardPile: ${(r.breakdown.discardPile / 1024).toFixed(2)} KB`)
		console.log('')
	})

	t.pass()
})

// superjson removed - now using plain JSON
test.skip('compare superjson vs regular JSON', (t) => {
	let state = actions.createNewState()
	state = actions.setDungeon(state)
	state = actions.addStarterDeck(state)

	const superjsonSize = new Blob([encode(state)]).size
	const regularJsonSize = new Blob([JSON.stringify(state)]).size

	console.log('\n=== SUPERJSON VS JSON ===')
	console.log(`superjson: ${(superjsonSize / 1024).toFixed(2)} KB`)
	console.log(`JSON: ${(regularJsonSize / 1024).toFixed(2)} KB`)
	console.log(`overhead: ${(((superjsonSize - regularJsonSize) / regularJsonSize) * 100).toFixed(1)}%\n`)

	t.true(superjsonSize > regularJsonSize)
})
