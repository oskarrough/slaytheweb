import {shuffle, random as randomBetween} from './utils.js'
/*
 * A procedural generated map for Slay the Web.
 * again, heavily inspired by Slay the Spire.
 *
 * What are the rules?
 *
 * 1. Starting node connects to all nodes on the first row
 * 2. End node connects to all nodes on the last row
 * 3. The graph can have a variable number of rows and columns
 * 4. Each row has a random number of encounters from 2 to 5
 * 5. Each row has six columns
 * 6. Encounters are randomized in a row
 * */

// Returns a "graph" of the map we want to render,
// using nested arrays for the rows and columns.
export function generateGraph(rows, columns) {
	const Node = (type = false) => {
		return {type, edges: new Set()}
	}
	const graph = []
	for (let r = 0; r < rows; r++) {
		const row = []
		// In each row we want from a to b encounters.
		const encounters = randomBetween(2, 5)
		for (let i = 0; i < encounters; i++) {
			row.push(Node(randomEncounter()))
		}
		// Fill empty columns.
		while (row.length < columns) {
			row.push(Node())
		}
		// Randomize the order.
		graph.push(shuffle(row))
	}
	// Add start end end nodes, in this order.
	graph.push([Node('🕸️')]) // end
	graph.unshift([Node('🎴')]) // start
	return graph
}

// The type of each encounter on the map is decided by this function.
// This could be much more "intelligent" for example elite fights should first come later.
// 🕸️ // 🏔 // 🗻 // 🌋 // 👺
function randomEncounter() {
	return shuffle(Array.from('💀💀💀💀👹💰❓'))[0]
}

// Look for a free node in the next row to the right of the "desired index".
const isEncounter = (node) => node && Boolean(node.type)

export function findPath(graph, graphEl, desiredIndex) {
	let path = []

	console.groupCollapsed('drawing path', desiredIndex)
	let lastVisited

	// Walk through each row.
	for (let [rowIndex, row] of graph.entries()) {
		console.group(`row ${rowIndex}`)
		const nextRow = graph[rowIndex + 1]
		let aIndex = desiredIndex
		let bIndex = desiredIndex

		// If on last level, stop drawing.
		if (!nextRow) {
			console.log('no next row, stopping')
			console.groupEnd()
			break
		}

		// Find the node we came from.
		let a = lastVisited
		const newAIndex = row.indexOf(a)
		if (a) {
			console.log('changing a index to', newAIndex)
			aIndex = newAIndex
		} else {
			console.log('forcing "from" to first node in row')
			a = row[0]
			aIndex = 0
		}
		if (!a) throw Error('missing from')

		// Find the node we are going to.
		// Search to the right of our index.
		let b
		for (let i = bIndex; i < nextRow.length; i++) {
			console.log('forwards', i)
			let node = nextRow[i]
			if (isEncounter(node)) {
				console.log('choosing', i)
				b = node
				bIndex = i
				break
			}
		}
		// No result? Search to the left instead.
		if (!b) {
			for (let i = bIndex; i >= 0; i--) {
				console.log('backwards', i)
				let node = nextRow[i]
				if (isEncounter(node)) {
					console.log('choosing', i)
					b = node
					bIndex = i
					break
				}
			}
			if (!b) throw Error('missing to')
		}
		lastVisited = b
		// debugger

		console.log(`connected row ${rowIndex}:${aIndex} to ${rowIndex + 1}:${bIndex}`)
		path.push([
			[rowIndex, aIndex], // from
			[rowIndex + 1, bIndex], // to
		])
		console.groupEnd()
	}

	console.groupEnd()
	return path
}

export function drawPath(graph, path, graphEl) {
	const svg = graphEl.querySelector('svg.paths')
	console.group('drawPath')
	path.forEach((move, index) => {
		// console.log(move)
		const source = move[0]
		const destination = move[1]
		const a = graph[source[0]][source[1]]
		const b = graph[destination[0]][destination[1]]
		a.edges.add(b)
		b.edges.add(a)
		// console.log(index, source, a, '\n', destination, b)
		console.log(`Move ${index} is from ${source} to ${destination}`, a, b)

		const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
		const aPos = getPosWithin(a.el, graphEl)
		const bPos = getPosWithin(b.el, graphEl)
		line.setAttribute('x1', aPos.left + aPos.width / 2)
		line.setAttribute('y1', aPos.top + aPos.height / 2)
		line.setAttribute('x2', bPos.left + bPos.width / 2)
		line.setAttribute('y2', bPos.top + bPos.height / 2)
		svg.appendChild(line)
		line.setAttribute('length', line.getTotalLength())
		a.el.setAttribute('linked', true)
		b.el.setAttribute('linked', true)
	})
	console.groupEnd()
}
// const svg = document.createElement('svg')
// svg.id = `path${desiredIndex}`
// svg.className = 'paths'
// parentEl.appendChild(svg)

// Since el.offsetLeft doesn't respect CSS transforms,
// and getBounding.. is relative to viewport, not parent, we need this utility.
function getPosWithin(el, container) {
	const parent = container.getBoundingClientRect()
	const rect = el.getBoundingClientRect()
	return {
		top: rect.top - parent.top,
		left: rect.left - parent.left,
		width: rect.width,
		height: rect.height,
	}
}

// https://github.com/oskarrough/slaytheweb/issues/28
// https://i.imgur.com/oAofMa0.jpg
// https://github.com/yurkth/stsmapgen
// https://github.com/SunnySunMoon/Slay-the-Spire-Map
// https://css-tricks.com/a-trick-that-makes-drawing-svg-lines-way-easier/
// https://mapbox.github.io/delaunator/
// https://github.com/anvaka/ngraph.graph
// https://github.com/anvaka/ngraph.path
