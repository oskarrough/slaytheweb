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

test('card names with plus always upgrade', (t) => {
	t.is(createCard('Succube').name, 'Succube')
	t.is(createCard('Succube', true).name, 'High Succube+', 'different upgraded name')
	t.is(createCard('High Succube+', true).name, 'High Succube+', 'if name contains + we always upgrade')
	t.is(createCard('High Succube+', false).name, 'High Succube+', 'if name contains + we always upgrade')
})

test('createCard handles already-upgraded card names', (t) => {
	// Regular cards with + suffix
	const bashPlus = createCard('Bash+')
	t.true(bashPlus.upgraded)
	t.is(bashPlus.name, 'Bash+')

	// Special cards with different upgrade names
	const highSuccube = createCard('High Succube+')
	t.true(highSuccube.upgraded)
	t.is(highSuccube.name, 'High Succube+')
})

test('upgrading is consistent', (t) => {
	// Regular upgrade path
	const bashPath1 = createCard('Bash', true)
	const bashPath2 = createCard('Bash+')
	t.deepEqual(bashPath1, bashPath2, 'Both upgrade paths should create identical cards')

	// Special upgrade name path
	const succubePath1 = createCard('Succube', true)
	const succubePath2 = createCard('High Succube+')
	t.deepEqual(succubePath1, succubePath2, 'Special upgrade paths should be consistent')
})

test('all upgraded card names follow conventions', (t) => {
	const specialUpgradeCards = new Set(['Succube']) // Add any cards with special upgrade names here
	
	for (const card of cards) {
		const upgraded = createCard(card.name, true)
		
		if (specialUpgradeCards.has(card.name)) {
			t.true(upgraded.name.endsWith('+'), 
				`Special upgrade ${upgraded.name} should still end with +`)
		} else {
			t.is(upgraded.name, card.name + '+',
				`Regular upgrade of ${card.name} should be ${card.name}+`)
		}
	}
})
