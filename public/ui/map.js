import {Component, html, useState} from '../../web_modules/htm/preact/standalone.module.js'
import {generateGraph, findAndDrawPath} from '../game/map.js'
import {random as randomBetween} from '../game/utils.js'

function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

export default function map({dungeon}) {
	const [level, setLevel] = useState(0)

	// function dungeonToGraph(dungeon) {
	// 	return generateGraph({
	// 		rows: dungeon.rooms.length,
	// 		columns: 1,
	// 		encounters: 'mmmmc',
	// 	})
	// }
	// const graph = dungeonToGraph(dungeon)
	// debugger

	function handleMove(x, y, node) {
		console.log(y, x, node)
		setLevel(y)
	}

	return html`
		<h2>Map of the dungeon. Level ${level}</h2>
		<${Mapo}
			rows=${dungeon.rooms.length}
			columns=${6}
			encounters="💀💀💀💀🦚"
			minEncounters=${2}
			maxEncounters=${5}
			paths="ab"
			onSelect=${handleMove}
		><//>
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

export class Mapo extends Component {
	componentDidMount() {
		console.log('Did mount')
		const props = this.props
		const graph = generateGraph({
			encounters: props.encounters,
			rows: Number(props.rows),
			columns: Number(props.columns),
			minEncounters: Number(props.minEncounters),
			maxEncounters: Number(props.maxEncounters),
		})
		this.setState({graph})
	}
	componentWillUpdate() {
		console.log('Will update')
	}
	componentDidUpdate(prevProps) {
		console.log('Did update')

		// Let CSS know about the amount of rows and cols we have.
		this.base.style.setProperty('--rows', Number(prevProps.rows))
		this.base.style.setProperty('--columns', Number(prevProps.columns))

		// Add references to our DOM elements on the graph. Why?
		// no set state because we don't want to rerender
		if (!this.didDrawPaths) {
			this.scatter()
			this.state.graph = this.addElementsToGraph(this.state.graph)
			this.drawPaths(this.state.graph)
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
		// Sneaky but to control how many paths are rendered, you can pass a string "abc",
		// where the length of the string equals the amount of paths.
		if (paths) {
			Array.from(paths).forEach((value, pathIndex) => {
				findAndDrawPath(graph, this.base, pathIndex)
			})
		} else {
			// Draw a path for each col in row1, which connects to start.
			console.time('mapRender')
			graph[1].forEach((column, index) => {
				setTimeout(() => {
					findAndDrawPath(graph, this.base, index)
				}, index * 100)
			})
			console.timeEnd('mapRender')
		}
	}

	selectedNode(y, x) {
		const node = this.state.graph[y][x]
		this.props.onSelect(x, y, node)
	}

	render(props, state) {
		const {graph} = state
		if (!graph) return
		console.log('Rendering graph', graph)
		return html`
			<slay-map data-x=${state.x} data-y=${state.y}>
				${state.graph.map(
					(row, rowIndex) => html`
						<slay-map-row>
							${row.map((col, colIndex) => {
								if (col.type) {
									return html`<slay-map-node
										encounter
										onClick=${() => this.selectedNode(rowIndex, colIndex)}
										>${col.type}</slay-map-node
									>`
								}
								return html`<slay-map-node></slay-map-node>`
							})}
						</slay-map-row>
					`
				)}
			</slay-map>
		`
	}
}
