
# How the game works

- https://kinopio.club/slay-the-web-Dh3xUjjHbol7RbCuqZQDn (could be outdated)

## Game state

The full game state is always stored in a single, large "game state" object. It is everything needed to reproduce a certain state of the game. Everything is synchronous. It does not care about your UI. The state is always modified using "actions". 

## Actions

An action is a function that takes a `state` object, modifies it, and returns a new one. There are actions for drawing a card, dealing damage, applying a debuff... everything you want to do, there's an action.

See all actions in `./public/game/actions.js`. Most have comments and corresponding tests you can check.

## Action Manager

As said, actions return a new state. They don't modify the original state. To keep track of all the moves (actions) made, we use the "action manager" to queue and dequeue them.

Run `enqueue(action)` to add an action to the list.  
Run `dequeue()` to update the state with the changes from the oldest action in the queue.

> Note, you don't pass an action directly to the action manager. Rather you pass an object. Like this: `{type: 'nameOfAction', damage: 5, ... more properties}`.

## Cards

You have a deck of cards. Cards have different energy cost and can trigge other game actions when they are played.

1. Cards start in the "draw pile".
2. From there they are drawn to the "hand"
3. ...and finally, once played, to the "discard pile".

Once the draw pile is empty, and you attempt to draw, the discard pile is reshuffled into the draw pile.

Cards also have a `target` property to suggest which targets the card should affect. Targets include `player`, `enemyX` (where x is the monster's index, starting from 0) and `all enemies`.

For more advanced cards, you can define (custom) actions to run when the card is played. To limit when a a card can be played, use "conditions" (see the source code).

## Powers

Cards can apply "powers". A power is a status effect or aura that usually lasts one or more turns. It can target the player, a monster or all enemies. A power could do literally anything, but an example is the "Vulnerable" power, which makes the target take 50% more damage for two turns.

As an example, setting `state.player.powers.weak = 5`, indicates that the player should be considered weak for five turns. Powers decrease by one stack per turn.

## Player

On `state.player` we have you, the player. This object describes the health, powers and the cards you have.

## Dungeon

Every game starts in a dungeon. You make your way through rooms to reach the end.

There are different types of rooms. Like Monster and Campfire. One day there'll be more like Merchant and Treasure or a "random" room.

## Monsters

Monsters exist inside the rooms in a dungeon. A monster has health and a list of "intents" that it will take each turn. These intents are basically the AI. Monsters can do damage, block and apply powers. It's not super flexible, as we're not using actions and cards like the player does. But it is enough for now.
