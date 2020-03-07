# Slay the Web

Slay the Spire is a fantastic video card game designed by [MegaCrit](https://www.megacrit.com/) . They explain:

> We fused card games and roguelikes together to make the best single player deckbuilder we could. Craft a unique deck, encounter bizarre creatures, discover relics of immense power, and Slay the Spire!

After many runs in the Spire, I got really into the theory behind the game. Inspired by the modding community, I thought it'd be neat and a great learning experience to try and implement the core logic of the game for the web. And that is what _Slay the Web_ is. The idea is to provide a stable game logic to play the game with any kind of interface. Be it the browser, a command line or whatever. 

The `master` branch is automatically deployed to https://slaytheweb.now.sh/, where you can try it out!

## What's in the code?

- `./public/game` contains all the game logic, exposed with a lot of actions to modify game state. It does not use the DOM
- `./public/index.js` is an example interface/website made with preact+htm
- `./tests` contains quite a few tests in attempt to make sure this actually works

## How to develop on it

The `public` folder can be deployed to any static web server. It does not require any compilation, but it does require you to download a few dependencies:

To develop locally:

1. `yarn build` to pull ESM dependencies into ./public/web_modules 
2. `yarn start` for a server that reloads on file change

All scripts are checked with eslint, formatted with prettier and tested with ava.

- `yarn test` tests once
- `yarn test:watch` tests continously

## Current state of the game

Here I'll try to summarize the main concepts that are implemented.

### Game state

The main game state is a single, large object that stores everything needed to reproduce a certain state of the game. This is all you'll need to implement any interface for the game. The state is always modified using actions. An action takes a `state`, modifies it and returns a new one.

### Actions

An action is anything that modifies the game state, be it drawing a card, dealing damage or applying a debuff.

### Action Manager

All actions are enqueued and dequeued using an "action manager". This allows us to keep track of the history, undo things and control the flow of the game.

Run `enqueue(action)` to add to the list. Run `dequeue()` to update the state with the oldest action.

### Cards

You have a deck of cards. Cards have different energy cost and can trigger game actions. 

Cards start in the "draw pile". From there they are drawn to the "hand" and finally, once played, to the "discard pile". Once the draw pile is empty, the discard pile is reshuffled into the draw pile.

### Powers

Cards can optionally apply "powers". A power is an aura that usually lasts one or more turns. It can target the player, a monster or all enemies. A power could do literally anything, but an example is the "Vulnerable" power, which makes the target take 50% more damage for two turns.

### Dungeon

Every game starts in a dungeon. A dungeon has a path of rooms. There are different types of rooms: Monster and Campfire. One day there'll be more like Merchant and Treasure or a "random" room. Rooms are explored from first to last. Later it'd be cool to have real maps like Slay The Spire.

## Links

A collection of related things, inspiration and ideas.

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
- https://kinopio.club/cardcrawl-UL_lam2QrnMLIw9meGOmX
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
