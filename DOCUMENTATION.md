# Documentation for Slay the Web

Throughout the project I've attempted to document and leave comments. Go ahead and explore all folders and files.

In the root of this project you'll find configuration files as well as three folders:

- [src →](src/) The web root. 
  - [game](src/game) contains the core game logic
  - [content](src/content) uses methods from the game engine to build cards, dungeon and monsters
  - [ui](src/ui) is the example web interface to actually play the game
- [public →](public/) Copied to the web root as-is
- [tests →](tests/) Contains all tests for the game engine. Nothing for the UI. Run `npm test`.

## Src

This is the full source code of the game _and_ UI. The game logic does not concern with the UI.

### Game

#### Game State

The full game state is always stored in a single, large "game state" object. It is everything needed to reproduce a certain state of the game. Everything is synchronous. It does not care about your UI. The state is always modified using "actions".

#### Actions

An action is a function that takes a `state` object, modifies it, and returns a new one. There are actions for drawing a card, dealing damage, applying a debuff... everything you want to do, there's an action.

See all actions in [actions.js](src/game/actions.js). Most have comments and corresponding tests you can check.

#### Action Manager

As said, actions return a new state. They don't modify the original state. To keep track of all the moves (actions) made, we use the "action manager" to queue and dequeue them.

Run `enqueue(action)` to add an action to the list.  
Run `dequeue()` to update the state with the changes from the oldest action in the queue.

> Note, you don't pass an action directly to the action manager. Rather you pass an object. Like this: `{type: 'nameOfAction', damage: 5, ... more properties}`.

#### Cards

You have a deck of cards. Cards have different energy cost and can trigge other game actions when they are played.

1. Cards start in the "draw pile".
2. From there they are drawn to the "hand"
3. ...and finally, once played, to the "discard pile".

Once the draw pile is empty, and you attempt to draw, the discard pile is reshuffled into the draw pile.

Cards also have a `target` property to suggest which targets the card should affect.

For more advanced cards, you can define (custom) actions to run when the card is played. To limit when a a card can be played, use "conditions" (see the source code).

#### Powers

Cards can apply "powers". A power is a status effect or aura that usually lasts one or more turns. It can target the player, a monster or all enemies. A power could do literally anything, but an example is the "Vulnerable" power, which makes the target take 50% more damage for two turns.

As an example, setting `state.player.powers.weak = 5`, indicates that the player should be considered weak for five turns. Powers decrease by one stack per turn.

#### Player

On `state.player` we have you, the player. This object describes the health, powers and the cards you have.

#### Dungeon

Every game evolves around and in a dungeon. A dungeon consists of a graph (think a 2d array with rows and columns, or positions and nodes, or floors and rooms).
There are different types of rooms. Like Monster and Campfire. One day there'll be more like Merchant and Treasure or a "random" room.

To be able to navigate a dungeon, we have the concept of a `Map`. It takes a `Dungeon` and renders the UI. Check https://slaytheweb.cards/map-demo.html. I'm biased but it's kind of cool.

#### Monsters

Monsters exist inside the rooms in a dungeon. A monster has health and a list of "intents" that it will take each turn. These intents are basically the AI. Monsters can do damage, block and apply powers. It's not super flexible, as we're not using actions and cards like the player does. But it is enough for now.

### Content

#### cards.js

Collects all cards from the `src/content/cards/*` folder.

Every card must define two exports:
- default: the card
- upgrade: upgrade(card) => card

#### dungeon-encounters.js

Contains different monsters, room and dungeons. All created with methods from the game.

### UI

The UI is made with htm and preact. I've tried not to create too many components and abstractions, although this might come back to haunt us.

Everything starts with [index.html](https://github.com/oskarrough/slaytheweb/blob/main/index.html). When loaded,
we show a splash/welcome screen as defined in [index.js](https://github.com/oskarrough/slaytheweb/blob/main/src/ui/index.js).

Next, when you tap "Start Game", we load [app.js](https://github.com/oskarrough/slaytheweb/blob/main/src/ui/app.js).
This one connects everything and manages the game state.

#### Animations

See [animations.js](src/ui/animations.js). Most are made with gsap.

#### Sounds

See [sounds.js](src/ui/sounds.js) using Tone.js.

## Tests

Scripts are checked with [eslint](https://eslint.org/), formatted with [prettier](https://prettier.io/) and tested with [ava](https://github.com/avajs/ava).

Additionally the ./tests folder contains the tests. Usually a test goes 1) create a game 2) modify the game state with one or more actions 3) assert that the final state is how it you expect.

- `npm test` tests everything once
- `npm run test:watch` tests continously (good while developing)
- `npm run test:coverage` check test code coverage

Additionally you can run `npm run lint` to automatically format all scripts according to the prettier standards.

You can also just run ava directly and do as you please. Example: `npm test tests/actions.js --watch`

## Backend

With the integration of https://github.com/oskarrough/slaytheweb-backend in `game/backend.js`, you can choose to save your current run state in the Slay the Web database. Nothing but game state & date is stored. All runs are visible on `stats.html`.

## Footnotes

In the beginning I made this diagram of how the game works. It's probably outdated now but keeping it here for reference: https://kinopio.club/slay-the-web-Dh3xUjjHbol7RbCuqZQDn.
