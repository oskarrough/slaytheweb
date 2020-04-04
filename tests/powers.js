import test from 'ava'
import powers from '../public/game/powers'

test('Type is either buff or debuff', (t) => {
	t.is(powers.regen.type, 'buff')
	t.is(powers.vulnerable.type, 'debuff')
})
