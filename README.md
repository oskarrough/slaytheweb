# Slay the Web
 
This is a browser-based card game engine based on Slay The Spire, a fantastic video card game designed by [MegaCrit](https://www.megacrit.com/). They explain:

> We fused card games and roguelikes together to make the best single player deckbuilder we could. Craft a unique deck, encounter bizarre creatures, discover relics of immense power, and Slay the Spire!

🎴 Play it on https://slaytheweb.now.sh/

![Screenshot of the game](https://i.imgur.com/m9CRCsa.png)

Why what? After many runs in the Spire, I really got into the theory behind the game. Inspired by the modding community, I thought it'd be neat and a great learning experience to try and implement the core logic of the game in JavaScript for the web. And that is what _Slay the Web_ is. The idea is to provide a stable game logic to play the game with any kind of interface. Be it the browser, a command line or whatever. This repo also contains an example interface for the game.

## How to work on the code

You will need `yarn` or `npm` installed on your computer.

1. Run `yarn build` once. It downloads ESM dependencies into ./public/web_modules 
2. Run `yarn start` to start a local file server 

- The `public/game` folder contains the game engine
- The `public/index.html` and `public/ui` is an example interface/website
- The `tests` folder is filled with tests for the game

The entire `public` folder can now be deployed to any static web server. It does not require any compilation, but you *do need* to run `npm build` at least once. 

### Testing

All scripts are checked with eslint, formatted with prettier and tested with ava.

Additionally the `./tests` folder contains the tests. Usually a test goes 1) create a game 2) modify the game state with one or more actions 3) assert that the final state is how it you expect.

- `yarn test` tests everything once
- `yarn test:watch` tests continously

Additionally you can run `yarn eslint public --fix` to automatically format all scripts according to the prettier standards.

### Deploying

The master branch automatically deploys to https://slaytheweb.now.sh via Zeit's now. If you open a PR, it'll give you a staging URL as well.

## How the game works

- https://kinopio.club/slay-the-web-Dh3xUjjHbol7RbCuqZQDn (could be outdated)

### Game state

The full game state is always stored in a single, large "game state" object. It is everything needed to reproduce a certain state of the game. Everything is synchronous. It does not care about your UI. The state is always modified using "actions". 

### Actions

An action is a function that takes a `state` object, modifies it, and returns a new one. There are actions for drawing a card, dealing damage, applying a debuff... everything you want to do, there's an action.

See all actions in `./public/game/actions.js`. Most have comments and corresponding tests you can check.

### Action Manager

As said, actions return a new state. They don't modify the original state. To keep track of all the moves (actions) made, we use the "action manager" to queue and dequeue them.

Run `enqueue(action)` to add an action to the list.  
Run `dequeue()` to update the state with the changes from the oldest action in the queue.

> Note, you don't pass an action directly to the action manager. Rather you pass an object. Like this: `{type: 'nameOfAction', damage: 5, ... more properties}`.

### Cards

You have a deck of cards. Cards have different energy cost and can trigge other game actions when they are played.

1. Cards start in the "draw pile".
2. From there they are drawn to the "hand"
3. ...and finally, once played, to the "discard pile".

Once the draw pile is empty, and you attempt to draw, the discard pile is reshuffled into the draw pile.

Cards also have a `target` property to suggest which targets the card should affect. Targets include `player`, `enemyX` (where x is the monster's index, starting from 0) and `all enemies`.

### Powers

Cards can apply "powers". A power is a status effect or aura that usually lasts one or more turns. It can target the player, a monster or all enemies. A power could do literally anything, but an example is the "Vulnerable" power, which makes the target take 50% more damage for two turns.

As an example, setting `state.player.powers.weak = 5`, indicates that the player should be considered weak for five turns. Powers decrease by one stack per turn.

### The player

On `state.player` we have you, the player. This object describes the health, powers and the cards you have.

### Dungeon

Every game starts in a dungeon. You fight your way through one or more rooms to reach the end, where you win the game.

There are different types of rooms. Like Monster and Campfire. One day there'll be more like Merchant and Treasure or a "random" room.

Later it'd be cool to have real maps like Slay The Spire, where there are multiple paths to take.

### Monsters

Monsters exist inside the rooms in a dungeon. A monster has some health and a list of "intents" that it will take each turn. These intents are basically the AI. Monsters can do damage, block and apply powers. It's not super flexible, as we're not using actions and cards like the player does. But it is enough for now.

## References

A collection of related links, inspiration and ideas.

- FTL, Into The Breach, Darkest Dungeon, Dungeon of the Endless, Spelunky, Rogue Legacy,
- [Pollywog Games: A history of roguelite deck building games](https://pollywog.games/rgdb/)
- http://stfj.net/index2.php?project=art/2011/Scoundrel.pdf
- http://stfj.net/index2.php?year=2018&project=art/2018/Pocket-Run%20Pool
- http://www.cardcrawl.com/
- http://www.cardofdarkness.com/
- https://freesound.org/
- https://game-icons.net/
- https://github.com/Gremious/StS-DefaultModBase
- https://github.com/RonenNess/RPGUI
-	https://github.com/daviscook477/BaseMod
- https://github.com/kiooeht/Hubris/
- https://github.com/kiooeht/StSLib/wiki/Power-Hooks
- https://hundredrabbits.itch.io/donsol [Source](https://github.com/hundredrabbits/Donsol/tree/master/desktop/sources/scripts)
- https://itch.io/games/tag-card-game/tag-roguelike
- https://nathanwentworth.itch.io/deck-dungeon [Source](https://github.com/nathanwentworth/deck-dungeon/)
- https://en.wikipedia.org/wiki/Slay_the_Spire
- https://slay-the-spire.fandom.com/wiki/Slay_the_Spire_Wiki
- https://spirelogs.com/
- https://twitter.com/fabynou/status/1212534790672408578
- https://www.gamasutra.com/blogs/JoshGe/20181029/329512/How_to_Make_a_Roguelike.php
- https://www.gdcvault.com/play/1025731/-Slay-the-Spire-Metrics
- https://www.reddit.com/r/roguelikedev/
- https://www.reddit.com/r/slaythespire/comments/a7lhpq/any_recommended_games_similar_to_slay_the_spire/
- https://www.gdcvault.com/play/1025731/-Slay-the-Spire-Metrics
- https://github.com/Dementophobia/slay-the-spire-sensei
- https://www.rockpapershotgun.com/2018/02/19/why-revealing-all-is-the-secret-of-slay-the-spires-success/
- [Slay the Spire Reference](https://docs.google.com/spreadsheets/u/1/d/1ZsxNXebbELpcCi8N7FVOTNGdX_K9-BRC_LMgx4TORo4/edit?usp=sharing)
- [Slay the Spire Discord](https://discord.gg/slaythespire)
- https://klei.com/games/griftlands
- https://github.com/adnzzzzZ/blog
