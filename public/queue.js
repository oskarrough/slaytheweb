import actions from './actions.js'

// var queue = (() => {
//   var arr = [];

//   return {
//     isEmpty: () => arr.length == 0,
//     add: item => arr.push(item),
//     remove: () => arr.shift(),
//     removeAll: filter => arr = arr.filter(x => !filter(x))
//   };
// })();

class Queue {
	constructor(items = []) {
		this.list = items
	}
	add(action, args) {
		this.list.push({
			callback: actions[action],
			args
		})
		console.log('added to queue', this.list)
	}
	next() {
		return this.list.pop()
	}
	// addToBottom() {
	// 	this.items.unshift(item)
	// }
}

const queue = new Queue()

window.queue = queue

export default queue

// var stack = []
// stack.push(2) // stack is now [2]
// stack.push(5) // stack is now [2, 5]
// var i = stack.pop() // stack is now [2]
// alert(i) // displays 5

// var queue = []
// queue.push(2) // queue is now [2]
// queue.push(5) // queue is now [2, 5]
// var i = queue.shift() // queue is now [5]
// alert(i)
