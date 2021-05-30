import test from 'ava'
import {generateGraph} from '../public/game/dungeon.js'

test('graph is created without options', (t) => {
	let g = generateGraph()
	t.is(g.length, 8)
	t.is(g[1].length, 10)
})

test('can customize graph size with height and width', (t) => {
	let g = generateGraph({height: 3, width: 10})
	t.is(g.length, 5)
	t.is(g[1].length, 10)
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

// You can't customize atm. because it's hardcoded in dungeon.js.
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
