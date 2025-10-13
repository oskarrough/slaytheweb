See https://github.com/oskarrough/slaytheweb/issues or run `gh issue list`

## save/load serialization analysis

### optimization goal

**problem**: network timeouts when posting game states to backend (leaderboards/analytics)
- current size: 20.41 KB (after superjson removal)
- timeouts happen with slow connections
- **unknown**: what size actually prevents timeouts? need to measure
- **strategy**: implement easy wins first, test, then decide if more optimization needed

### key findings

1. **dungeon dominates save size**
   - total save: ~23 KB
   - dungeon: 15 KB (65% of total)
   - deck/cards: 5 KB (22%)
   - superjson overhead: 16-18%

2. **dungeon structure** (see tests/explain-dungeon-structure.js)
   ```
   dungeon {
     graph: [[node, node...], [node, node...]]  // 2d array, floors with nodes
     paths: [[[y,x], [y,x]]...]                  // routes through dungeon
     edges: stored ON nodes                       // which nodes connect (derived from paths)
   }
   ```
   - **edges are 100% redundant** - computed from paths via storePathOnGraph()
   - removing edges saves 4.59 KB (26% of dungeon, 20% of total save)
   - empty nodes (type: undefined) exist but removing breaks coordinate system

3. **superjson status**
   - no Map() or Set() found in src/game or src/content
   - enableMapSet() is called but unused
   - superjson only needed if we use Map/Set
   - can switch to plain JSON if we don't need it

4. **monster data** (see tests/analyze-monster-size.js)
   - monsters: 10.1 KB (43.8% of total save)
   - just intents arrays: 3.1 KB (13.4% of total)
   - 34 rooms with monsters, 61 total monster instances
   - each monster has full intents array (e.g., Slime King has 8 intent objects)
   - **issue**: monsters embedded in dungeon, so balance changes would affect old saves
   - **options**:
     - strip intents, reconstruct from monster-rooms.js on load (13.4% savings, breaks old saves on rebalance)
     - deduplicate duplicate monster definitions (safer, smaller savings, more complex)

### immediate wins available

1. **remove edges from serialization** (4.59 KB = 20% reduction)
   - edges already reconstructed on load via migration in save-load.js:48
   - just need to not save them in first place

2. **remove superjson** if no Map/Set usage (3-4 KB = 15-18% reduction)
   - verify no Map/Set in game state
   - switch encode/decode to JSON.stringify/parse

combined: ~35-40% size reduction without losing any functionality

### baseline (before optimization)
- realistic game state: 23.55 KB
- dungeon has 39 edges
- using superjson for serialization

### progress

#### Done

**analysis:**
- analyzed save sizes at different game stages (tests/save-size-analysis.js)
- identified dungeon as 65% of save size
- found edges are 100% redundant - computed from paths via storePathOnGraph()
- actual edges savings: 2.27 KB (13.9% of dungeon) per tests/verify-edges-savings.js
- found superjson adds overhead but no Map/Set used in game state
- verified no circular references (tests/check-circular-refs.js)
- analyzed monster data structure (tests/analyze-monster-size.js)
  - monsters are 43.8% of save, intents alone are 13.4%
  - stripping intents would save 3.1 KB but breaks saves on balance changes

**baseline established:** tests/baseline-save-sizes.js
- empty state: 0.33 KB
- with starter deck: 5.01 KB
- with test dungeon: 7.38 KB
- realistic game (default dungeon + cards): 23.55 KB
- target: ~14 KB (40% reduction)

**removed superjson (COMPLETED):**
- switched encode/decode from superjson to JSON.stringify/parse in src/ui/save-load.js
- updated tests (skipped Set() test, fixed baseline checks)
- **result: 23.55 KB → 20.41 KB (3.14 KB = 13.3% savings)**
- all tests pass

#### Active

- strip edges before serialization (EASY WIN - do first)
  - modify encode() to deep clone state and walk dungeon.graph removing node.edges
  - edges already reconstructed on load (save-load.js:48-54 migration code)
  - expected savings: ~2.2 KB (11% reduction) → ~18 KB total
  - verify with tests that saves are smaller and loads work
  - **then TEST if this fixes timeouts before doing more**

- clean up immer Map/Set support
  - remove enableMapSet() call from actions.js (line 10)
  - we don't use Map or Set anywhere

- remove superjson from package.json dependencies

- measure timeout threshold
  - test with different payload sizes (20KB, 18KB, 15KB, 12KB)
  - determine if issue is payload size, parse time, or network latency
  - informs whether monster optimization is needed

#### Backlog

- (only if edges stripping doesn't fix timeouts) monster/intents optimization
  - **context**: monsters are 10.1 KB (43.8%), intents alone 3.1 KB (13.4%)
  - **approach**: strip intents, reconstruct from monster-rooms.js on load
    - saves 3.1 KB → ~15 KB total
    - requires: identify monster by room name, store only dynamic state
    - requires: versioning strategy (balance changes invalidate old saves)
    - implementation questions:
      - how to identify which monster definition? (room name? unique IDs?)
      - where to reconstruct? (decode()? migration? lazy?)
      - edge cases: deleted monsters, changed rooms, modded content
  - **for leaderboards**: balance changes SHOULD invalidate old saves anyway
  - **decision pending**: need timeout measurements first

- (maybe) optimize card data if still needed after above changes

### expected final result

**conservative path** (edges + superjson only):
- baseline: 23.55 KB
- current: 20.41 KB (superjson removed, -13.3%)
- after edges: ~18 KB (-11% more)
- total: ~24% reduction

**aggressive path** (+ monster intents):
- after edges + superjson: ~18 KB
- after stripping intents: ~15 KB (-13.4% more)
- total: ~36% reduction from baseline
- trade-off: old saves break if monsters rebalanced

