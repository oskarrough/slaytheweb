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
	const graph = []
	for (let r = 0; r < rows; r++) {
		const row = []
		// In each row we want from a to b encounters.
		const encounters = randomBetween(2, 5)
		for (let i = 0; i < encounters; i++) {
			row.push({type: randomEncounter()})
		}
		// Fill empty columns.
		while (row.length < columns) {
			row.push({type: false})
		}
		// Randomize the order.
		graph.push(shuffle(row))
	}
	graph.push([{type: 'end'}])
	graph.unshift([{type: 'start'}])
	return graph
}

function randomEncounter() {
	return shuffle(Array.from('💀💀💀💰❓'))[0]
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
		const {rows, columns} = this.state
		const graph = generateGraph(rows, columns)
		console.log({graph})
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
		this.scatter()
		this.drawPaths(graph)
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
		const svg = this.querySelector('svg.paths')

		const connect = (a, b) => {
			if (!a || !b) return
			const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
			const aPos = getPosWithin(a, this)
			const bPos = getPosWithin(b, this)
			line.setAttribute('x1', aPos.left + aPos.width / 2)
			line.setAttribute('y1', aPos.top + aPos.height / 2)
			line.setAttribute('x2', bPos.left + bPos.width / 2)
			line.setAttribute('y2', bPos.top + bPos.height / 2)
			svg.appendChild(line)
			line.setAttribute('length', line.getTotalLength())
			// console.log({a, b, line})
		}

		const getFreeNodesInRow = (rowIndex) =>
			graph[rowIndex] && graph[rowIndex].filter((n) => Boolean(n.type)).filter((n) => !n.linked)

		const getFreeNodeInRow = (rowIndex, nodeIndex) => {
			const nextFreeNodes = getFreeNodesInRow(rowIndex)
			const node = nextFreeNodes[nodeIndex]
			return node
		}

		const getEncounter = (rowIndex, index, onlyFree = false) => {
			const rows = this.querySelectorAll('slay-map-row')
			const row = rows[rowIndex]
			if (!row) return false
			// nth-of starts at 1, not 0
			if (onlyFree) {
				return row.querySelector(`slay-map-encounter[linked]:nth-of-type(${index + 1})`)
			}
			return row.querySelector(`slay-map-encounter:nth-of-type(${index + 1})`)
		}

		const addElementsToGraph = (graph) => {
			graph.forEach((row, rowIndex) => {
				row
					.filter((n) => n.type)
					.forEach((node, nodeIndex) => {
						node.el = getEncounter(rowIndex, nodeIndex)
						// console.log(node, node.el)
					})
			})
		}
		addElementsToGraph(graph)

		// Draws a path between the DOM nodes connected to the graph.
		// Give it your desired index and it'll try to create a straight path to the end.
		function drawSinglePath(desiredIndex) {
			let lastVisited

			// Walk through each row.
			for (let [rowIndex, row] of graph.entries()) {
				console.group(`row ${rowIndex}`)

				let nextRow = graph[rowIndex + 1]
				// If on last level, stop drawing.
				if (!nextRow) {
					console.log('no next row, stopping')
					break
				}

				let from
				let to
				let fromIndex = desiredIndex
				let toIndex = desiredIndex

				// Find FROM
				if (lastVisited) {
					from = lastVisited
				} else {
					while (fromIndex < row.length) {
						from = getFreeNodeInRow(rowIndex, fromIndex)
						if (from) {
							console.log('yes from', {fromIndex})
							break
						} else {
							console.log('no from', {fromIndex})
						}
						fromIndex++
					}
					if (!from) {
						console.log('missing "from node" for', fromIndex)
						fromIndex = desiredIndex
						while (fromIndex < row.length) {
							from = getFreeNodeInRow(rowIndex, fromIndex)
							if (from) {
								console.log('2. yes from', {fromIndex})
								break
							} else {
								console.log('2. no from', {fromIndex})
							}
							if (from) {
								console.log({fromIndex})
								break
							}
							fromIndex++
						}
						fromIndex = 0
						while (fromIndex < row.length) {
							from = getFreeNodeInRow(rowIndex, fromIndex)
							if (from) {
								console.log('2. yes from', {fromIndex})
								break
							} else {
								console.log('2. no from', {fromIndex})
							}
							if (from) {
								console.log({fromIndex})
								break
							}
							fromIndex++
						}
						if (!from && rowIndex === 0) {
							console.log('forcing "from" to first node in row')
							from = row[0]
						}
					}
					if (!from || !from.el) {
						throw Error('missing from')
					}
				}

				// Look for a free node in the next row to the right of the "desired index".
				const isValidNode = (node) => node && Boolean(node.type)

				// Search to the right of our index.
				for (let i = toIndex; i < nextRow.length; i++) {
					console.log('forwards', i)
					let node = nextRow[i]
					if (isValidNode(node)) {
						console.log('choosing', i)
						to = node
						break
					}
				}
				// No result? Search to the left instead.
				if (!to) {
					for (let i = toIndex; i >= 0; i--) {
						console.log('backwards', i)
						let node = nextRow[i]
						if (isValidNode(node)) {
							console.log('choosing', i)
							to = node
							break
						}
					}
				}

				if (!to || !to.el) {
					throw Error('missing to')
				}
				lastVisited = to

				// Draw the path between the two elements.
				console.log(
					`connected row ${rowIndex}:${fromIndex} to ${rowIndex + 1}:${toIndex}`,
					from.el,
					to.el
				)
				from.linked = true
				to.linked = true
				to.el.setAttribute('linked', true)
				from.el.setAttribute('linked', true)
				// setTimeout(() => {
				connect(from.el, to.el)
				// }, rowIndex * 300)

				console.groupEnd()
			}
		}

		// drawSinglePath(666)
		drawSinglePath(0)
		drawSinglePath(Math.round(graph[0].length / 1.5))
		drawSinglePath(graph.length)
		// setTimeout(() => drawSinglePath(1), graph.length * 300)
		// setTimeout(() => drawSinglePath(2), graph.length * 300)
	}
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

customElements.define('slay-map', SlayMap)

function generate() {
	let slayMap = document.querySelector('slay-map')
	slayMap.render()
}
window.stw = {
	generate,
}

// https://github.com/oskarrough/slaytheweb/issues/28
// https://i.imgur.com/oAofMa0.jpg
// https://github.com/yurkth/stsmapgen
// https://github.com/SunnySunMoon/Slay-the-Spire-Map
// https://css-tricks.com/a-trick-that-makes-drawing-svg-lines-way-easier/
// https://mapbox.github.io/delaunator/
// https://github.com/anvaka/ngraph.graph
// https://github.com/anvaka/ngraph.path
