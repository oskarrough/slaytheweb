# Slay the web API design

## Core architecture (current)

- State-based: Actions are pure functions `(state, props) => newState`
- Queue system: Actions enqueued and processed sequentially
- Turn-based: Perfect for command pattern with clear state transitions

```js
// Core pattern
game.enqueue({type: 'playCard', card})
game.dequeue()

// Queue enables
// - Undo/redo
// - Action history
// - Save states
// - Debugging
```

## API style options

All styles would wrap the same core engine:

1. Current (Raw Actions) - Explicit and debuggable but verbose
   ```js
   game.enqueue({type: 'playCard', card: strike})
   game.dequeue()
   ```

2. Fluent/Chainable - Readable sequences
   ```js
   game.drawCards(5).playCard(strike, 'enemy0').endTurn()
   ```

3. Command Strings - Console-like for debugging
   ```js
   game.do('/play strike enemy0')
   ```

4. Domain-Specific - Organized by game concepts
   ```js
   game.combat.play(strike).on('enemy0')
   game.deck.draw(5)
   ```

5. Builder Pattern - Step-by-step construction
   ```js
   game.command.play(strike).target('enemy0').run()
   ```

## Implementation considerations

1. All wrappers map to core state transforms
2. Actions remain composable
3. Type safety for parameters

## Conclusion

The state-based core architecture is powerful, flexible, and should be preserved. Thin wrapper APIs can provide more ergonomic interfaces for common operations while maintaining the underlying strengths of the system.
