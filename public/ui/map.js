import {Component, html} from '../web_modules/htm/preact/standalone.module.js'
import {findPath, drawPath, findAndDrawPath} from '../game/map.js'
import {random as randomBetween} from '../game/utils.js'

export default function map(props) {
	const {graph, x, y, paths, pathTaken} = props.dungeon

	return html`
		<div class="MapContainer">
			<h2>Map of the dungeon. Level ${y}. Node ${x}</h2>
			<${Mapo}
				dungeon=${props.dungeon}
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
		this.setState({graph: this.addElementsToGraph(this.props.graph)})
	}

	componentDidUpdate(prevProps) {
		// Let CSS know about the amount of rows and cols we have.
		this.base.style.setProperty('--rows', Number(prevProps.graph.length))
		this.base.style.setProperty('--columns', Number(prevProps.graph[1].length))

		// Add references to our DOM elements on the graph. Why?
		// no set state because we don't want to rerender
		if (!this.didDrawPaths) {
			const el = this.props.graph[0][0].el
			console.log('Did update: doing heavy work', Boolean(el))
			this.scatter()
			this.drawPaths()
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

	drawPaths() {
		const graph = this.state.graph
		// Sneaky but to control how many paths are rendered, you can pass a string "1" or "123",
		// and it'll draw paths on those columns only.
		this.props.dungeon.paths.forEach((path, index) => {
			drawPath(graph, path, this.base, index)
		})
	}

	render(props) {
		const {graph, x, y, pathTaken} = props
		if (!graph) {
			console.log('No graph to render. This should not happen?', graph)
			return
		}
		console.log('Rendering dungeon graph', pathTaken)
		const edges = graph[y][x].edges

		return html`
			<slay-map>
				${graph.map(
					(row, rowIndex) => html`
						<slay-map-row current=${rowIndex === y}>
							${row.map((node, nodeIndex) => {
								const isCurrent = rowIndex === y && nodeIndex === x
								const canVisit = edges.has(node)
								return html`<slay-map-node
									encounter=${Boolean(node.type)}
									current=${isCurrent}
									can-visit=${canVisit}
									did-visit=${node.didVisit}
									onClick=${() => props.onSelect({x: nodeIndex, y: rowIndex})}
									><span>${node.type}</span></slay-map-node
								>`
							})}
						</slay-map-row>
					`
				)}
			</slay-map>
		`
	}
}
