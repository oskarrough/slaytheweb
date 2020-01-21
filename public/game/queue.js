export default class Queue {
	constructor(items = []) {
		this.list = items
	}
	add(item) {
		this.list.push(item)
		console.log('added to queue', this.list)
	}
	next() {
		if (!this.list.length) return
		return this.list.pop()
	}
	// addToBottom() {
	// 	this.items.unshift(item)
	// }
}
