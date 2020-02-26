import test from 'ava'
import Queue from '../public/game/queue.js'

test('can add and run through queue', t => {
	const q = new Queue()
	t.is(q.list.length, 0)
	q.addToTop('a')
	t.is(q.list.length, 1)
	q.addToTop('b')
	q.addToTop('c')
	q.addToTop('d')
	t.is(q.list.length, 4)
	const first = q.takeFromBottom()
	t.is(q.list.length, 3)
	const second = q.takeFromTop()
	const third = q.takeFromBottom()
	t.is(q.list.length, 1)
	t.is(first, 'a')
	t.is(second, 'd')
	t.is(third, 'b')
})

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

