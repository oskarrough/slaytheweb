export default class Queue {
	constructor(items = []) {
		this.list = items
		this.history = []
	}
	add(item) {
		this.list.push(item) // adds to end of array
	}
	// addToBottom() {
	// 	this.items.unshift(item) // adds to beginning of array
	// }
	next() {
		// return this.list.pop() // returns last/newest
		const item = this.list.shift() // returns first/oldest
		this.history.push(item)
		return item
	}
}

// https://immerjs.github.io/immer/docs/patches
// https://medium.com/@mweststrate/distributing-state-changes-using-snapshots-patches-and-actions-part-2-2f50d8363988

// handleAddPatch = (patch, inversePatches) => {
// 	this.undo.push(inversePatches)
// }

// handleUndo = () => {
// 	const undo = this.undo.pop()
// 	if (!undo) return
// 	this.setState(applyPatches(this.state, undo))
// }

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
