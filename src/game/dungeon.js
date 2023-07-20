import {uuid, shuffle, random as randomBetween} from './utils.js'
import {StartRoom, CampfireRoom} from './dungeon-rooms.js'
import {easyMonsters, monsters, elites, bosses} from '../content/dungeon-encounters.js'
import {emojiFromNodeType} from '../ui/map.js'

/**
 * @typedef {Object} DungeonOptions
 * A procedural generated dungeon map for Slay the Web. Again, heavily inspired by Slay the Spire.
 * @param {number} width how many nodes on each floor
 * @param {number} height how many floors
 * @param {number} minRoom minimum amount of rooms to generate per floor
 * @param {number} maxRoom maximum amount of rooms to generate per floor
 * @param {string} roomTypes a string like "MMCE". Repeat a letter to increase the chance of it appearing. M=Monster, C=Campfire, E=Elite. For example "MMMCE" gives 60% chance of a monster, 20% chance of a campfire and 20% chance of an elite.
 * @param {string} customPaths The "customPaths" argument should be a string of indexes from where to draw the paths, for example "530" would draw three paths. First at index 5, then 3 and finally 0.
 * @returns {object} dungeon {id, graph, paths, x, y, pathTaken}
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
 * An instance of a dungeon
 * @typedef {Object} Dungeon
 * @prop {string} id - a unique id
 * @prop {array} graph
 * @prop {array} paths
 * @prop {number} x - current x position
 * @prop {number} y - current y position
 * @prop {array} pathTaken - a list of nodes we've visited
 *
 */

/**
 * Creates a new dungeon, complete with graph and paths.
 * @param {DungeonOptions} options
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
 * Returns a random item from an array.
 * @param {Array} types
 * @returns {any} a random item from the array
 */
const pick = (types) => shuffle(Array.from(types))[0]

/**
 * Decide which type the node should be #balance
 * @param {string} nodeTypes - a specially formatted string
 * @param {number} floor
 * @returns {string} node type character
 */
function decideNodeType(nodeTypes, floor) {
	let types = nodeTypes
	if (floor < 2) return 'M'
	if (floor < 3) return pick('MC')
	if (floor > 6) return pick('MMEEC')
	return pick(types)
}

/**
 * Decide which (random) room the node's type should be.
 * @param {string} nodeType
 * @param {number} floor
 * @returns {object} room
 */
function decideRoomType(nodeType, floor /*, graph*/) {
	const pickRandomFromObj = (obj) => obj[shuffle(Object.keys(obj))[0]]
	if (floor === 0) return StartRoom()
	if (nodeType === 'C') return CampfireRoom()
	if (nodeType === 'M' && floor < 2) return pickRandomFromObj(easyMonsters)
	if (nodeType === 'M') return pickRandomFromObj(monsters)
	if (nodeType === 'E') return pickRandomFromObj(elites)
	if (nodeType === 'boss') return pickRandomFromObj(bosses)
	throw new Error(`Could not match node type "${nodeType}" with a dungeon room`)
}

/** A map of room types to emojis */
export const roomTypes = {
	start: '👣',
	M: '💀',
	C: '🏕️,🏝️',
	// $: '💰',
	Q: '❓',
	E: '👹',
	boss: '🌋',
}

/**
 * Returns a "graph" array representation of the map we want to render.
 * Each nested array represents a floor with nodes.
 * All nodes have a type.
 * Nodes with type of `false` are filler nodes nededed for the layout.

	graph = [
		[startNode]
		[node, node, node],
		[node, node, node],
		[node, node, node],
		[bossNode]
	]
 * @param {object} options
 * @returns {array} - graph
 */
export function generateGraph(options = {}) {
	options = Object.assign(defaultOptions, options)
	const {height, width, minRooms, maxRooms} = options

	function Node(type) {
		return {id: uuid(), type: type || false, edges: new Set(), room: undefined}
	}

	const graph = []

	// Fill up each floor with nodes.
	for (let floorNumber = 0; floorNumber < height; floorNumber++) {
		const floor = []

		// On each floor, X amount of nodes contain an actual room
		let desiredAmountOfRooms = randomBetween(minRooms, maxRooms)
		if (desiredAmountOfRooms > width) desiredAmountOfRooms = width

		// Create the "room" nodes
		for (let i = 0; i < desiredAmountOfRooms; i++) {
			const nodeType = decideNodeType(options.roomTypes, floorNumber)
			floor.push(Node(nodeType))
		}

		// And fill it up with "empty" nodes.
		while (floor.length < width) {
			floor.push(Node(false))
		}

		// Randomize the order.
		graph.push(shuffle(floor))
	}

	// Finally, add start end end nodes, in this order.
	graph.unshift([Node('start')])
	graph.push([Node('boss')])

	return graph
}

/**
 * Returns an array of possible paths from start to finish.
 * @param {object} graph - dungeon graph
 * @param {string} customPaths - the "customPath" on the `Dungeon` function
 * @returns {array} customPaths a list of paths
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

// Finds a path from start to finish in the graph.
// Pass it an index of the column you'd like the path to follow where possible.
// Returns an array of moves. Each move contains the Y/X coords of the graph.
// Starting node connects to all nodes on the first floor
// End node connects to all nodes on the last floor
// Note, it is Y/X and not X/Y.
// [
// 	[[0, 0], [1,4]], <-- first move.
// 	[[1, 4], [2,1]] <-- second move
// ]
export function findPath(graph, preferredIndex, debug = false) {
	let path = []
	let lastVisited
	if (debug) console.groupCollapsed('finding path', preferredIndex)

	// Look for a free node in the next floor to the right of the "desired index".
	const validNode = (node) => node && Boolean(node.type)

	// Walk through each floor.
	for (let [floorIndex, floor] of graph.entries()) {
		if (debug) console.group(`floor ${floorIndex}`)
		const nextFloor = graph[floorIndex + 1]
		let aIndex = preferredIndex
		let bIndex = preferredIndex

		// If on last floor, stop drawing.
		if (!nextFloor) {
			if (debug) console.log('no next floor, stopping')
			if (debug) console.groupEnd()
			break
		}

		// Find the node we came from.
		let a = lastVisited
		const newAIndex = floor.indexOf(a)
		if (a) {
			if (debug) console.log('changing a index to', newAIndex)
			aIndex = newAIndex
		} else {
			if (debug) console.log('forcing "from" to first node in floor')
			a = floor[0]
			aIndex = 0
		}
		if (!a) throw Error('missing from')

		// Find the node we are going to.
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
		const moveA = [floorIndex, aIndex]
		const moveB = [floorIndex + 1, bIndex]
		path.push([moveA, moveB])
		if (debug) console.groupEnd()
	}

	if (debug) console.groupEnd()
	return path
}

// For debugging purposes, logs a text representation of the map.
export function graphToString(graph) {
	let textGraph = graph.map((floor) =>
		floor.map((node) => {
			if (!node.type) return ' '
			return emojiFromNodeType(node.type)
		})
	)
	const str = textGraph.map((floor) => floor.join('')).join('\n')
	return str
}
