import {Component, html} from '../web_modules/htm/preact/standalone.module.js'
import {findAndDrawPath} from '../game/map.js'
import {random as randomBetween} from '../game/utils.js'

export default function map(props) {
	const {graph, x, y, paths, pathTaken} = props.dungeon

	return html`
		<div class="MapContainer">
			<h2>Map of the dungeon. Level ${y}. Node ${x}</h2>
			<${Mapo}
				graph=${graph}
				paths=${paths}
				pathTaken=${pathTaken}
				x=${x}
				y=${y}
				onSelect=${props.onMove}
			><//>
			<h2>Log</h2>
			<ul class="MapList">
				${pathTaken.map((path) => html`<li>${path.y}.${path.x}</li>`)}
			</ul>
		</div>
	`
}

export class Mapo extends Component {
	componentDidMount() {
		console.log('Did mount')
		this.setState({onlydothis: 'totriggerComponentDidUpdate... can you believe it'})
	}

	componentDidUpdate(prevProps) {
		console.log('Did update')

		// Let CSS know about the amount of rows and cols we have.
		this.base.style.setProperty('--rows', Number(prevProps.graph.length))
		this.base.style.setProperty('--columns', Number(prevProps.graph[1].length))

		// Add references to our DOM elements on the graph. Why?
		// no set state because we don't want to rerender
		if (!this.didDrawPaths) {
			const el = this.props.graph[0][0].el
			console.log('Did update: doing heavy work', Boolean(el))
			// if (!el) {
			this.scatter()
			this.props.graph = this.addElementsToGraph(this.props.graph)
			// }
			this.drawPaths(this.props.graph)
			this.didDrawPaths = true
		}
	}

	addElementsToGraph(graph) {
		graph.forEach((row, rowIndex) => {
			row.forEach((node, nodeIndex) => {
				if (!node.type) return
				node.el = this.base.childNodes[rowIndex].childNodes[nodeIndex]
			})
		})
		return graph
	}

	// Shake the positions up a bit.
	scatter(distance = 35) {
		const nodes = this.base.querySelectorAll('slay-map-node[encounter]')
		nodes.forEach((node) => {
			node.style.transform = `translate3d(
				${randomBetween(-distance, distance)}%,
				${randomBetween(-distance, distance)}%,
				0)
			`
		})
	}

	drawPaths(graph) {
		const paths = this.props.paths
		// Sneaky but to control how many paths are rendered, you can pass a string "1" or "123",
		// and it'll draw paths on those columns only.
		if (paths) {
			Array.from(paths).forEach((value) => {
				findAndDrawPath(graph, this.base, Number(value))
			})
		} else {
			// If no specific paths are requested, we draw a path on each column.
			graph[1].forEach((column, index) => {
				setTimeout(() => {
					findAndDrawPath(graph, this.base, index)
				}, index * 100)
			})
		}
	}

	render(props) {
		const {graph, x, y, pathTaken} = props
		if (!graph) {
			console.log('No graph to render', graph)
			return
		}
		console.log('Rendering dungeon graph', pathTaken)
		return html`
			<slay-map>
				${graph.map(
					(row, rowIndex) => html`
						<slay-map-row current=${rowIndex === y}>
							${row.map((col, colIndex) => {
								const isCurrent = rowIndex === y && colIndex === x
								return html`<slay-map-node
									encounter=${Boolean(col.type)}
									current=${isCurrent}
									did-visit=${col.didVisit}
									onClick=${() => props.onSelect({x: colIndex, y: rowIndex})}
									><span>${col.type}</span></slay-map-node
								>`
							})}
						</slay-map-row>
					`
				)}
			</slay-map>
		`
	}
}
