# Slay the Web

[Slay The Spire](https://www.megacrit.com/) by Mega Crit is a single player, roguelike deckbuilding video card game.

> We fused card games and roguelikes together to make the best single player deckbuilder we could. Craft a unique deck, encounter bizarre creatures, discover relics of immense power, and Slay the Spire!

They did a fantastic job with the game design that I wanted to learn more, so I tried implementing my own version of the game, for the web. I've studied the source code of the decompiled game, looked at community mods and want to give credit to all the STS fans out there.

This repository has two points of interest.

1. A game engine in `./public/game` with tests in `./tests`. Use this to build your own game using actions. The engine does not concern with rendering.

2. An example interface (website) in `./public/index.js` using the game engine

## Development setup

The `public` folder is meant to be deployed to any static web server and runs without the need of compiling anything.

To develop locally:

1. `yarn build` to pull ESM dependencies into ./public/web_modules 
2. `yarn start` for a server that reloads on file change

All scripts are checked with eslint, formatted with prettier and tested with ava.

- `yarn test` tests once
- `yarn test:watch` tests continously

## Game Engine 

Here I'll try to summarize the main concepts.

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

### Dungeon

Every game starts in a dungeon. A dungeon has a path of rooms. There are different types of rooms: Monster and Campfire. One day there'll be more like Merchant and Treasure or a "random" room.

## Links

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
