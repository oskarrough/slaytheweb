# Auto-save Game State

**Issue:** https://github.com/oskarrough/slaytheweb/issues/210

## Problem

Closing the tab or browser crash loses all game progress. Players must restart from the beginning.

## Solution

Automatically save game state to localStorage and restore on page load.

### Implementation

1. **Save triggers:**
   - After each action (debounced, ~500ms)
   - Before page unload (`beforeunload` event)

2. **Storage format:**
   ```js
   {
     version: 1,
     savedAt: timestamp,
     gameState: minimizeGameState(state),
     gamePast: [...actionHistory]
   }
   ```

3. **Restore flow:**
   - On app load, check for saved game
   - Show "Continue?" prompt with run info (floor, HP, etc.)
   - Player chooses to continue or start fresh

4. **Clear save:**
   - On game win/loss
   - On "New Game" button
   - On "Abandon Run" option (new)

### Key Files

- `src/game/new-game.js` - add save/restore logic
- `src/ui/app.js` - add continue prompt
- `src/game/backend.js` - reuse `minimizeGameState()`

### Edge Cases

- Handle corrupted saves (try/catch, fallback to new game)
- Handle version mismatches (migration or discard)
- Multiple tabs (last-write-wins or lock)

## Tasks

- [ ] Add save-to-localStorage after actions
- [ ] Add restore-from-localStorage on load
- [ ] Create "Continue game?" UI prompt
- [ ] Add "Abandon Run" option
- [ ] Handle edge cases (corruption, versions)
