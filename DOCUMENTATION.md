# Documentation for Slay the Web

Throughout the project I've attempted to document and leave comments. Go ahead and explore all folders and files.

In the root of this project you'll find configuration files as well as three folders:

- [src →](src/) The web root. 
  - [content](src/content) contains cards, dungeons, encounters and monsters etc.
  - [game](src/game) contains the core game logic
  - [ui](src/ui) is the example web interface to actually play the game
- [public →](public/) Copied to the web root as-is
- [tests →](tests/) Contains all tests for the game engine. Nothing for the UI. Run `npm test`.

### Game

#### Game State

The full game state is always stored in a single, large "game state" object. It is everything needed to reproduce a certain state of the game. It does not know about your UI. The state is modified using synchronous "actions".

#### Actions

An action is a function that takes a `state` object, modifies it, and returns a new one. There are actions for drawing a card, dealing damage, applying a debuff... everything you want to do, there's an action.

See all (mostly well documented) actions in [actions.js](src/game/actions.js).

#### Action Manager

As said, actions return a new state. To keep track of actions made, we use an "action manager" to queue and dequeue them.

Run `enqueue(action)` to add an action to the list.  
Run `dequeue()` to update the state with the changes from the oldest action in the queue.

> Note, you don't pass an action directly to the action manager. Rather you pass a description, like so: `{type: 'nameOfAction', damage: 5, ... more properties}`.

#### Cards

You have a deck of cards. Cards have energy cost, have target(s), can deal damage and block, trigger game actions, apply powers (de/buffs) when played and have conditions that decide when they can be played.

Cards move from the "draw pile" into your hand, and once played to the discard pile.

If the draw pile has fewer cards than you attempt to draw, the discard pile is shuffled into the draw pile.

Cards also have a `target` property to suggest which targets the card should affect.

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

#### dungeons.js

Contains different monsters, room and dungeons. All created with methods from the game.

## Tests

Scripts are checked with [eslint](https://eslint.org/), formatted with [prettier](https://prettier.io/) and tested with [ava](https://github.com/avajs/ava).

Additionally the ./tests folder contains the tests. Usually a test goes 1) create a game 2) modify the game state with one or more actions 3) assert that the final state is how it you expect.

- `npm test` tests everything once
- `npm run test:watch` tests continously (good while developing)
- `npm run test:coverage` check test code coverage

Additionally you can run `npm run lint` to automatically format all scripts according to the prettier standards.

You can also just run ava directly and do as you please. Example: `npm test tests/actions.js --watch`

## UI

The UI is made with web components, htm and preact. I've tried not to create too many components and abstractions, and copy/paste more, although this might come back to haunt us.

In order to have easy HTML layouts (and more :tm:), we have Astro set up here. This means you can define new routes in src/ui/pages.

### Animations

See [animations.js](src/ui/animations.js). Most are made with gsap.

### Sounds

See [sounds.js](src/ui/sounds.js) using the Web Audio API.

## Backend

With the integration of https://github.com/oskarrough/slaytheweb-backend in `game/backend.js`, you can choose to save your current run state in the Slay the Web database. Nothing but game state & date is stored. All runs are visible on `stats.html`.

## Footnotes

In the beginning I made this diagram of how the game works. It's probably outdated now but keeping it here for reference: https://kinopio.club/slay-the-web-Dh3xUjjHbol7RbCuqZQDn.

- JavaScript (ES modules)
- Web components and Preact HTM for rendering
- Immer for immutable state updates
- Error handling: Use try/catch sparingly; prefer validation and early returns
- JSDoc for documentation
- No semicolons, single quotes, tabs

