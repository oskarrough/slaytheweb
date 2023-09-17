/* eslint-disable complexity */
import {uuid, shuffle, random as randomBetween, pick} from '../utils.js'
import {emojiFromNodeType} from '../ui/components/map.js'
import {easyMonsters, monsters, elites, bosses} from '../content/dungeon-encounters.js'
import {StartRoom, CampfireRoom} from './rooms.js'

/**
 * A procedural generated dungeon map for Slay the Web. Again, heavily inspired by Slay the Spire.
 * This is kind of complicated, so let me lay down the vocabulary, starting from the top.
 * A "dungeon" wraps it all together. A navigatable graph with a list of paths.
 * A "graph" is a list of floors.
 * A "path" is a list of moves from one node to another, going from top to bottom.
 * A "floor" is a row (list) of nodes.
 * A "node" is a point on the map
 * A "room" lives on a node, and could be a monster room, a a campfire etc.
 * A "move" y/x coodinates
 */

/** @typedef {import('./cards.js').CARD} Card */
/** @typedef {import('./rooms.js').Room} Room */

/**
 * @typedef {object} MapNode - is a single point on the map. It will either contain a room, or be a filler node.
 * @prop {string} id
 * @prop {MapNodeTypes} type
 * @prop {Room} [room]
 * @prop {Set} edges - a list of node ids that this node connects to
 * @prop {boolean} didVisit - whether you have visited this node or not
 */
/** @typedef {Array<Array<MapNode>>} Graph is a list of floors with nodes*/
/** @typedef {Array<Array<Move>>} Path is a list of moves that describe a path from top to bottom */
/** @typedef {{x: number, y: number}} Position on the map. Y is the floor. X is the node. */
/** @typedef {Array<number, number>} Move also position map, but stored differently */

/**
 * @typedef {object} GraphOptions
 * @prop {number} width how many nodes on each floor
 * @prop {number} height how many floors
 * @prop {number} [minRooms] minimum amount of rooms to generate per floor
 * @prop {number} [maxRooms] maximum amount of rooms to generate per floor
 * @prop {string} [roomTypes] a string like "MMCE". Repeat a letter to increase the chance of it appearing. M=Monster, C=Campfire, E=Elite. For example "MMMCE" gives 60% chance of a monster, 20% chance of a campfire and 20% chance of an elite.
 * @prop {string} [customPaths] a string of indexes (numbers) from where to draw the paths, for example "530" would draw three paths. First at index 5, then 3 and finally 0.
 */

/** @type {GraphOptions} */
const defaultOptions = {
	width: 10,
	height: 6,
	minRooms: 2,
	maxRooms: 5,
	roomTypes: 'MMMCE',
	// customPaths: '123'
}

/**
 * @typedef {object} Dungeon An instance of a dungeon
 * @prop {string} id a unique id
 * @prop {Graph} graph
 * @prop {Array<Path>} paths
 * @prop {number} x current x position
 * @prop {number} y current y position
 * @prop {Array<Position>} pathTaken a list of moves we've taken
 */

/**
 * Creates a new dungeon, complete with graph and paths.
 * @param {GraphOptions} [options]
 * @returns {Dungeon}
 */
export default function Dungeon(options) {
	options = Object.assign(defaultOptions, options)

	const graph = generateGraph(options)
	const paths = generatePaths(graph, options.customPaths)

	// Add "room" to all valid node in the graph.
	graph.forEach((floor, floorNumber) => {
		floor.map((node) => {
			if (node.type) {
				node.room = decideRoomType(node.type, floorNumber)
			}
		})
	})

	return {
		id: uuid(),
		graph,
		paths,
		x: 0,
		y: 0,
		pathTaken: [{x: 0, y: 0}],
	}
}

/**
 * Returns a "graph" array representation of the map we want to render.
 * Each nested array represents a floor with nodes.
 * All nodes have a type.
 * Nodes with type of `false` are filler nodes nededed for the layout.
	```
	graph = [
		[startNode]
		[node, node, node],
		[node, node, node],
		[node, node, node],
		[bossNode]
	]
	```
 * @param {GraphOptions} [options]
 * @returns {Graph}
 */
export function generateGraph(options) {
	options = Object.assign(defaultOptions, options || {})
	const {width, height, minRooms, maxRooms, roomTypes} = options

	const graph = []

	// Fill up each floor with nodes.
	for (let floorNumber = 0; floorNumber < height; floorNumber++) {
		const floor = []

		// On each floor, X amount of nodes contain an actual room
		let desiredAmountOfRooms = randomBetween(minRooms, maxRooms)
		if (desiredAmountOfRooms > width) desiredAmountOfRooms = width

		// Create the "room" nodes
		for (let i = 0; i < desiredAmountOfRooms; i++) {
			const nodeType = decideNodeType(roomTypes, floorNumber)
			floor.push(createMapNode(nodeType))
		}

		// And fill it up with "empty" nodes.
		while (floor.length < width) {
			floor.push(createMapNode())
		}

		// Randomize the order.
		graph.push(shuffle(floor))
	}

	// Finally, add start end end nodes, in this order.
	graph.unshift([createMapNode('start')])
	graph.push([createMapNode('boss')])

	return graph
}

/**
 * Returns an array of possible paths from start to finish.
 * @param {Graph} graph - dungeon graph
 * @param {string} customPaths
 * @returns {Array<Path>} customPaths a list of paths
 */
export function generatePaths(graph, customPaths) {
	const paths = []

	if (customPaths) {
		Array.from(customPaths).forEach((value) => {
			const path = findPath(graph, Number(value))
			paths.push(path)
		})
	} else {
		// Otherwise draw a path for each column.
		graph[1].forEach((column, index) => {
			const path = findPath(graph, index)
			paths.push(path)
		})
	}

	return paths
}

