import {generateGraph, findAndDrawPath} from '../game/map.js'
import {random as randomBetween} from '../game/utils.js'

// This is an example of how you can render the graph as a map.
export class SlayMap extends HTMLElement {
	connectedCallback() {
		this.render()
	}
	render() {
		const rows = Number(this.getAttribute('rows'))
		const columns = Number(this.getAttribute('columns'))
		const encounters = this.getAttribute('encounters')
		const minEncounters = Number(this.getAttribute('minEncounters'))
		const maxEncounters = Number(this.getAttribute('maxEncounters'))
		this.style.setProperty('--rows', rows)
		this.style.setProperty('--columns', columns)
		const graphOptions = {rows, columns, minEncounters, maxEncounters}
		if (encounters) graphOptions.encounters = encounters
		const graph = generateGraph(graphOptions)
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
		`
		this.didRender(graph)
	}
	didRender(graph) {
		if (!graph[0][0].el) this.addElementsToGraph(graph)
		this.scatter()
		this.drawPaths(graph)
		console.log({graph})
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
		const pathOption = this.getAttribute('paths')
		if (pathOption) {
			Array.from(pathOption)
				.map((string) => Number(string))
				.forEach((pathIndex) => {
					findAndDrawPath(graph, this, pathIndex)
				})
		} else {
			// Draw a path for each col in row1, which connects to start.
			console.time('mapRender')
			graph[1].forEach((column, index) => {
				setTimeout(() => {
					findAndDrawPath(graph, this, index)
				}, index * 100)
			})
			console.timeEnd('mapRender')
		}
	}
}

customElements.define('slay-map', SlayMap)
