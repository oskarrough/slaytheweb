/* eslint-disable complexity */
import {uuid, shuffle, random as randomBetween, pick} from './utils.js'
import {StartRoom, CampfireRoom} from './dungeon-rooms.js'
import {easyMonsters, monsters, elites, bosses} from '../content/dungeon-encounters.js'
import {emojiFromNodeType} from '../ui/map.js'

/**
 * A procedural generated dungeon map for Slay the Web. Again, heavily inspired by Slay the Spire.
	* This is kind of complicated, so let me lay down the vocabulary:

	* A "room" could be a "start room", monster encounter, a campfire, a treasure chest, a shop, etc.
	* A "node" is a single point on the map. It can contain a room, or just a filler node.
	* A "floor" is a row (list) of nodes.
	* A "graph" is a list of floors.
	* A "move" is a list of two nodes, the "from" and the "to".
	* A "path" is a list of moves from one node to another.
	* A "dungeon" is a navigatable graph with a list of paths
	*
 */

/** @typedef {import('./dungeon-rooms.js').Room} Room */
/** @typedef {{id: string, type?: string, edges: Set, room?: object}} MapNode */
/** @typedef {Array<Array<MapNode>>} Graph */
/** @typedef {{x: number, y: number}} Move */

/**
 * @typedef {Object} GraphOptions
 * @param {number} width how many nodes on each floor
 * @param {number} height how many floors
 * @param {number} minRoom minimum amount of rooms to generate per floor
 * @param {number} maxRoom maximum amount of rooms to generate per floor
 * @param {string} roomTypes a string like "MMCE". Repeat a letter to increase the chance of it appearing. M=Monster, C=Campfire, E=Elite. For example "MMMCE" gives 60% chance of a monster, 20% chance of a campfire and 20% chance of an elite.
 * @param {string} customPaths a string of indexes (numbers) from where to draw the paths, for example "530" would draw three paths. First at index 5, then 3 and finally 0.
 */

/**
 * @typedef {Object} Dungeon An instance of a dungeon
 * @prop {string} id a unique id
 * @prop {Graph} graph
 * @prop {array} paths
 * @prop {number} x current x position
 * @prop {number} y current y position
 * @prop {Array<Move>} pathTaken a list of moves we've taken
 */

const defaultOptions = {
	width: 10,
	height: 6,
	minRooms: 2,
	maxRooms: 5,
	roomTypes: 'MMMCE',
	// customPaths: '123'
}

/**
 * Creates a new dungeon, complete with graph and paths.
 * @param {GraphOptions} [options]
 * @returns {Dungeon}
 */
export default function Dungeon(options) {
	options = Object.assign(defaultOptions, options)

	const graph = generateGraph(options)
	const paths = generatePaths(graph, options.customPaths)

	// Add ".edges" to each node from the paths, so we know which connections it has.
	// Would be cool if this was part of "generatePaths".
	const nodeFromMove = ([floor, node]) => graph[floor][node]
	paths.forEach((path) => {
		path.forEach((move) => {
			const a = nodeFromMove(move[0])
			const b = nodeFromMove(move[1])
			// a.edges.add(b)
			a.edges.add(b.id)
		})
	})

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
 * The type of node is decided by the floor number and the room types.
 * @param {string} nodeTypes - a string of possible node types
 * @param {number} floor
 * @returns {string} a single character representing the node type
 */
function decideNodeType(nodeTypes, floor) {
	let types = nodeTypes
	if (floor < 2) return 'M'
	if (floor < 3) return pick('MC')
	if (floor > 6) return pick('MMEEC')
	return pick(types)
}

/**
 * Create a room from the node's type
 * @param {string} type
 * @param {number} floor
 * @returns {Room}
 */
function decideRoomType(type, floor) {
	const pickRandomFromObj = (obj) => obj[shuffle(Object.keys(obj))[0]]
	if (floor === 0) return StartRoom()
	if (type === 'C') return CampfireRoom()
	if (type === 'M' && floor < 2) return pickRandomFromObj(easyMonsters)
	if (type === 'M') return pickRandomFromObj(monsters)
	if (type === 'E') return pickRandomFromObj(elites)
	if (type === 'boss') return pickRandomFromObj(bosses)
	throw new Error(`Could not match node type "${type}" with a dungeon room`)
}

/**
 * A node in the dungeon map graph
 * @param {string} [nodeType] - a string key to represent the type of room
 * @returns {MapNode}
 */
function createMapNode(nodeType) {
	return {id: uuid(), type: nodeType, edges: new Set(), room: undefined}
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
export function generateGraph(options = {}) {
	options = Object.assign(defaultOptions, options)
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
 * @typedef {Array<Array<Array<number, number>>>} Path
 */

/**
 * Finds a path from start to finish in the graph.
* @param {Graph} graph
* @param {number} preferredIndex the column you'd like the path to follow where possible
* @param {boolean} debug if true, logs to console
* @returns {Path} an array of moves. Each move contains the Y/X coords of the graph.

 Starting node connects to all nodes on the first floor
 End node connects to all nodes on the last floor

 It is Y/X, not X/Y (think floor/room, not room/floor)

 [
 	[[0, 0], [1,4]], <-- first move is from 0,0 to 1,4
 	[[1, 4], [2,1]] <-- second move is from 1,4 to 2,1
 ]
 */
export function findPath(graph, preferredIndex, debug = false) {
	let path = []
	let lastVisited
	if (debug) console.groupCollapsed('finding path', preferredIndex)

	// Look for a free node in the next floor to the right of the "desired index".
	const validNode = (node) => node && Boolean(node.type)

	// Walk through each floor.
	for (let [floorIndex, floor] of graph.entries()) {
		if (debug) console.group(`floor ${floorIndex}`)
		// If on last floor, stop drawing.
		const nextFloor = graph[floorIndex + 1]
		if (!nextFloor) {
			if (debug) console.log('no next floor, stopping')
			if (debug) console.groupEnd()
			break
		}

		let aIndex = preferredIndex
		let bIndex = preferredIndex

		// Find the node we came FROM.
		let a = lastVisited
		const newAIndex = floor.indexOf(a)
		if (a) {
			if (debug) console.log('changing a index to', newAIndex)
			aIndex = newAIndex
		} else {
			// Or start from 0,0
			if (debug) console.log('forcing "from" to first node in floor')
			a = floor[0]
			aIndex = 0
		}
		if (!a) throw Error('missing from')

		// Find the node we are going TO.
		// Search to the right of our index.
		let b
		for (let i = bIndex; i < nextFloor.length; i++) {
			if (debug) console.log('searching forwards', i)
			let node = nextFloor[i]
			if (validNode(node)) {
				if (debug) console.log('choosing', i)
				b = node
				bIndex = i
				break
			}
		}
		// No result? Search to the left instead.
		if (!b) {
			for (let i = bIndex; i >= 0; i--) {
				if (debug) console.log('searching backwards', i)
				let node = nextFloor[i]
				if (validNode(node)) {
					if (debug) console.log('choosing', i)
					b = node
					bIndex = i
					break
				}
			}
			if (!b) throw Error('missing to')
		}
		lastVisited = b

		if (debug) console.log(`connected floor ${floorIndex}:${aIndex} to ${floorIndex + 1}:${bIndex}`)
		const moveFrom = [floorIndex, aIndex]
		const moveTo = [floorIndex + 1, bIndex]
		path.push([moveFrom, moveTo])
		if (debug) console.groupEnd()
	}

	if (debug) console.groupEnd()

	return path
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
		})
	)
	const str = textGraph.map((floor) => floor.join('')).join('\n')
	return str
}
