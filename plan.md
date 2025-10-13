See https://github.com/oskarrough/slaytheweb/issues or run `gh issue list`

## save/load serialization

### problem solved

Network timeouts when posting game states to backend (leaderboards/analytics).

**Result**: 23.55 KB → 16.82 KB (28.6% reduction)

### implementation

Stripped node.edges from serialization - they're redundant data derived from paths:
- `encode()` removes node.edges before JSON.stringify
- `decode()` rebuilds edges from paths using storePathOnGraph()
- added tests verifying encode/decode/navigation work correctly

### potential future optimization

**Monster intents** (~3 KB additional savings):
- strip intents, reconstruct from monster-rooms.js on load
- would reduce to ~14 KB (40% total reduction)
- trade-off: old saves break when monsters are rebalanced
- not needed - current size solves timeout issue
