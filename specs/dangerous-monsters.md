# More Dangerous Monsters

**Issue:** https://github.com/oskarrough/slaytheweb/issues/247

## Problem

Most players win the game. The current monster roster may be too easy.

## Solution

Add new monsters with challenging mechanics that punish passive play.

### New Monster Ideas

#### Scaling Monsters
- **Slime Hulk**: Gains +2 strength each turn. Forces aggressive play.
- **Time Eater**: After 12 cards played, deals massive damage. Punishes long turns.

#### Debuff Monsters
- **Curse Weaver**: Adds curse cards to your deck each turn.
- **Mana Leech**: Reduces your max energy by 1 until killed.

#### Multi-attack Monsters
- **Swarm Lord**: Attacks 5x for small damage. Block-heavy decks struggle.
- **Berserker**: Attacks twice, gaining damage each hit taken.

#### Punish Mechanics
- **Mirror Knight**: Reflects a portion of damage back.
- **Spore Beast**: On death, applies poison to player.

### Implementation

1. Add monster definitions to `src/content/monsters.js`
2. Create intents for new attack patterns
3. Add to appropriate difficulty pools (see #150 smarter dungeons)
4. Balance HP and damage values through playtesting

## Tasks

- [ ] Design 4-6 new monster concepts
- [ ] Implement monster definitions
- [ ] Add new intent types if needed
- [ ] Playtest and balance
- [ ] Add monster illustrations (#154)
