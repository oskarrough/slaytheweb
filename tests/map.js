import test from 'ava'
import {generateGraph} from '../public/game/map.js'

test('graph has correct size', (t) => {
	const g = generateGraph(1, 5)
	t.is(g.length, 1)
	t.is(g[0].length, 5)
})
