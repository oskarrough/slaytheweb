# Documentation for Slay the Web 

Throughout the project I've attempted to document and leave comments. So please, go ahead and explore all folders and files. In the root of this project you'll find configuration files as well as two folders:

- [public →](public/) The web root, ready to deploy to any static web server. No compilation required. You can open the folder locally with your browser, or if you want livereload, with `npm start`.
  - [game](public/game) contains the core game logic
  - [content](public/content) uses methods from the game engine to build cards, dungeon and monsters
  - [ui](public/ui) is the example web interface to actually play the game
  - [web_modules](public/web_modules) contains our third party dependencies, loaded as ES modules
- [tests →](tests/) Contains all tests for the game engine. Nothing for the UI. Run `npm test`.

## Public

This is the full source code of the game _and_ UI. The folder is meant to be deployed as-is to any static web server. The game logic does not concern with the UI.

### Game

#### Game State

The full game state is always stored in a single, large "game state" object. It is everything needed to reproduce a certain state of the game. Everything is synchronous. It does not care about your UI. The state is always modified using "actions". 

#### Actions

An action is a function that takes a `state` object, modifies it, and returns a new one. There are actions for drawing a card, dealing damage, applying a debuff... everything you want to do, there's an action.

See all actions in [actions.js](actions.js). Most have comments and corresponding tests you can check.

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

Cards also have a `target` property to suggest which targets the card should affect. Targets include `player`, `enemyX` (where x is the monster's index, starting from 0) and `all enemies`.

For more advanced cards, you can define (custom) actions to run when the card is played. To limit when a a card can be played, use "conditions" (see the source code).

#### Powers

Cards can apply "powers". A power is a status effect or aura that usually lasts one or more turns. It can target the player, a monster or all enemies. A power could do literally anything, but an example is the "Vulnerable" power, which makes the target take 50% more damage for two turns.

As an example, setting `state.player.powers.weak = 5`, indicates that the player should be considered weak for five turns. Powers decrease by one stack per turn.

#### Player

On `state.player` we have you, the player. This object describes the health, powers and the cards you have.

#### Dungeon

Every game starts in a dungeon. You make your way through rooms to reach the end.

There are different types of rooms. Like Monster and Campfire. One day there'll be more like Merchant and Treasure or a "random" room.

#### Monsters

Monsters exist inside the rooms in a dungeon. A monster has health and a list of "intents" that it will take each turn. These intents are basically the AI. Monsters can do damage, block and apply powers. It's not super flexible, as we're not using actions and cards like the player does. But it is enough for now.

### Content

#### cards.js

Contains the actual cards used in the game. Not to be confused with `game/cards.js`, which contains the logic.

#### dungeon-encounters.js

Contains different monsters, room and dungeons. All created with methods from the game.

### UI

The UI is made with htm and preact. I've tried not to create too many components and abstractions, although this might come back to haunt us.

Everything starts with [index.html](https://github.com/oskarrough/slaytheweb/blob/main/public/ui/index.html). When loaded,
we show a splash/welcome screen as defined in [index.js](https://github.com/oskarrough/slaytheweb/blob/main/public/ui/index.js).

Next, when you tap "Start Game", we load [app.js](https://github.com/oskarrough/slaytheweb/blob/main/public/ui/app.js). 
This one connects everything and manages the game state.

#### Animations

See [animations.js](animations.js). Most are made with gsap.

#### Sounds

See [sounds.js](sounds.js) using Tone.js.

## Tests

Scripts are checked with [eslint](https://eslint.org/), formatted with [prettier](https://prettier.io/) and tested with [ava](https://github.com/avajs/ava).

Additionally the ./tests folder contains the tests. Usually a test goes 1) create a game 2) modify the game state with one or more actions 3) assert that the final state is how it you expect.

- `yarn test` tests everything once
- `yarn test:watch` tests continously (good while developing)
- `yarn test:coverage` check test code coverage

Additionally you can run yarn eslint public --fix to automatically format all scripts according to the prettier standards.

You can also just run ava directly and do as you please. Example: `yarn ava tests/actions.js --watch`

## Footnotes

In the beginning I made this diagram of how the game works. It's probably outdated now but keeping it here for reference: https://kinopio.club/slay-the-web-Dh3xUjjHbol7RbCuqZQDn.
