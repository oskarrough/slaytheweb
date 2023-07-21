// @ts-ignore
import test from 'ava'
import {createCard, findCard} from '../src/game/cards.js'
import * as actions from '../src/game/actions.js'

test('can create an attack card', (t) => {
	const card = createCard('Strike')
	t.is(card.name, 'Strike')
	t.is(card.type, 'attack')
	t.is(card.target, 'enemy')
	t.is(typeof card.damage, 'number')
	t.is(typeof card.energy, 'number')
	t.truthy(card.description)
})

test('can create a skill card', (t) => {
	const card = createCard('Defend')
	t.is(card.type, 'skill')
	t.is(card.target, 'player')
	t.is(typeof card.block, 'number')
})

test('card name must be exact', (t) => {
	t.throws(() => createCard('Naaaah doesnt exist'))
})

test('can upgrade a Strike', (t) => {
	const strike = createCard('Strike')
	t.is(strike.damage, 6)
	t.falsy(strike.upgraded)
	const strikeplus = findCard('Strike')
	strikeplus.upgrade()
	t.is(strikeplus.damage, 9)
	t.true(strikeplus.upgraded)
})
