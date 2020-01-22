export default class Queue {
	constructor(items = []) {
		this.list = items
	}
	add(item) {
		this.list.push(item)
		console.log('added to queue', this.list)
	}
	next() {
		// return this.list.pop() // returns last/newest
		return this.list.shift() // returns first/oldest
	}
	// addToBottom() {
	// 	this.items.unshift(item)
	// }
}
