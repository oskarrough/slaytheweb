import {Component, html} from '../web_modules/htm/preact/standalone.module.js'
import {isRoomCompleted, random as randomBetween} from '../game/utils.js'

export default function map(props) {
	const {graph, x, y, pathTaken} = props.dungeon

	return html`
		<div class="MapContainer">
			<h2>Map of the dungeon. Floor ${y}. Node ${x}</h2>
			<${SlayMap}
				dungeon=${props.dungeon}
				graph=${graph}
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

export class SlayMap extends Component {
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
		const nodes = this.base.querySelectorAll('slay-map-node[type]')
		nodes.forEach((node) => {
			node.style.transform = `translate3d(
				${randomBetween(-distance, distance)}%,
				${randomBetween(-distance, distance)}%,
				0)
			`
		})
	}

	// Draws SVG lines between the DOM nodes from the dungeon's path.
	drawPaths() {
		this.props.dungeon.paths.forEach((path, index) => {
			this.drawPath(path, index)
		})
	}

	drawPath(path, preferredIndex) {
		const containerElement = this.base
		const graph = this.state.graph
		const debug = false
		const nodeFromMove = ([row, col]) => graph[row][col]

		if (!containerElement) throw new Error('Missing container element')

		// Create an empty <svg> to hold our path.
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
		svg.id = `path${preferredIndex}`
		svg.classList.add('paths')
		containerElement.appendChild(svg)

		// For each move, add a <line> element from a to b.
		if (debug) console.groupCollapsed('drawing path', preferredIndex)
		path.forEach((move, index) => {
			const a = nodeFromMove(move[0])
			const b = nodeFromMove(move[1])

			if (debug) console.groupEnd()
			// Create a line between each element.
			const aPos = getPosWithin(a.el, containerElement)
			const bPos = getPosWithin(b.el, containerElement)
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

	render(props) {
		const {graph, x, y} = props
		if (!graph) {
			console.log('No graph to render. This should not happen?', graph)
			return
		}
		const edgesFromCurrentNode = graph[y][x].edges
		return html`
			<slay-map>
				${graph.map(
					(row, rowIndex) => html`
						<slay-map-row current=${rowIndex === y}>
							${row.map((node, nodeIndex) => {
								const isCurrent = rowIndex === y && nodeIndex === x
								const canVisit = edgesFromCurrentNode.has(node) && isRoomCompleted(graph[y][x].room)
								return html`<slay-map-node
									type=${Boolean(node.type)}
									current=${isCurrent}
									can-visit=${canVisit}
									did-visit=${node.didVisit}
									onClick=${() => props.onSelect({x: nodeIndex, y: rowIndex})}
									><span>${emojiFromNodeType(node.type)}</span></slay-map-node
								>`
							})}
						</slay-map-row>
					`
				)}
			</slay-map>
		`
	}
}

function emojiFromNodeType(type) {
	const map = {
		start: 'Start',
		M: '💀',
		C: '🏕',
		// $: '💰',
		Q: '❓',
		E: '👹',
		boss: 'Boss',
	}
	return map[type]
}

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
