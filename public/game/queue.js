export default class Queue {
	constructor(items = []) {
		this.list = items
	}
	add(item) {
		this.list.push(item) // adds to end of array
	}
	next() {
		return this.list.shift() // returns first/oldest
	}
	takeFromTop() {
		return this.list.pop() // returns last/newest
	}
}

// Alternative implementation.
// export function Deck(items = []) {
// 	return {
// 		addToTop: item => {
// 			items.push(item) // adds to end of array
// 		},
// 		addToBottom: item => {
// 			items.unshift(item) // adds to beginning of array
// 		},
// 		takeFromBottom: () => {
// 			return items.shift() // returns first/oldest
// 		},
// 		takeFromTop: () => {
// 			return items.pop() // returns last/newest
// 		}
// 	}
// }
