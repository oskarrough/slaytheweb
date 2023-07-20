import test from 'ava'
import powers from '../src/game/powers.js'

test('Type is either buff or debuff', (t) => {
	t.is(powers.regen.type, 'buff')
	t.is(powers.vulnerable.type, 'debuff')
})
