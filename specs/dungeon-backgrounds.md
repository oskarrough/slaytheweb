# Dungeon Backgrounds

**Issue:** https://github.com/oskarrough/slaytheweb/issues/140

## Problem

Background images change by floor, but:
- Limited variety (few backgrounds available)
- Implementation in CSS is inflexible

## Solution

Expand background collection and improve the system for selecting them.

### Current Implementation

Backgrounds set via CSS in `src/ui/styles/app.css:178-223` based on floor number.

### Proposed Changes

#### 1. More Backgrounds

Need backgrounds for different dungeon themes:
- **Act 1**: Forest, cave entrance, ruins
- **Act 2**: Dungeon interior, crypt, underground
- **Act 3**: Castle, tower, throne room

Sources for free backgrounds:
- OpenGameArt.org
- itch.io game assets
- AI-generated (with proper licensing)

#### 2. Background System

Move from CSS to JS-based selection:

```js
// src/ui/backgrounds.js
const backgrounds = {
  act1: ['forest.jpg', 'cave.jpg', 'ruins.jpg'],
  act2: ['dungeon.jpg', 'crypt.jpg', 'underground.jpg'],
  act3: ['castle.jpg', 'tower.jpg', 'throne.jpg'],
  boss: ['boss-arena.jpg']
}

export function getBackground(floor, roomType) {
  const act = Math.ceil(floor / 5)
  if (roomType === 'boss') return backgrounds.boss[0]
  return pickRandom(backgrounds[`act${act}`])
}
```

#### 3. Room-Type Backgrounds

Different backgrounds for different room types:
- Combat rooms: dark, ominous
- Campfire: warm, safe feeling
- Shop: merchant tent/building
- Event: mysterious, varied

### File Organization

```
public/images/backgrounds/
  act1/
    forest.jpg
    cave.jpg
  act2/
    dungeon.jpg
  act3/
    castle.jpg
  special/
    campfire.jpg
    shop.jpg
```

## Tasks

- [ ] Gather/create 10+ new background images
- [ ] Organize into act folders
- [ ] Create background selection utility
- [ ] Update app.css to use JS-selected backgrounds
- [ ] Add room-type specific backgrounds (optional)
