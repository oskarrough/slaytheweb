import test from 'ava'
import Queue from '../public/game/queue.js'

test('can add and run through queue', t => {
	const q = new Queue()
	t.is(q.list.length, 0)
	q.add('a')
	t.is(q.list.length, 1)
	q.add('b')
	q.add('c')
	t.is(q.list.length, 3)
	const first = q.next()
	t.is(q.list.length, 2)
	const second = q.next()
	const third = q.next()
	t.is(q.list.length, 0)
	t.is(first, 'a')
	t.is(second, 'b')
	t.is(third, 'c')
})

// test('queue maintains a history of dequeued items', t => {
// 	const q = new Queue()
// 	q.add('a')
// 	q.add('b')
// 	t.is(q.list.length, 2)
// 	t.is(q.past.length, 0)
// 	t.is(q.next(), 'a')
// 	t.is(q.next(), 'b')
// 	t.is(q.list.length, 0)
// 	t.is(q.past.length, 2)
// 	t.is(q.past[0], 'a')
// 	t.is(q.past[1], 'b')
// })

// https://immerjs.github.io/immer/docs/patches
// https://medium.com/@mweststrate/distributing-state-changes-using-snapshots-patches-and-actions-part-2-2f50d8363988
// const changes = []
// const inverseChanges = []

// const handleUndo = (patches, inversePatches) => {
// 	changes.push(...patches)
// 	inverseChanges.push(...inversePatches)
// }

// const handleUndo = (patch, inversePatches) => {
// 	this.undo.push(inversePatches)
// }

// state = applyPatches(state, changes)
// state = applyPatches(state, inverseChanges)

// handleUndo = () => {
// 	const undo = this.undo.pop()
// 	if (!undo) return
// 	this.setState(applyPatches(this.state, undo))
// }

