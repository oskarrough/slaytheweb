import test from 'ava'
import {generateGraph, generatePaths, graphToString} from '../src/game/dungeon.js'
import {roomTypes} from '../src/game/dungeon-rooms.js'

test('graph is created with default options', (t) => {
	let g = generateGraph()
	t.is(g.length, 8)
	t.is(g[1].length, 10)
})

test('can customize graph size with height and width', (t) => {
	let g = generateGraph({height: 3, width: 10})
	t.is(g.length, 5, 'plus two because of start+end')
	t.is(g[1].length, 10, 'amount of nodes on each floor')
	g = generateGraph({height: 2, width: 6})
	t.is(g.length, 4, 'height match (incl. start+end)')
	t.is(g[1].length, 6, 'width match')
})

test('all height except first+last have between 2-5 rooms', (t) => {
	let g = generateGraph({height: 10, width: 6})
	// t.plan(8)
	g.forEach((row, index) => {
		if (index === 0 || index === g.length - 1) return
		t.is(row.length, 6, 'all cols are same length')
		t.true(row.filter((n) => n.type).length > 1, 'have at least 2 rooms in each row')
		t.true(row.filter((n) => n.type).length < 6, 'have max 5 rooms in each row')
	})
})

test('can control room frequency', (t) => {
	let g = generateGraph({width: 10, minRooms: 10, maxRooms: 10})
	g.forEach((row, index) => {
		if (index === 0 || index === g.length - 1) return
		t.is(row.filter((n) => n.type).length, 10)
	})
})

test('it respects the cols options', (t) => {
	let g = generateGraph({width: 5, minRooms: 6, maxRooms: 10})
	g.forEach((row, index) => {
		if (index === 0 || index === g.length - 1) return
		t.is(row.filter((n) => n.type).length, 5)
	})
})

// You can't customize atm. because it's hardcoded in decideNodeType()
test.skip('can customize the type of rooms', (t) => {
	const roomTypes = '!#$'
	const g = generateGraph({roomTypes})
	g.forEach((row, index) => {
		if (index === 0 || index === g.length - 1) return
		row
			.filter((n) => n.type)
			.forEach((node) => {
				if (index > 2) {
					t.true(roomTypes.includes(node.type))
				}
			})
	})
})

test('string graph works', (t) => {
	const width = 5
	const height = 8

	const g = generateGraph({width: width, height: height})
	t.is(g.length, height + 2)
	t.is(g[1].length, width)

	const str = graphToString(g)
	t.is(typeof str, 'string')
	t.true(str.includes(roomTypes.M))
	t.true(str.includes(roomTypes.start))
	t.true(str.includes(roomTypes.boss))
	// console.log(str)
})

test('can draw a path', (t) => {
	const g = generateGraph({width: 3, height: 3})
	const paths = generatePaths(g, '12')
	// console.log(paths[0], paths[1])
	t.is(paths.length, 2, 'two different paths')
	t.is(paths[0].length, 4, 'path 1 has 4 moves')
	t.is(paths[1].length, 4, 'path 2 has 4 moves')
	t.is(paths[0][2][0][1], 1, 'path 1 follows column 1')
	t.is(paths[1][2][0][1], 2, 'path 2 follows column 2')
	const otherPaths = generatePaths(g, '21')
	// console.log(otherPaths[0], otherPaths[1])
	t.is(otherPaths[0][2][0][1], 2, 'path 1 follows column 2')
	t.is(otherPaths[1][2][0][1], 1, 'path 2 follows column 1')
})
