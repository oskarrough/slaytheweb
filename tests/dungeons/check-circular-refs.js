import test from 'ava'
import actions from '../../src/game/actions.js'
import {createDefaultDungeon} from '../../src/content/dungeons.js'

test('check for circular references in game state', (t) => {
	let state = actions.createNewState()
	state = actions.setDungeon(state, createDefaultDungeon())
	state = actions.addStarterDeck(state)
	state = actions.drawCards(state)

	console.log('\n=== CIRCULAR REFERENCE CHECK ===\n')

	// try plain JSON.stringify
	try {
		JSON.stringify(state)
		console.log('✓ JSON.stringify works - no circular references detected')
		t.pass()
	} catch (err) {
		console.log('✗ JSON.stringify failed - circular references exist')
		console.log(`  Error: ${err.message}`)
		t.fail('game state has circular references')
	}

	console.log('')
})
