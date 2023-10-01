import {random} from '../src/utils.js'

import test from 'ava'

test('random works', (t) => {
	let x = random(1,3)
	t.true(x > 0 && x < 4)

	// x = random(4,3)
	// t.true(x > 0 && x < 4)
})
