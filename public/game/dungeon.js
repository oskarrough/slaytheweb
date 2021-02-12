import {uuid} from './utils.js'
import {shuffle, random as randomBetween} from './utils.js'
import {monsters} from '../content/dungeon-encounters.js'
import {StartRoom, MonsterRoom, CampfireRoom, BossRoom, Monster} from './dungeon-rooms.js'

/*
 * A procedural generated map for Slay the Web.
 * again, heavily inspired by Slay the Spire.
 *
 * What are the rules?
 *
 * 1. Starting node connects to all nodes on the first row
 * 2. End node connects to all nodes on the last row
 * 3. The graph can have a variable number of rows and columns
 * 4. Each row has a random number of encounters from 2 to 5
 * 5. Each row has six columns
 * 6. Encounters are randomized in a row
 * */

const defaultOptions = {
	// Map size
	rows: 10,
	columns: 6,
	// How many encounters do you want per row?
	minEncounters: 2,
	maxEncounters: 5,
	// types of encounters. duplicate them to increase chance
	// M Monster, C Campfire, E Elite
	encounters: 'MMMCE',
	// customPaths: '123'
}

// A dungeon is where the adventure starts.
export default function Dungeon(options = {}) {
	const graph = generateGraph(options)
	const paths = generatePaths(graph, options.customPaths)

	// Add ".edges" to each node from the paths, so we know which connections it has.
	// Would be cool if this was part of "generatePaths".
	const nodeFromMove = ([row, col]) => graph[row][col]
	paths.forEach((path) => {
		path.forEach((move) => {
			const a = nodeFromMove(move[0])
			const b = nodeFromMove(move[1])
			a.edges.add(b)
		})
	})

	// Add "room" to all valid node in the graph.
	graph.forEach((row, level) => {
		row.map((node) => {
			if (node.type) {
				node.room = createRandomRoom(node.type, level, graph)
			}
		})
	})

	return {
		id: uuid(),
		x: 0,
		y: 0,
		pathTaken: [{x: 0, y: 0}],
		graph,
		paths,
	}
}

// Decide which type the node should be.
function decideEncounterType(encounters, y /*, graph*/) {
	const pick = (types) => shuffle(Array.from(types))[0]
	if (y < 2) return pick('MMME')
	if (y < 3) return pick('MMMMEC')
	if (y < 4) return pick('MMCCMME')
	if (y < 5) return pick('MMCCMME')
	if (y < 6) return pick('MMCMMEE')
	if (y < 7) return pick('MCEE')
	if (y < 8) return pick('MMEEC')
	if (y < 9) return pick('MMEEC')
	return pick(encounters)
}

// Decide which (random) room the node's type should be.
function createRandomRoom(type, level, graph) {
	if (level === 0) return StartRoom()
	if (level === graph.length - 1) return BossRoom()
	// if (type === 'M' && level < 5) return randomEasyMonster()
	if (type === 'M') return monsters[shuffle(Object.keys(monsters))[0]]
	if (type === 'E') return MonsterRoom(Monster({intents: [{damage: 10}, {block: 5}], hp: 30}))
	if (type === 'C') return CampfireRoom()
	throw new Error(`Could not match node type ${type} with a dungeon room`)
}

function Node(type = false) {
	return {type, edges: new Set(), room: undefined}
}

// Returns a "graph" of the map we want to render,
// using nested arrays for the rows and columns.
export function generateGraph(props) {
	const graph = []
	const options = Object.assign(defaultOptions, props)

	for (let r = 0; r < options.rows; r++) {
		const row = []

		// In each row we want from X encounters.
		let amountOfEncounters = randomBetween(options.minEncounters, options.maxEncounters)
		if (amountOfEncounters > options.columns) amountOfEncounters = options.columns
		for (let i = 0; i < amountOfEncounters; i++) {
			row.push(Node(decideEncounterType(options.encounters, r, graph)))
		}

		// Fill empty columns.
		while (row.length < options.columns) {
			row.push(Node())
		}

		// Randomize the order.
		graph.push(shuffle(row))
	}

	// Add start end end nodes, in this order.
	graph.push([Node('boss')]) // end
	graph.unshift([Node('start')]) // start

	return graph
}

// Returns an array of possible paths from start to finish.
export function generatePaths(graph, customPaths) {
	const paths = []
	// The "customPaths" argument should be a string of indexes from where to draw the paths,
	// For example "530" would draw three paths. First at index 5, then 3 and finally 0.
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
// Set the index to the column you'd like to follow where possible.
// Returns a nested array of the row/column indexes of the graph nodes.
// [
// 	[[0, 0], [1,4]], <-- first move.
// 	[[1, 4], [2,1]] <-- second move
// ]
export function findPath(graph, preferredIndex, debug = false) {
	let path = []
	let lastVisited
	if (debug) console.groupCollapsed('finding path', preferredIndex)

	// Look for a free node in the next row to the right of the "desired index".
	const isEncounter = (node) => node && Boolean(node.type)

	// Walk through each row.
	for (let [rowIndex, row] of graph.entries()) {
		if (debug) console.group(`row ${rowIndex}`)
		const nextRow = graph[rowIndex + 1]
		let aIndex = preferredIndex
		let bIndex = preferredIndex

		// If on last level, stop drawing.
		if (!nextRow) {
			if (debug) console.log('no next row, stopping')
			if (debug) console.groupEnd()
			break
		}

		// Find the node we came from.
		let a = lastVisited
		const newAIndex = row.indexOf(a)
		if (a) {
			if (debug) console.log('changing a index to', newAIndex)
			aIndex = newAIndex
		} else {
			if (debug) console.log('forcing "from" to first node in row')
			a = row[0]
			aIndex = 0
		}
		if (!a) throw Error('missing from')

		// Find the node we are going to.
		// Search to the right of our index.
		let b
		for (let i = bIndex; i < nextRow.length; i++) {
			if (debug) console.log('forwards', i)
			let node = nextRow[i]
			if (isEncounter(node)) {
				if (debug) console.log('choosing', i)
				b = node
				bIndex = i
				break
			}
		}
		// No result? Search to the left instead.
		if (!b) {
			for (let i = bIndex; i >= 0; i--) {
				if (debug) console.log('backwards', i)
				let node = nextRow[i]
				if (isEncounter(node)) {
					if (debug) console.log('choosing', i)
					b = node
					bIndex = i
					break
				}
			}
			if (!b) throw Error('missing to')
		}
		lastVisited = b

		if (debug) console.log(`connected row ${rowIndex}:${aIndex} to ${rowIndex + 1}:${bIndex}`)
		const moveA = [rowIndex, aIndex]
		const moveB = [rowIndex + 1, bIndex]
		path.push([moveA, moveB])
		if (debug) console.groupEnd()
	}

	if (debug) console.groupEnd()
	return path
}

// For debugging purposes, logs a text representation of the map.
export function graphToString(graph) {
	graph.forEach((row, level) => {
		let str = `${String(level).padStart(2, '0')}   `
		row.forEach((node) => {
			if (!node.type) {
				str = str + ' '
			} else {
				str = str + node.type
			}
		})
		console.log(str)
	})
}
