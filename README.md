# Kortgame

A simplified, browser-based Slay The Spire inspired game that may or may not evolve into something else.

## Todo

Which parts do we want to do

- Game state logic (player, actions)
- First class console cli support
- A deck of cards (draw, random methods)

We can close this once we are able to draw a card onto an enemy and see the effects on game state.

Many ways to go. This is the first.

We need

- A deck of cards
- Cards have different cost and actions
- An action could be draw a card, deal damage, everything is an action
- All actions are queued

Let's figure out how to draw a deck, play it console-style no ui.

### Game state

use immer, supports undo and redo, store in local storage or even better, serialize and store everything in the url?

enum GameMode {
 	CHAR_SELECT, GAMEPLAY, DUNGEON_TRANSITION, SPLASH;
}

We want the game library/api to be independent of the UI?!

### Console

by this I mean being able to play the game with (almost) no gui. write the commands, see the effect directly on game state.

### Deck of cards

- list of cards
- a deck is some of the cards
- a hand is the currently picked cards from your deck

## Notes for later

### Basics

- deck
- draw
- fight
- gold
- hand
- player
- maxHealth = startingHealth
- currentHealth
- energy
- gold
- Cards
- card.use()

### Encounters

- encounter
- add monster
- start encounter

## Links

- https://kinopio.club/cardcrawl-UL_lam2QrnMLIw9meGOmX
- https://github.com/nathanwentworth/deck-dungeon/
- https://nathanwentworth.itch.io/deck-dungeon
- https://github.com/hundredrabbits/Donsol/tree/master/desktop/sources/scripts
- https://hundredrabbits.itch.io/donsol
- http://stfj.net/index2.php?project=art/2011/Scoundrel.pdf
- http://www.cardofdarkness.com/
- https://twitter.com/fabynou/status/1212534790672408578
- http://stfj.net/index2.php?year=2018&project=art/2018/Pocket-Run%20Pool
- https://pollywog.games/rgdb/
- http://www.cardcrawl.com/
- https://pollywog.games/ card crusade
- https://itch.io/games/tag-card-game/tag-roguelike
- https://github.com/daviscook477/BaseMod/wiki/Hooks
- https://github.com/daviscook477/BaseMod/wiki/Console
- https://slay-the-spire.fandom.com/wiki/Slay_the_Spire_Wiki
- https://freesound.org/
- https://www.gamasutra.com/blogs/JoshGe/20181029/329512/How_to_Make_a_Roguelike.php
- https://www.reddit.com/r/roguelikedev/
- https://game-icons.net/

