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
export function generateGraph(opts) {
	const defaultOptions = {
		// map size
		rows: 10,
		columns: 6,
		// min/max per row
		minEncounters: 2,
		maxEncounters: 5,
		// types of encounters. duplicate them to increase chance
		/*
			M Monster
			$ Shop
			? Question mark
			T Treasure
			E Elite
			BOSS Boss
		*/
		//encounters: '💀💀💀💀💰❓👹',
		encounters: '💀💀💀💀💰👹',
		//encounters: 'MMMMMER$',
	}
	const options = Object.assign(defaultOptions, opts)
	// if (options.maxEncounters > options.columns) options.maxEncounters = options.columns
	// console.log('Generating graph', options)

	function Node(type = false) {
		return {type, edges: new Set()}
	}

	// The type of each encounter on the map is decided by this function.
	// This could be much more "intelligent" for example elite fights should first come later.
	// 🕸️ // 🏔 // 🗻 // 🌋 // 👺
	function randomEncounter(y) {
		const pick = (types) => shuffle(Array.from(types))[0]
		if (y < 2) return pick('💀')
		return pick(options.encounters)
	}

	const graph = []
	for (let r = 0; r < options.rows; r++) {
		const row = []
		// In each row we want from X encounters.
		let encounters = randomBetween(options.minEncounters, options.maxEncounters)
		if (encounters > options.columns) encounters = options.columns
		for (let i = 0; i < encounters; i++) {
			row.push(Node(randomEncounter(r)))
		}
		// Fill empty columns.
		while (row.length < options.columns) {
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

// Finds a path from start to finish in the graph.
// Set the index to the column you'd like to follow, when possible.
// It returns a nested array of the row/column indexes of the graph nodes.
// [
// 	[[0, 0], [1,4]], <-- first move.
// 	[[1, 4], [2,1]] <-- second move
// ]
export function findPath(graph, preferredIndex, debug = false) {
	let path = []
	let lastVisited
	if (debug) console.groupCollapsed('finding path', preferredIndex)
	// Walk through each row.
	for (let [rowIndex, row] of graph.entries()) {
		if (debug) console.group(`row ${rowIndex}`)
		const nextRow = graph[rowIndex + 1]
		let aIndex = preferredIndex
		let bIndex = preferredIndex

		// If on last level, stop drawing.
		if (!nextRow) {
			if (debug) console.log('no next row, stopping')
			if (debug) console.groupEnd()
			break
		}

		// Find the node we came from.
		let a = lastVisited
		const newAIndex = row.indexOf(a)
		if (a) {
			if (debug) console.log('changing a index to', newAIndex)
			aIndex = newAIndex
		} else {
			if (debug) console.log('forcing "from" to first node in row')
			a = row[0]
			aIndex = 0
		}
		if (!a) throw Error('missing from')

		// Find the node we are going to.
		// Search to the right of our index.
		let b
		for (let i = bIndex; i < nextRow.length; i++) {
			if (debug) console.log('forwards', i)
			let node = nextRow[i]
			if (isEncounter(node)) {
				if (debug) console.log('choosing', i)
				b = node
				bIndex = i
				break
			}
		}
		// No result? Search to the left instead.
		if (!b) {
			for (let i = bIndex; i >= 0; i--) {
				if (debug) console.log('backwards', i)
				let node = nextRow[i]
				if (isEncounter(node)) {
					if (debug) console.log('choosing', i)
					b = node
					bIndex = i
					break
				}
			}
			if (!b) throw Error('missing to')
		}
		lastVisited = b

		if (debug) console.log(`connected row ${rowIndex}:${aIndex} to ${rowIndex + 1}:${bIndex}`)
		const moveA = [rowIndex, aIndex]
		const moveB = [rowIndex + 1, bIndex]
		path.push([moveA, moveB])
		if (debug) console.groupEnd()
	}
	if (debug) console.groupEnd()
	return path
}

export function drawPath(graph, path, graphEl, preferredIndex) {
	const debug = false
	const nodeFromMove = ([row, col]) => graph[row][col]

	if (!graphEl) throw new Error('Missing graph element')

	// Create an empty <svg> to hold our path.
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
	svg.id = `path${preferredIndex}`
	svg.classList.add('paths')
	graphEl.appendChild(svg)

	// For each move, add a <line> element from a to b.
	if (debug) console.groupCollapsed('drawing path', preferredIndex)
	path.forEach((move, index) => {
		const a = nodeFromMove(move[0])
		const b = nodeFromMove(move[1])

		if (debug) console.groupEnd()
		// Create a line between each element.
		const aPos = getPosWithin(a.el, graphEl)
		const bPos = getPosWithin(b.el, graphEl)
		if (!aPos.top) {
			throw Error(
				"Could not render the svg path. Is the graph's container element rendered/visible?"
			)
		}
		const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
		line.setAttribute('x1', aPos.left + aPos.width / 2)
		line.setAttribute('y1', aPos.top + aPos.height / 2)
		line.setAttribute('x2', bPos.left + bPos.width / 2)
		line.setAttribute('y2', bPos.top + bPos.height / 2)
		svg.appendChild(line)
		line.setAttribute('length', line.getTotalLength())
		a.el.setAttribute('linked', true)
		b.el.setAttribute('linked', true)
		if (debug) console.log(`Move no. ${index} is from ${a} to ${b}`)
	})
	if (debug) console.groupEnd()
}

// Shortcut
export function findAndDrawPath(graph, graphEl, index) {
	const path = findPath(graph, index)
	drawPath(graph, path, graphEl, index)
}

// Look for a free node in the next row to the right of the "desired index".
const isEncounter = (node) => node && Boolean(node.type)

// Since el.offsetLeft doesn't respect CSS transforms,
// and getBounding.. is relative to viewport, not parent, we need this utility.
function getPosWithin(el, container) {
	if (!el) throw new Error('missing el')
	if (!container) throw new Error('missing container')
	const parent = container.getBoundingClientRect()
	const rect = el.getBoundingClientRect()
	return {
		top: rect.top - parent.top,
		left: rect.left - parent.left,
		width: rect.width,
		height: rect.height,
	}
}

// Prints a text representation of the map to the conosle.
export function graphToString(graph) {
	graph.forEach((row, level) => {
		let str = `${String(level).padStart(2, '0')}   `
		row.forEach((node) => {
			if (!node.type) {
				str = str + ' '
			} else {
				str = str + node.type
			}
		})
		console.log(str)
	})
}

// https://github.com/oskarrough/slaytheweb/issues/28
// https://i.imgur.com/oAofMa0.jpg
// https://github.com/yurkth/stsmapgen
// https://github.com/SunnySunMoon/Slay-the-Spire-Map
// https://mapbox.github.io/delaunator/
// https://github.com/anvaka/ngraph.graph
// https://github.com/anvaka/ngraph.path
// https://css-tricks.com/a-trick-that-makes-drawing-svg-lines-way-easier/
