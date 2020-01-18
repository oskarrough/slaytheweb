# Kortgame

Many ways to go. This is the first.

We need

- A deck of cards
- Cards have different cost and actions
- An action could be draw a card, deal damage, everything is an action
- All actions are queued

## Encounters

encounter
add monster
start encounter

## Basics

deck
draw
fight
gold
hand
player
maxHealth = startingHealth
currentHealth
energy
gold
Cards
card.use()

## Queue

actionQueue[]
.addToTop()
.addToBottom()


## Anytime

* `gold add [amount]` gain gold
* `gold lose [amount]` lose gold
* `info toggle` Settings.isInfo
* `potion [pos] [id]` gain specified potion in specified slot (0, 1, or 2)
* `hp add [amount]` heal amount
* `hp remove [amount]` hp loss
* `maxhp add [amount]` gain max hp
* `maxhp remove [amount]` lose max hp
* `debug [true/false]` sets `Settings.isDebug`

## Relics

* `relic add [id]` generate relic
* `relic list` logs all relic pools
* `relic remove [id]` lose relic

## Unlocks

* `unlock always` always gain an unlock on death
* `unlock level [level]` set the gained unlock to be the specified level

## Cards

```python
public enum CardTarget {
	ENEMY, ALL_ENEMY, SELF, NONE, SELF_AND_ENEMY, ALL;
}

public enum CardColor {
	RED, GREEN, BLUE, PURPLE, COLORLESS, CURSE;
}

public enum CardRarity {
	BASIC, SPECIAL, COMMON, UNCOMMON, RARE, CURSE;
}

public enum CardType {
	ATTACK, SKILL, POWER, STATUS, CURSE;
}

public enum CardTags {
	HEALING, STRIKE, EMPTY, STARTER_DEFEND, STARTER_STRIKE;
}

enum GameMode {
	CHAR_SELECT, GAMEPLAY, DUNGEON_TRANSITION, SPLASH;
}
```

## Console Commands

### Deck Modification

* `deck add [id] {cardcount} {upgrades}` add card to deck (optional: integer # of times you want to add this card) (optional: integer # of upgrades)
* `deck remove [id]` remove card from deck
* `deck remove all` remove all cards from deck

### During Combat

* `draw [num]` draw cards
* `energy add [amount]` gain energy
* `energy inf` toggles infinite energy
* `energy remove [amount]` lose energy
* `hand add [id] {cardcount} {upgrades}` add card to hand with (optional: integer # of times to add the card) (optional: integer # of upgrades)
* `hand remove all` exhaust entire hand
* `hand remove [id]` exhaust card from hand
* `kill all` kills all enemies in the current combat
* `kill self` kills your character
* `power [id] [amount]` bring up a targetting reticle to apply amount stacks of a power to either the player or an enemy

### Outside of Combat

* `fight [name]` enter combat with the specified encounter
* `event [name]` start event with the specified name

### Anytime

* `gold add [amount]` gain gold
* `gold lose [amount]` lose gold
* `info toggle` Settings.isInfo
* `potion [pos] [id]` gain specified potion in specified slot (0, 1, or 2)
* `hp add [amount]` heal amount
* `hp remove [amount]` hp loss
* `maxhp add [amount]` gain max hp
* `maxhp remove [amount]` lose max hp
* `debug [true/false]` sets `Settings.isDebug`

### Relics

* `relic add [id]` generate relic
* `relic list` logs all relic pools
* `relic remove [id]` lose relic

### Unlocks

* `unlock always` always gain an unlock on death
* `unlock level [level]` set the gained unlock to be the specified level

### Acts

* `act boss` brings you directly to the bossroom of your current act
* `act [actname]` brings you to the start of the specified act

### Keys to Act 4

* `key add [color | all]` adds the corresponding key/s to your current run
* `key lose [color | all]` removes the corresponding key/s from your current run

### History

* `history random` gives you the relics and deck of a past successful run with your current character at random
* `history last` gives you the relics and deck of the last successful run with your current character

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

