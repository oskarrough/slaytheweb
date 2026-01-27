# Relics and Potions

**Issue:** https://github.com/oskarrough/slaytheweb/issues/51

## Problem

The game lacks relics (permanent passive bonuses) and potions (consumable items), which are core mechanics in Slay the Spire that add depth and variety.

## Solution

Implement relics and potions as collectible items from combat rewards and events.

### Relics

Permanent bonuses that last the entire run.

#### Starter Relics
- **Burning Blood**: Heal 6 HP at end of combat
- **Ring of the Snake**: Draw 2 additional cards on turn 1
- **Cracked Core**: Channel 1 Lightning at start of combat

#### Combat Relics
- **Vajra**: Start combat with +1 Strength
- **Anchor**: Start combat with 10 Block
- **Lantern**: Gain 1 Energy on turn 1

#### Data Structure
```js
{
  id: 'burning-blood',
  name: 'Burning Blood',
  description: 'Heal 6 HP at end of combat',
  rarity: 'starter',
  trigger: 'onCombatEnd',
  effect: { type: 'heal', amount: 6 }
}
```

### Potions

One-time consumables. Player can hold 2-3 at a time.

#### Basic Potions
- **Health Potion**: Heal 30 HP
- **Block Potion**: Gain 12 Block
- **Strength Potion**: Gain 2 Strength this combat
- **Fire Potion**: Deal 20 damage to target

#### Data Structure
```js
{
  id: 'health-potion',
  name: 'Health Potion',
  description: 'Heal 30 HP',
  rarity: 'common',
  effect: { type: 'heal', amount: 30 }
}
```

### Implementation

1. **Game State:**
   - Add `state.relics: []` array
   - Add `state.potions: []` array (max 3 slots)

2. **New Files:**
   - `src/content/relics.js` - relic definitions
   - `src/content/potions.js` - potion definitions
   - `src/game/actions-relics.js` - relic trigger system
   - `src/game/actions-potions.js` - potion usage

3. **Hooks:**
   - Combat start/end hooks for relic triggers
   - Turn start/end hooks
   - Card play hooks

4. **UI:**
   - Relic display bar (top of screen)
   - Potion slots (near player HP)
   - Reward screen updates

5. **Rewards:**
   - Add to combat rewards
   - Add relic/potion choice rooms

## Tasks

- [ ] Design initial relic set (5-10)
- [ ] Design initial potion set (5-8)
- [ ] Add state fields for relics/potions
- [ ] Implement relic trigger system
- [ ] Implement potion usage action
- [ ] Update reward system
- [ ] Create relic/potion UI components
