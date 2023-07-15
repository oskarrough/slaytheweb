// @ts-ignore
import test from 'ava'
import {createCard} from '../public/game/cards.js'

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
	const card = createCard('Strike')
	t.is(card.damage, 6)
	card.upgrade()
	t.is(card.damage, 9)
})
