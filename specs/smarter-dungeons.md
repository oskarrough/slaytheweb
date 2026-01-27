# Smarter Dungeons

**Issue:** https://github.com/oskarrough/slaytheweb/issues/150

## Problem

Monster difficulty is random across floors. You might face a hard monster on floor 1 and an easy one near the end. This creates unbalanced runs.

## Solution

Assign difficulty ratings to monsters and match them to floor progression.

### Monster Difficulty System

Add difficulty to each monster (1-3 or easy/medium/hard):

```js
// src/content/monsters.js
{
  name: 'Slime',
  difficulty: 1, // easy - floors 1-3
  ...
}
{
  name: 'Automaton',
  difficulty: 3, // hard - floors 7+
  ...
}
```

### Floor-Based Selection

Update `src/game/dungeon.js` monster selection:

```js
function getMonsterForFloor(floor, monsters) {
  const maxDifficulty = Math.ceil(floor / 3) // 1-3 = easy, 4-6 = medium, 7+ = hard
  const pool = monsters.filter(m => m.difficulty <= maxDifficulty)
  return pickRandom(pool)
}
```

### Optional: Monster Tags

For future use, tag monsters by fight style:
- `aoe` - requires AoE cards
- `scaling` - punishes slow play
- `burst` - high damage, low HP

### Implementation

1. Add `difficulty` field to all monsters in `src/content/monsters.js`
2. Update `src/game/dungeon.js` room generation
3. Apply same logic to elites
4. Bosses stay at end (no change needed)

## Tasks

- [ ] Add difficulty ratings to all monsters
- [ ] Update dungeon.js monster selection logic
- [ ] Apply to elite selection
- [ ] Playtest floor progression
- [ ] Consider adding monster tags (optional)
