# Slay the Web API Design

## Core Principles

1. **State-Based Architecture**
- Every action operates on the full game state
- Actions are pure functions: `(state, props) => newState`
- This gives us great flexibility and predictability. Makes debugging, testing, and undo/redo trivial

```js
// Current implementation
function playCard(state, {card, target}) {
  // Operates on entire state
  // Returns new state
  return newState
}

// Used like
game.enqueue({type: 'playCard', card: strike})
game.dequeue()
```

2. **Turn-Based Nature**
- Actions happen sequentially
- Clear state transitions
- Perfect for command pattern
- No need for complex event systems

## Queue & Action Manager System

A key part of the architecture is how actions are queued and processed:

```js
// The Queue system maintains order and history
const future = new Queue()  // actions to be executed
const past = new Queue()    // actions that were executed

// Action Manager handles the flow
actionManager.enqueue({type: 'playCard', card})  // queue up an action
actionManager.dequeue(state)  // execute next action
actionManager.undo()          // revert to previous state

// This enables features like:
// - Undo/redo
// - Action history
// - Save states
// - Debugging/replay
```

Any wrapper API needs to respect this system:
1. Actions must be properly queued
2. State changes happen through dequeue
3. Past actions are tracked for undo
4. The sequence of actions matters

For example, a fluent API would need to:
```js
// Friendly API
game.play(strike).on('enemy0')

// Under the hood
game.enqueue({type: 'playCard', card: strike, target: 'enemy0'})
game.dequeue()
```

## Design Goals

1. **Readable & Intuitive**: Actions should read like English
2. **Predictable**: Clear what each action does
3. **Flexible**: Full state access means powerful combinations
4. **Debuggable**: Easy to inspect state changes
5. **Testable**: Pure functions are easy to test

## API Style Explorations

All these styles wrap the same core state-based system, just with different ergonomics:

### Current Style (Raw Actions)
```js
// Verbose but explicit
game.enqueue({type: 'playCard', card: strike})
game.dequeue()

// Multiple actions
game.enqueue({type: 'drawCards', amount: 5})
game.enqueue({type: 'playCard', card: strike, target: 'enemy0'})
game.enqueue({type: 'endTurn'})
game.dequeue()
```

The current style has some strong advantages:
- Extremely explicit about what's happening
- Makes action queuing visible and debuggable
- Perfect foundation for building friendlier wrappers
- Easy to serialize/deserialize for save states
- Clear mapping between action name and implementation

### Style A: Fluent/Chainable
```js
// Single actions
game.play(strike).on('enemy0')
game.draw(5)

// Action sequences
game
  .draw(5)
  .play(strike).on('enemy0')
  .play(defend).on('player')
  .endTurn()

// With conditions
game.play(strike)
  .when(state => state.player.energy >= 2)
  .on('enemy0')
```

### Style B: Command Strings
```js
// Great for console/debugging
game.do('/play strike enemy0')
game.do('/draw 5')

// Multiple commands
game.do(`
  draw 5
  play strike enemy0
  end-turn
`)

// With targeting
game.do('/play bash enemy0 enemy1')
```

### Style C: Builder Pattern
```js
// Explicit step-by-step building
game.command
  .play(strike)
  .target('enemy0')
  .run()

// With conditions/effects
game.command
  .play(strike)
  .target('enemy0')
  .ifEnoughEnergy()
  .thenDraw(2)
  .run()
```

### Style D: Domain-Specific
```js
// Organized by game concepts
game.combat.play(strike).on('enemy0')
game.deck.draw(5)
game.deck.shuffle()
game.dungeon.move(2, 3)

// Could support both styles
game.play(strike)  // common actions at top
game.combat.applyBleed(3)  // specific ones in domains
```

### Style E: Event-Like
```js
// Reminiscent of game engines
game.on.turnStart(() => {
  game.draw(5)
  game.gainEnergy(3)
})

game.on.cardPlayed(strike, () => {
  game.draw(1)
})
```

## Common Patterns We Need to Support

```js
// Combat
game.play(strike).on('enemy0')
game.defend()
game.endTurn()

// Deck Management
game.draw(5)
game.shuffle()
game.discard(strike)

// Map Navigation
game.move(2, 3)
game.enterRoom('monster')
game.rest()  // at campfire

// Powers/Effects
game.applyPower('weak', 2).to('enemy0')
game.gainBlock(5)
game.heal(10)
```

## Implementation Considerations

1. **State Management**
```js
// All styles ultimately map to state transforms
type Action = (state: GameState, props?: any) => GameState

// Friendly APIs wrap this core
game.play(card) // -> runAction(state => playCard(state, {card}))
```

2. **Action Composition**
```js
// Actions can be composed
const playAndEnd = (state, {card}) => {
  state = playCard(state, {card})
  return endTurn(state)
}
```

3. **Type Safety**
```js
interface PlayCardProps {
  card: Card
  target?: string
}

function playCard(state: GameState, props: PlayCardProps): GameState
```

## Next Steps?

1. Pick a primary API style (while keeping core state-based architecture)
2. Define common action patterns
3. Create type definitions
4. Build documentation that emphasizes discoverability

The key is keeping the powerful state-based core while making it delightful to use.
