# Powers v2

**Issue:** https://github.com/oskarrough/slaytheweb/issues/31

## Problem

Current powers system is limited:
- Powers only support "X stacks, decreasing by 1 each turn"
- Can't implement permanent buffs (Barricade)
- Can't implement intensity-based powers (Dexterity stacks)

Slay the Spire has two power types:
1. **Duration-based**: Last X turns, then expire (Vulnerable, Weak)
2. **Intensity-based**: Stack permanently, affect magnitude (Strength, Dexterity)

## Solution

Extend the power system to support both types.

### Power Types

```js
{
  id: 'strength',
  name: 'Strength',
  type: 'intensity', // stacks permanently
  description: 'Increases attack damage by {stacks}'
}

{
  id: 'vulnerable',
  name: 'Vulnerable',
  type: 'duration', // decreases each turn
  description: 'Takes 50% more damage for {stacks} turns'
}

{
  id: 'barricade',
  name: 'Barricade',
  type: 'permanent', // never expires
  description: 'Block is not removed at end of turn'
}
```

### New Powers to Implement

**Intensity Powers:**
- **Strength**: +1 damage per stack
- **Dexterity**: +1 block per stack
- **Focus**: +1 orb effect per stack

**Duration Powers:**
- **Weak**: -25% attack damage for X turns
- **Frail**: -25% block gained for X turns
- **Vulnerable**: +50% damage taken for X turns

**Permanent Powers:**
- **Barricade**: Block doesn't expire
- **Juggernaut**: Deal damage when gaining block
- **Demon Form**: Gain 2 Strength at turn start

### Implementation

1. Add `type` field to power definitions
2. Update `endTurn` action:
   - Decrement duration powers
   - Leave intensity/permanent powers alone
3. Update damage/block calculations to check powers
4. Add hooks for triggered powers (Juggernaut, Demon Form)

### Key Files

- `src/content/powers.js` - power definitions
- `src/game/actions.js` - power application and triggers
- `src/game/utils.js` - damage/block calculations with power modifiers

## Tasks

- [ ] Add `type` field to power system
- [ ] Implement intensity powers (Strength, Dexterity)
- [ ] Implement permanent powers (Barricade)
- [ ] Update turn-end power processing
- [ ] Add triggered power hooks
- [ ] Update damage/block formulas
- [ ] Create cards that grant new powers
