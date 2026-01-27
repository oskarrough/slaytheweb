# Deprecated Cards

**Issue:** https://github.com/oskarrough/slaytheweb/issues/253

## Problem

When cards are renamed or removed, historical runs referencing those cards fail to load. Examples:

- `Soul Drain` upgrade was renamed from `Lower Soul Drain` to `Soul Drain+`
- `High Succube` was renamed to `High Succube+`

Affected runs: `/stats/run?id=7`, `/stats/run?id=170`

## Solution

Create a card alias/migration system that maps old card names to current ones.

### Implementation

1. Add `src/content/card-aliases.js`:

```js
export const cardAliases = {
  'Lower Soul Drain': 'Soul Drain+',
  'High Succube': 'High Succube+',
  // add more as needed
}
```

2. Create a `resolveCardName(name)` function that:
   - Returns the current name if it exists in the card registry
   - Checks aliases and returns the mapped name
   - Returns `null` or a placeholder for truly removed cards

3. Update `src/game/backend.js` to use `resolveCardName()` when deserializing runs

4. Handle missing cards gracefully in the UI (show placeholder or skip)

## Tasks

- [ ] Create card aliases mapping
- [ ] Add `resolveCardName()` utility
- [ ] Update run deserialization to use aliases
- [ ] Add UI fallback for unresolvable cards
- [ ] Document process for deprecating cards