/**
 * Ensures it's not a filler node
 * @param {MapNode} node
 * @returns {boolean}
 */
function validNode(node) {
	return node && Boolean(node.type)
}

/**
 * Finds a path from start to finish in the graph.
 * Starting node connects to all nodes on the first floor
 * End node connects to all nodes on the last floor
 * It is Y/X, not X/Y (think floor/room, not room/floor)
 * [
 * [[0, 0], [1,4]], <-- first move is from 0,0 to 1,4
 * [[1, 4], [2,1]] <-- second move is from 1,4 to 2,1
 *]
 * @param {Graph} graph
 * @param {number} preferredIndex the column you'd like the path to follow where possible
 * @param {boolean} debug if true, logs to console
 * @returns {Path} an array of moves. Each move contains the Y/X coords of the graph.
 */
function findPath(graph, preferredIndex, debug = false) {
	if (debug) console.groupCollapsed('finding path', preferredIndex)

	let path = []
	/** @type {MapNode|false} */
	let lastVisited = false

	// Walk through each floor.
	for (let [floorIndex, floor] of graph.entries()) {
		if (debug) console.group(`floor ${floorIndex}`)

		// If on last floor, stop moving.
		const nextFloor = graph[floorIndex + 1]
		if (!nextFloor) {
			if (debug) console.log('no next floor, stopping')
			if (debug) console.groupEnd()
			break
		}

		// Find the "a" node we came FROM.
		const aIndex = lastVisited ? floor.indexOf(lastVisited) : 0
		const moveFrom = [floorIndex, aIndex]
		if (debug) console.log('setting from', moveFrom)

		// Find the "b" node we are going TO.
		const bInfo =
			searchValidNode(nextFloor, preferredIndex, 'forward') ||
			searchValidNode(nextFloor, preferredIndex, 'backward')
		if (!bInfo) throw Error('failed to find node to move to')
		const moveTo = [floorIndex + 1, bInfo.index]
		// Store it for later
		lastVisited = bInfo.node

		const move = [moveFrom, moveTo]
		path.push(move)

		if (debug) {
			console.log(`added move to path ${moveFrom} to ${moveTo}`)
			console.groupEnd()
		}
	}

	storePathOnGraph(graph, path)

	if (debug) console.groupEnd()

	return path
}

/**
 * Searches for the first valid node in a direction
 * @param {Array<MapNode>} floor
 * @param {number} startX - the index to start search from
 * @param {string} direction must be "forward" or "backward"
 * @returns {{node: MapNode, index: number}|null}
 */
function searchValidNode(floor, startX, direction) {
	const step = direction === 'forward' ? 1 : -1
	if (direction === 'forward') {
		for (let i = startX; i >= 0 && i < floor.length; i += step) {
			let node = floor[i]
			if (validNode(node)) {
				return {node, index: i}
			}
		}
	} else {
		for (let i = startX; i >= 0; i += step) {
			let node = floor[i]
			if (validNode(node)) {
				return {node, index: i}
			}
		}
	}
	return null
}

/**
 * For debugging purposes, creates a multi-line text representation of the map.
 * @param {Graph} graph
 * @returns {string}
 */
export function graphToString(graph) {
	let textGraph = graph.map((floor) =>
		floor.map((node) => {
			return emojiFromNodeType(node.type)
		}),
	)
	const str = textGraph.map((floor) => floor.join('')).join('\n')
	return str
}

/**
 * Stores a path directly on a graph
 * @param {Graph} graph
 * @param {Path} path
 * @returns {Graph}
 */
function storePathOnGraph(graph, path) {
	path.forEach((move) => {
		const a = nodeFromMove(graph, move[0])
		const b = nodeFromMove(graph, move[1])
		a.edges.add(b.id)
	})
	return graph
}

/**
 * @param {Graph} graph
 * @param {Move} move
 * @returns {MapNode}
 */
function nodeFromMove(graph, [floor, node]) {
	return graph[floor][node]
}

/** @enum {string} different type of nodes and their emoji equivalents */
export const MapNodeTypes = {
	start: '👣',
	M: '💀',
	C: '🏕️',
	// $: '💰'
	Q: '❓',
	E: '👹',
	boss: '🌋',
}

/**
 * A node in the dungeon map graph
 * @param {MapNodeTypes} [type] - a string key to represent the type of room
 * @returns {MapNode}
 */
function createMapNode(type) {
	return {
		id: uuid(),
		type: type,
		room: undefined,
		edges: new Set(),
		didVisit: false,
	}
}

/**
 * The type of node is decided by the floor number and the room types.
 * @param {MapNodeTypes} nodeTypes - a string of possible node types
 * @param {number} [floor] - useful for balance e.g. more monsters on higher floors
 * @returns {string} a single character representing the node type
 */
function decideNodeType(nodeTypes, floor) {
	if (floor < 2) return 'M'
	if (floor < 3) return pick('MC')
	if (floor > 6) return pick('MMEEC')
	return pick(nodeTypes)
}

/**
 * Create a room from the node's type
 * @param {string} type
 * @param {number} floor
 * @returns {Room}
 */
export function decideRoomType(type, floor) {
	const pickRandomFromObj = (obj) => obj[shuffle(Object.keys(obj))[0]]
	if (floor === 0) return StartRoom()
	if (type === 'C') return CampfireRoom()
	if (type === 'M' && floor < 2) return pickRandomFromObj(easyMonsters)
	if (type === 'M') return pickRandomFromObj(monsters)
	if (type === 'E') return pickRandomFromObj(elites)
	if (type === 'boss') return pickRandomFromObj(bosses)
	throw new Error(`Could not match node type "${type}" with a dungeon room`)
}
