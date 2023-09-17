import test from 'ava'
import {cards} from '../src/content/cards.js'
import {createCard} from '../src/game/cards.js'

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

test('can upgrade Strike card', (t) => {
	const strikeplus = createCard('Strike', true)
	t.is(strikeplus.damage, 9)
	t.true(strikeplus.upgraded)
	const strike = createCard('Strike')
	t.is(strike.damage, 6)
})

test('can upgrade all cards', (t) => {
	for (const card of cards) {
		const upgraded = createCard(card.name, true)
		t.true(upgraded.upgraded)
		t.true(upgraded.name.includes('+'), upgraded.name)
	}
})
