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

// Draws a path between the DOM nodes connected to the graph.
// Give it your desired index and it'll try to create a straight path to the end.
function drawSinglePath(graph, graphEl, desiredIndex) {
	const svg = graphEl.querySelector('svg.paths')
	console.groupCollapsed('drawing path', desiredIndex)
	let lastVisited

	// const svg = document.createElement('svg')
	// svg.id = `path${desiredIndex}`
	// svg.className = 'paths'
	// parentEl.appendChild(svg)

	// Walk through each row.
	for (let [rowIndex, row] of graph.entries()) {
		console.group(`row ${rowIndex}`)

		let a = lastVisited
		let b
		let aIndex = desiredIndex
		let bIndex = desiredIndex
		const nextRow = graph[rowIndex + 1]

		// If on last level, stop drawing.
		if (!nextRow) {
			console.log('no next row, stopping')
			console.groupEnd()
			break
		}

		// Find the node we came from
		if (!a) {
			console.log('forcing "from" to first node in row')
			a = row[0]
			if (!a) throw Error('missing from')
		}

		// 2. Find the node we are going to
		// Search to the right of our index.
		for (let i = bIndex; i < nextRow.length; i++) {
			console.log('forwards', i)
			let node = nextRow[i]
			if (isEncounter(node)) {
				console.log('choosing', i)
				b = node
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
					break
				}
			}
			if (!b) throw Error('missing to')
		}
		lastVisited = b

		// Draw the path between the two elements.
		console.log(`connected row ${rowIndex}:${aIndex} to ${rowIndex + 1}:${bIndex}`, a.el, b.el)
		// setTimeout(() => {
		connectNodes(a, b, graphEl, svg)
		// }, rowIndex * 40)
		console.groupEnd()
	}

	console.groupEnd()
}

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

// Draws a "path" between two DOM elements using an svg line.
// It expects a and b to be graph nodes with a ".el" DOM element.
const connectNodes = (a, b, parentEl, svg) => {
	if (!a || !b) return
	if (!a.el || !b.el) return
	const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
	const aPos = getPosWithin(a.el, parentEl)
	const bPos = getPosWithin(b.el, parentEl)
	line.setAttribute('x1', aPos.left + aPos.width / 2)
	line.setAttribute('y1', aPos.top + aPos.height / 2)
	line.setAttribute('x2', bPos.left + bPos.width / 2)
	line.setAttribute('y2', bPos.top + bPos.height / 2)
	svg.appendChild(line)
	line.setAttribute('length', line.getTotalLength())
	a.edges.add(b)
	b.edges.add(a)
	a.el.setAttribute('linked', true)
	b.el.setAttribute('linked', true)
}

// This is an example of how you can render the graph as a map.
export class SlayMap extends HTMLElement {
	connectedCallback() {
		this.state = {
			rows: this.getAttribute('rows'),
			columns: this.getAttribute('columns'),
		}
		this.render()
	}
	render() {
		const graph = generateGraph(this.state.rows, this.state.columns)
		this.innerHTML = `
			${graph
				.map(
					(row) => `
				<slay-map-row>
					${row
						.map((col) => {
							if (col.type === 'start') {
								return `<slay-map-encounter>start</slay-map-encounter>`
							}
							if (col.type === 'end') {
								return `<slay-map-encounter>end</slay-map-encounter>`
							}
							if (col.type) {
								return `<slay-map-encounter>${col.type}</slay-map-encounter>`
							}
							return `<slay-map-node></slay-map-node>`
						})
						.join('')}
				</slay-map-row>
			`
				)
				.join('')}
			<svg class="paths"></svg>
		`
		if (!graph[0][0].el) this.addElementsToGraph(graph)
		this.scatter()
		this.drawPaths(graph)
		console.log(graph)
	}
	addElementsToGraph(graph) {
		graph.forEach((row, rowIndex) => {
			row
				.filter((n) => n.type)
				.forEach((node, nodeIndex) => {
					// nth-of starts at 1, not 0
					node.el = this.querySelector(
						`slay-map-row:nth-of-type(${rowIndex + 1})
							 slay-map-encounter:nth-of-type(${nodeIndex + 1})`
					)
				})
		})
	}
	// Move the encounters around a bit.
	scatter() {
		const nodes = this.querySelectorAll('slay-map-encounter')
		nodes.forEach((node) => {
			node.style.transform = `translate3d(
				${randomBetween(-35, 35)}%,
				${randomBetween(-35, 35)}%,
				0)
			`
		})
	}
	drawPaths(graph) {
		// around ~90-140ms
		console.time('mapRender')
		drawSinglePath(graph, this, 1)
		console.timeEnd('mapRender')
	}
}

customElements.define('slay-map', SlayMap)

// https://github.com/oskarrough/slaytheweb/issues/28
// https://i.imgur.com/oAofMa0.jpg
// https://github.com/yurkth/stsmapgen
// https://github.com/SunnySunMoon/Slay-the-Spire-Map
// https://css-tricks.com/a-trick-that-makes-drawing-svg-lines-way-easier/
// https://mapbox.github.io/delaunator/
// https://github.com/anvaka/ngraph.graph
// https://github.com/anvaka/ngraph.path
