import test from 'ava'
import Queue from '../src/game/queue.js'

test('can add and run through queue', (t) => {
	const q = new Queue()
	t.is(q.list.length, 0)
	q.enqueue('a')
	t.is(q.list.length, 1)
	q.enqueue('b')
	q.enqueue('c')
	q.enqueue('d')
	t.is(q.list.length, 4)
	const first = q.dequeue()
	t.is(q.list.length, 3)
	const second = q.dequeue()
	const third = q.dequeue()
	t.is(q.list.length, 1)
	t.is(first, 'a')
	t.is(second, 'b')
	t.is(third, 'c')
})
