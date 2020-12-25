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
function generateGraph(rows, columns) {
	const graph = []
	for (let r = 0; r < rows; r++) {
		const row = []
		// In each row we want from a to b encounters.
		const encounters = randomBetween(2, 5)
		for (let i = 0; i < encounters; i++) {
			row.push({type: 'encounter'})
		}
		// Fill empty columns.
		while (row.length < columns) {
			row.push({type: false})
		}
		// Randomize the order.
		graph.push(shuffle(row))
	}
	return graph
}

// This is an example of how you can render the graph as a map.
customElements.define(
	'slay-map',
	class SlayMap extends HTMLElement {
		connectedCallback() {
			this.state = {
				rows: this.getAttribute('rows'),
				columns: this.getAttribute('columns'),
			}
			this.render()
		}
		randomEncounter() {
			return shuffle(Array.from('💀💀💀💰❓'))[0]
		}
		render() {
			const {rows, columns} = this.state
			const graph = generateGraph(rows, columns)
			console.log({graph})
			this.innerHTML = `
			<slay-map-row center>
				<slay-map-encounter>💀💀</slay-map-encounter>
			</slay-map-row>
			${graph
				.map(
					(row) => `
				<slay-map-row>
					${row
						.map((col) => {
							if (col.type === 'encounter') {
								return `<slay-map-encounter>${this.randomEncounter()}</slay-map-encounter>`
							}
							return `<slay-map-node></slay-map-node>`
						})
						.join('')}
				</slay-map-row>
			`
				)
				.join('')}
			<slay-map-row center>
				<slay-map-encounter>🏕️</slay-map-encounter>
			</slay-map-row>
			<svg class="paths"><rect width="20" height="20" fill="red" /></svg>
		`
			this.scatter()
			this.drawPaths()
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
		drawPaths() {
			const parent = this.getBoundingClientRect()
			function getPos(el) {
				const rect = el.getBoundingClientRect()
				return {
					top: rect.top - parent.top,
					left: rect.left - parent.left,
					width: rect.width,
					height: rect.height,
				}
			}

			const connect = (a, b) => {
				if (!a || !b) return
				const svg = this.querySelector('svg.paths')
				const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
				const aPos = getPos(a)
				const bPos = getPos(b)
				line.setAttribute('x1', aPos.left + aPos.width / 2)
				line.setAttribute('y1', aPos.top + aPos.height / 2)
				line.setAttribute('x2', bPos.left + bPos.width / 2)
				line.setAttribute('y2', bPos.top + bPos.height / 2)
				svg.appendChild(line)
				// console.log({a, b})
			}

			const getEncounter = (row, index) =>
				this.querySelector(
					`slay-map-row:nth-child(${row}) slay-map-encounter:nth-of-type(${index})`
				)

			const rows = this.querySelectorAll('slay-map-row')
			rows.forEach((row, i) => {
				const prevRow = rows[i - 1]
				const nextRow = rows[i + 1]
				let prev, next

				// If first row, we always have one encounter.
				if (!prevRow) {
					prev = getEncounter(1, 1)
					prev.setAttribute('selected', true)
				} else {
					prev = row.querySelector('slay-map-encounter[selected]')
				}

				// Where to go?
				if (!nextRow) {
					next = getEncounter(12, 1)
				} else {
					const possibleNodes = nextRow.querySelectorAll('slay-map-encounter')
					const random = randomBetween(0, possibleNodes.length - 1)
					next = possibleNodes[random]
				}

				// console.log({i, prev, next})
				if (prev && next) {
					prev.setAttribute('selected', true)
					next.setAttribute('selected', true)
					connect(prev, next)
				}
			})
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
)

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

///// ARCHIVE BELOW

/*
createMap({columns, rows}) {
		const graph = generateGraph(columns, rows)
		const element = this
		graph.forEach((row, rowIndex) => {
			const r = document.createElement('div')
			r.classList.add('Map-row')
			for (let i = 0; i<columns; i++) {
				// Render columns.
				var c = document.createElement('div')
				const type = row[i].type
				c.classList.add(`Map-${type}`)
				if (type === 'encounter') {
					//😀😈💀💰❓
					c.textContent = shuffle(Array.from("💀💀💀💰❓"))[0]
				}
				// c.style.transform = `translateY(${randomBetween(-50,50)}%)`
				r.appendChild(c)
			}
			element.appendChild(r)
		})
		return element
	}
	render2() {
		this.innerHTML = ''
		this.createMap({
			columns: 6,
			rows: 10
		})
	}

	*/

// var graph = [
// 	[{type: 'monster'}, {type: 'monster'}, {type: 'monster'}, {type: 'monster'}, {type: 'monster'}],
// 	[{type: 'monster'}, {type: 'monster'}, {type: 'monster'}, {type: 'monster'}, {type: 'monster'}],
// 	[{type: 'monster'}, {type: 'monster'}, {type: 'monster'}, {type: 'monster'}, {type: 'monster'}],
// 	[{type: 'monster'}, {type: 'monster'}, {type: 'monster'}, {type: 'monster'}, {type: 'monster'}],
// ]

// https://github.com/oskarrough/slaytheweb/issues/28
// https://i.imgur.com/oAofMa0.jpg
// https://github.com/yurkth/stsmapgen
// https://github.com/SunnySunMoon/Slay-the-Spire-Map
