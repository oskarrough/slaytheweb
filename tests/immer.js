import test from 'ava'
import produce from '../public/web_modules/immer.js'

const changeCount = produce(draft => {
	draft.count = 2
})

test('normal produce', t => {
	const state = {count: 1}
	const next = produce(state, draft => {
		draft.count = 2
	})
	t.is(state.count, 1)
	t.is(next.count, 2)
})

test('curried produce', t => {
	const state = {count: 1}
	const next = changeCount(state)
	t.is(state.count, 1)
	t.is(next.count, 2)
})

test('nested produce?', t => {
	const state = {count: 1}
	const addToCount = produce((draft) => {
		draft.count++
	})
	const next = produce(state, draft => {
		// draft.count++
		draft.count = addToCount(state).count
	})
	t.is(state.count, 1)
	t.is(next.count, 2)
})

