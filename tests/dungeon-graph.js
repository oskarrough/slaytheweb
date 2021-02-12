import test from 'ava'
import {generateGraph} from '../public/game/dungeon.js'

test('can customize graph size with rows and columns', (t) => {
	let g = generateGraph({rows: 3, columns: 10})
	t.is(g.length, 5)
	t.is(g[1].length, 10)
	g = generateGraph({rows: 2, columns: 6})
	t.is(g.length, 4, 'rows match (incl. start+end)')
	t.is(g[1].length, 6, 'columns match')
})

test('all rows except first+last have between 2-5 encounters', (t) => {
	let g = generateGraph({rows: 10, columns: 6})
	// t.plan(8)
	g.forEach((row, index) => {
		if (index === 0 || index === g.length - 1) return
		t.is(row.length, 6, 'all cols are same length')
		t.true(row.filter((n) => n.type).length > 1, 'have at least 2 encounters in each row')
		t.true(row.filter((n) => n.type).length < 6, 'have max 5 encounters in each row')
	})
})

test('can customize encounter frequency', (t) => {
	let g = generateGraph({columns: 10, minEncounters: 10, maxEncounters: 10})
	g.forEach((row, index) => {
		if (index === 0 || index === g.length - 1) return
		t.is(row.filter((n) => n.type).length, 10)
	})
})

test('it respects the cols options', (t) => {
	let g = generateGraph({columns: 5, minEncounters: 6, maxEncounters: 10})
	g.forEach((row, index) => {
		if (index === 0 || index === g.length - 1) return
		t.is(row.filter((n) => n.type).length, 5)
	})
})

// You can't customize atm. because we hardcode it in "randomEncounter"
test.skip('can customize the type of encounters', (t) => {
	const encounters = '!#$'
	const g = generateGraph({encounters})
	g.forEach((row, index) => {
		if (index === 0 || index === g.length - 1) return
		row
			.filter((n) => n.type)
			.forEach((node) => {
				if (index > 2) {
					t.true(encounters.includes(node.type))
				}
			})
	})
})
