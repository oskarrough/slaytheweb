import {emojiFromNodeType, nodeTypeToName} from '../../game/dungeon.js'
import {isRoomCompleted} from '../../game/utils-state.js'
import {debounce, random as randomBetween} from '../../utils.js'
import {Component, html} from '../lib.js'

/**
 * Renders a map of the dungeon. A visual representation of the dungeon progress. Players select rooms to visit. Shows available paths and room types.
 * @param {object} props
 * @param {object} props.dungeon
 * @param {number} props.x - starting column
 * @param {number} props.y - starting row
 * @param {number} props.scatter - whether to visually move the nodes randomly a bit
 * @param {Function} props.onSelect - function called on map node select
 * @param {boolean} props.debug - if true, will console.log things
 * @param {boolean} props.freeNavigation - if true, allows clicking any node regardless of connections
 */
export class SlayMap extends Component {
	constructor(props) {
		super()
		this.didDrawPaths = false
		this.debug = props.debug
		// this.drawPathsThrottled = throttle(this.drawPaths.bind(this), 500)
	}

	componentDidMount() {
		this.drawPathsDebounced = debounce(this.drawPaths.bind(this), 300, {leading: true, trailing: true})
		// trigger update..
		this.setState({universe: 42})
	}

	componentDidUpdate(prevProps) {
		const newDungeon = this.props.dungeon.id !== prevProps?.dungeon.id
		const scatterChanged = this.props.scatter !== prevProps?.scatter

		// Redraw paths when dungeon changes or first render
		if (newDungeon || !this.didDrawPaths) {
			this.drawPathsDebounced()
			this.scatterNodes()
		}

		// Reapply scatter when slider changes
		if (scatterChanged && this.didDrawPaths) {
			this.scatterNodes()
			this.drawPathsDebounced()
		}

		// Set up resize observer once
		if (!this.resizeObserver) {
			this.resizeObserver = new ResizeObserver(() => {
				this.drawPathsDebounced()
			})
			this.resizeObserver.observe(this.base)
		}
	}

	// Shake the positions up a bit.
	scatterNodes() {
		const distance = Number(this.props.scatter)
		if (!distance) return
		if (this.debug) console.log('scattering map nodes with a type')
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
	// This is heavy work, don't do it on every render
	drawPaths() {
		if (this.debug) console.time('drawPaths')
		if (this.debug) console.groupCollapsed(`drawing ${this.props.dungeon.paths.length} paths`)

		const existingPaths = this.base?.querySelectorAll(`svg.paths`) || []
		for (const p of existingPaths) {
			p.remove()
		}

		this.props.dungeon.paths.forEach((path, index) => {
			this.drawPath(path, index)
		})

		this.didDrawPaths = true

		if (this.debug) console.groupEnd()
		if (this.debug) console.timeEnd('drawPaths')
	}

	/**
	 * Draw an svg path on a certain (column/x) index.
	 * @param {Array<object>} path
	 * @param {number} preferredIndex
	 */
	drawPath(path, preferredIndex) {
		const graph = this.props.dungeon.graph
		const containerElement = this.base
		const debug = this.debug

		const nodeFromMove = ([row, col]) => graph[row][col]
		const elFromNode = ([row, col]) => containerElement.childNodes[row].childNodes[col]

		if (!containerElement) throw new Error('Missing container element')

		// Create an empty <svg> to hold our path. And remove previous if we are drawing agian.
		const id = `path${preferredIndex}`
		let svg = containerElement.querySelector(`svg#${id}`)
		if (svg) svg.remove()
		svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
		svg.id = id
		svg.classList.add('paths')
		containerElement.appendChild(svg)

		if (debug) console.groupCollapsed(`drawing path on x${preferredIndex}`, path)

		// For each move, add a <line> element from a to b.
		path.forEach((move, index) => {
			const a = nodeFromMove(move[0])
			const b = nodeFromMove(move[1])
			const aEl = elFromNode(move[0])
			const bEl = elFromNode(move[1])

			// Create a line between each element.
			const aPos = getPosWithin(aEl, containerElement)
			const bPos = getPosWithin(bEl, containerElement)
			if (!aPos.top) {
				throw Error("Could not render the svg path. Is the graph's container element rendered/visible?")
			}
			const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
			line.setAttribute('x1', String(aPos.left + aPos.width / 2))
			line.setAttribute('y1', String(aPos.top + aPos.height / 2))
			line.setAttribute('x2', String(bPos.left + bPos.width / 2))
			line.setAttribute('y2', String(bPos.top + bPos.height / 2))
			svg.appendChild(line)
			line.setAttribute('length', String(line.getTotalLength()))

			aEl.setAttribute('linked', true)
			bEl.setAttribute('linked', true)

			if (debug) console.log(`Move ${index}`, {from: a, to: b})
		})

		if (debug) console.groupEnd()
	}

	nodeSelect({x, y}) {
		if (this.debug) console.log('nodeSelect', {x, y})
		this.props.onSelect({x, y})
		// this.dispatchEvent(new CustomEvent('node-select', {detail: {x, y}}))
	}

	render(props) {
		const {dungeon, x, y, freeNavigation} = props
		if (!dungeon.graph) throw new Error('No graph to render. This should not happen?', dungeon)

		const currentNode = dungeon.graph[y][x]

		return html`
			<slay-map class=${this.debug ? 'debug' : ''} style=${{
				'--rows': dungeon.graph.length,
				'--columns': dungeon.graph[1].length,
			}}>
				${dungeon.graph.map(
					(row, rowIndex) => html`
						<slay-map-row current=${rowIndex === y}>
							${row.map((node, nodeIndex) => {
								const isCurrent = rowIndex === y && nodeIndex === x
								const isConnected = currentNode.edges.has(node.id)
								const completedCurrentRoom = isRoomCompleted(dungeon.graph[y][x].room)
								const canVisit = freeNavigation ? Boolean(node.type) : isConnected && completedCurrentRoom
								return html`<slay-map-node
									key=${`${rowIndex}${nodeIndex}`}
									type=${Boolean(node.type)}
									node-type=${node.type}
									current=${isCurrent}
									can-visit=${Boolean(canVisit)}
									did-visit=${node.didVisit}
									onClick=${() => this.nodeSelect({x: nodeIndex, y: rowIndex})}
									title=${nodeTypeToName(node.type)}
								>
									<span>${emojiFromNodeType(node.type)}</span>
								</slay-map-node>`
							})}
						</slay-map-row>
					`,
				)}
			</slay-map>
		`
	}
}

// Since el.offsetLeft doesn't respect CSS transforms,
// and getBounding.. is relative to viewport, not parent, we need this utility.
/**
 *
 * @param {HTMLElement} el
 * @param {HTMLElement} container
 */
function getPosWithin(el, container) {
	if (!el) throw new Error('Could not find DOM node for graph row node')
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

// resizeObserver.unobserve(element)
