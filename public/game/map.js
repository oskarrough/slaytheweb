import {shuffle, random as randomBetween, random} from './utils.js'
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
		// this.scatter()
		this.drawPaths(graph)
	}
	// Move the encounters around a bit.
	scatter() {
		const nodes = this.querySelectorAll('slay-map-encounter')
		nodes.forEach((node) => {
			node.style.transform = `translate3d(
				${randomBetween(-35, 35)}%,
				${randomBetween(-40, 40)}%,
				0)
			`
		})
	}
	// Playing around with connecting the nodes #naive
	drawPaths(graph) {
		const connect = (a, b) => {
			if (!a || !b) return
			const svg = this.querySelector('svg.paths')
			const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
			const aPos = getPosWithin(a, this)
			const bPos = getPosWithin(b, this)
			line.setAttribute('x1', aPos.left + aPos.width / 2)
			line.setAttribute('y1', aPos.top + aPos.height / 2)
			line.setAttribute('x2', bPos.left + bPos.width / 2)
			line.setAttribute('y2', bPos.top + bPos.height / 2)
			line.setAttribute('length', line.getTotalLength())
			svg.appendChild(line)
			// console.log({a, b, line})
		}

		const getFreeNodesInRow = (rowIndex) =>
			graph[rowIndex] && graph[rowIndex].filter((n) => !n.linked).filter((node) => Boolean(node.type))

		// const getRow = (index) => this.querySelector(`slay-map-row:nth-child(${index + 1})`)
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

		drawSinglePath()

		function drawSinglePath() {
			for (let [rowIndex, row] of graph.entries()) {
				// Get free, starting nodes to choose from.
				const free = getFreeNodesInRow(rowIndex)
				if (!free) {
					return new Error('no free nodes from row', rowIndex)
				}
				console.log(rowIndex, {free})
				// Pick the left-most one.
				const from = free[0]
				const fromDOM = getEncounter(rowIndex, 0)
				console.log(from, fromDOM)

				// Do the same for the next row.
				const to = getFreeNodesInRow(rowIndex + 1)[0]
				const toDOM = getEncounter(rowIndex + 1, 0)
				console.log(to, toDOM)

				from.linked = true
				to.linked = true
				toDOM.setAttribute('linked', true)
				fromDOM.setAttribute('linked', true)
				// connect(fromDOM, toDOM)
				// setTimeout(() => connect(fromDOM, toDOM), nodeIndex * 1000)
			}

			// const toDOM = getEncounter(i + 1, 0)
			// 	console.log({from, to, fromDOM, toDOM})
			// 	// console.log(i, nodeIndex)

			/*for (const [nodeIndex, node] of nodes.entries()) {
				// nodes.forEach((node, nodeIndex) => {
				console.log(`row ${i}, node ${nodeIndex} ${node.type}`)

				// Stop at last level.
				if (!graph[i + 1]) return

				// if (nodeIndex > 0) return

				const nextNodes = graph[i + 1].filter((n) => !n.linked).filter((n) => Boolean(n.type))
				console.log(`can link to row ${i + 1}`, nextNodes)

				const from = node
				let toIndex = 0
				let to = nextNodes[0]
				// const to = nextNodes[random(0, nextNodes.length)]
				while (!to && toIndex < nextNodes.length) {
					to = nextNodes[toIndex]
					toIndex++
				}

				if (!to) {
					console.error('no available node')
					return
				}

				to.linked = true
				console.log('linking to', to)

			}*/
		}

		// console.log({graph})

		// rows.forEach((row, i) => {
		// 	const prevRow = rows[i - 1]
		// 	const nextRow = rows[i + 1]
		// 	let prev, next

		// 	// If first row, we always have one encounter.
		// 	if (!prevRow) {
		// 		prev = getEncounter(1, 1)
		// 		prev.setAttribute('selected', true)
		// 	} else {
		// 		prev = row.querySelector('slay-map-encounter[selected]')
		// 	}

		// 	// Where to go?
		// 	if (!nextRow) {
		// 		next = getEncounter(12, 1)
		// 	} else {
		// 		const possibleNodes = nextRow.querySelectorAll('slay-map-encounter')
		// 		const random = randomBetween(0, possibleNodes.length - 1)
		// 		next = possibleNodes[random]
		// 	}

		// 	// console.log({i, prev, next})
		// 	if (prev && next) {
		// 		prev.setAttribute('selected', true)
		// 		next.setAttribute('selected', true)
		// 		connect(prev, next)
		// 	}
		// })

		// connect bottom
		// 		connect(getEncounter(12, 1), getEncounter(11, 2))
		// 		connect(getEncounter(12, 1), getEncounter(11, 3))
		// 		connect(getEncounter(12, 1), getEncounter(11, 4))
		// 		connect(getEncounter(12, 1), getEncounter(11, 5))
		// 		connect(getEncounter(11, 2), getEncounter(10, 2))
		// 		connect(getEncounter(10, 2), getEncounter(9, 2))
		// connect(getEncounter(1, 1), getEncounter(2, 3))
		// connect(getEncounter(1, 1), getEncounter(2, 4))
		// connect(getEncounter(1, 1), getEncounter(2, 5))
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
