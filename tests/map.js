import test from 'ava'
import {generateGraph} from '../public/game/map.js'

test('graph basics are ok', (t) => {
	const g = generateGraph(2, 6)
	t.is(g.length, 4, 'rows match (incl. start+end)')
	t.is(g[1].length, 6, 'columns match')
})
