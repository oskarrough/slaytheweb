import {html} from '../../web_modules/htm/preact/standalone.module.js'
import {generateGraph, findPath, drawPath} from '../game/map.js'
import {random as randomBetween} from '../game/utils.js'

export default function map({dungeon}) {
	function capitalize(string) {
		return string.charAt(0).toUpperCase() + string.slice(1)
	}
	return html`
		<h2>Map of the dungeon</h2>
		<ul class="MapList">
			${dungeon.rooms.map(
				(room, index) =>
					html`<li>
						${index}. ${capitalize(room.type)} ${index === dungeon.index ? '(you are here)' : ''}
					</li>`
			)}
		</ul>
	`
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
		// around ~90-140ms
		console.time('mapRender')
		drawPath(graph, findPath(graph, this, 0), this)
		drawPath(graph, findPath(graph, this, 2), this)
		drawPath(graph, findPath(graph, this, 3), this)
		drawPath(graph, findPath(graph, this, 5), this)
		console.timeEnd('mapRender')
	}
}
customElements.define('slay-map', SlayMap)
