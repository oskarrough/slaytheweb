export default class Queue {
	constructor(items = []) {
		this.list = items
	}
	// Adds a new item to the end of the queue
	add(item) {
		this.list.push(item)
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

// Alternative implementation.
/*
export function Deck(items = []) {
	return {
		addToTop: item => {
			items.push(item) // adds to end of array
		},
		addToBottom: item => {
			items.unshift(item) // adds to beginning of array
		},
		takeFromBottom: () => {
			return items.shift() // removes and returns first/oldest
		},
		takeFromTop: () => {
			return items.pop() // removes and returns last/newest
		}
	}
}
*/
