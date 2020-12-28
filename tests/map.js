import test from 'ava'
import {generateGraph} from '../public/game/map.js'

test('graph basics are ok', (t) => {
	const g = generateGraph(1, 2)
	t.is(g.length, 3, 'three because start+end are hardcoded')
	t.true(g[1].length > 2 && g[1].length < 6, 'we have between 2 and 5 encounters')
})
