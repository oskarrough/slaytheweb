/**
 * A queue is a list of objects that are inserted and removed first-in-first-out (FIFO).
 */
export default class Queue {
	constructor(items = []) {
		this.list = items
	}
	/** Enqueue and add an item at the end of the queue. */
	enqueue(item) {
		this.list.push(item)
	}
	/** Dequeue and remove an item at the front of the queue. */
	dequeue() {
		return this.list.shift()
	}
}
