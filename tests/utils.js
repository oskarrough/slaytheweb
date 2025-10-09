import {random, setToArray} from '../src/utils.js'

import test from 'ava'

test('random works', (t) => {
	let x = random(1,3)
	t.true(x > 0 && x < 4)

	// x = random(4,3)
	// t.true(x > 0 && x < 4)
})

test('setToArray converts Set to array', (t) => {
	const set = new Set([1, 2, 3])
	const result = setToArray(set)
	t.deepEqual(result, [1, 2, 3])
})

test('setToArray leaves arrays unchanged', (t) => {
	const arr = [1, 2, 3]
	const result = setToArray(arr)
	t.deepEqual(result, [1, 2, 3])
})

test('setToArray converts empty object to empty array', (t) => {
	const obj = {}
	const result = setToArray(obj)
	t.deepEqual(result, [])
})

test('setToArray leaves non-empty objects unchanged', (t) => {
	const obj = {foo: 'bar'}
	const result = setToArray(obj)
	t.deepEqual(result, {foo: 'bar'})
})

test('setToArray leaves primitives unchanged', (t) => {
	t.is(setToArray(null), null)
	t.is(setToArray(undefined), undefined)
	t.is(setToArray(42), 42)
	t.is(setToArray('hello'), 'hello')
})
