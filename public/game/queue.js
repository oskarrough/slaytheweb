export default class Queue {
	constructor(items = []) {
		this.list = items
	}
	// Add to the front
	addToTop(item) {
		this.list.push(item)
	}
	// Add to the end
	addToBottom(item) {
		this.list.unshift(item)
	}
	// Removes and returns the last/newest item
	takeFromTop() {
		return this.list.pop()
	}
	// Removes and returns the first/oldest item
	takeFromBottom() {
		return this.list.shift()
	}
}
