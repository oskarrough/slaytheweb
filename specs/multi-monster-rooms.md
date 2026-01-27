# Support More Monsters in a Room

**Issue:** https://github.com/oskarrough/slaytheweb/issues/184

## Problem

The UI only fits 1-3 monsters. The game logic supports more, but the layout breaks with 4+ monsters.

## Solution

Make the monster layout responsive to accommodate up to 6 monsters.

### CSS Approach

1. **Flexible container:**
   ```css
   .monsters {
     display: flex;
     flex-wrap: wrap;
     justify-content: center;
     gap: 1rem;
   }
   ```

2. **Scaling monsters:**
   - 1-2 monsters: full size
   - 3-4 monsters: 80% scale
   - 5-6 monsters: 60% scale

   ```css
   .monsters[data-count="5"] .monster,
   .monsters[data-count="6"] .monster {
     transform: scale(0.6);
   }
   ```

3. **Intent positioning:**
   - Move intents above monsters when scaled
   - Stack vertically if needed

### Layout Options

**Option A: Grid layout**
- Fixed 3-column grid
- Monsters wrap to second row

**Option B: Responsive flex**
- Shrink monsters to fit
- Single row with smaller monsters

**Option C: Overflow scroll**
- Keep monster size
- Horizontal scroll if needed (not recommended)

### Key Files

- `src/ui/components/monsters.js` - add data-count attribute
- `src/ui/styles/monsters.css` - responsive scaling

## Tasks

- [ ] Add monster count attribute to container
- [ ] Implement responsive scaling CSS
- [ ] Test with 4, 5, 6 monsters
- [ ] Adjust intent/HP bar positioning
- [ ] Update targeting UI for many monsters
