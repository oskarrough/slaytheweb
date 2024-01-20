# Slay the Web

A digital, single player deckbuilding roguelike card game for the web based on Slay The Spire,  
a fantastic video game designed by [MegaCrit](https://www.megacrit.com/).


### [Play on slaytheweb.cards](https://slaytheweb.cards/) 
### [Chat on #slaytheweb:matrix.org](https://matrix.to/#/#slaytheweb:matrix.org)

<a href="https://slaytheweb.cards"><img src="https://i.imgur.com/m9CRCsa.png" alt="Screenshot of Slay the Web" width="640"></a>

After many runs in the Spire, I got into the theory behind the game. Inspired by the STS modding community, I thought it'd be fun and a great learning experience to try and implement the core logic of the game in JavaScript for the web. And that is what _Slay the Web_ is: a kind of stable, UI agnostic game engine with an example UI for the web.

## State of the game

December 2023. The core mechanics seem to work. There is a [dynamic map](https://slaytheweb.cards/map-demo) you can navigate with different rooms and monsters. You can fight against them using your cards and their powers.

There are many things that would make it more fun to play:

- new cards
- new powers
- more monsters
- expand the map into multiple "worlds" (or acts...)
- better UI and animations
- optimize UI for mobile

See the [open issues](https://github.com/oskarrough/slaytheweb/issues). Have an idea? Please [open a new issue](https://github.com/oskarrough/slaytheweb/issues/new).

## Documentation

If you're interested in contributing to the game or merely curious how it works:

- [The documentation](DOCUMENTATION.md)

Or browse the code. Especially the game logic includes tons of comments (written in JSDoc).

## Development

TLDR;

1. Clone the repository
2. Run `npm install` followed by `npm run dev` to open a local development server.

The `src/game` folder contains the actual game logic.  
The `src/ui` folder is the website UI where you can actually play the game.  
The `src/content` folder builds content for the game.

## How to deploy it

The `main` branch automatically deploys to https://slaytheweb.cards, via the Vercel service.  
If you open a PR, it'll give you a preview URL as well for testing.

## References

<details>
  <summary>A collection of related links, inspiration and ideas.</summary>

- FTL, Into The Breach, Darkest Dungeon, Dungeon of the Endless, Spelunky, Rogue Legacy,
- [Pollywog Games: A history of roguelite deck building games](https://pollywog.games/rgdb/)
- http://stfj.net/index2.php?project=art/2011/Scoundrel.pdf
- http://stfj.net/index2.php?year=2018&project=art/2018/Pocket-Run%20Pool
- http://www.cardcrawl.com/
- http://www.cardofdarkness.com/
- https://freesound.org/
- https://game-icons.net/
- https://github.com/RonenNess/RPGUI
- https://hundredrabbits.itch.io/donsol [Source](https://github.com/hundredrabbits/Donsol/tree/master/desktop/sources/scripts)
- https://itch.io/games/tag-card-game/tag-roguelike
- https://nathanwentworth.itch.io/deck-dungeon [Source](https://github.com/nathanwentworth/deck-dungeon/)
- https://www.reddit.com/r/slaythespire/comments/a7lhpq/any_recommended_games_similar_to_slay_the_spire/
- https://twitter.com/fabynou/status/1212534790672408578
- https://www.gamasutra.com/blogs/JoshGe/20181029/329512/How_to_Make_a_Roguelike.php
- https://www.reddit.com/r/roguelikedev/
- https://www.reddit.com/r/roguelikes/
- https://klei.com/games/griftlands
- https://forgottenarbiter.github.io/Is-Every-Seed-Winnable/
- https://www.cloudfallstudios.com/blog/2020/11/2/game-design-tips-reverse-engineering-slay-the-spires-decisions
- https://www.cloudfallstudios.com/blog/2018/5/7/guide-deckbuilder-tips-for-beginners-prompts-for-the-experienced-part-23
- https://mitadmissions.org/blogs/entry/slay-the-spire-as-metaphor/

### Slay the Spire modding, tools and things

- https://en.wikipedia.org/wiki/Slay_the_Spire
- https://slay-the-spire.fandom.com/wiki/Slay_the_Spire_Wiki
- https://spirelogs.com/
- https://maybelatergames.co.uk/tools/slaythespire/		
- https://github.com/daviscook477/BaseMod
- https://github.com/Gremious/StS-DefaultModBase
- https://github.com/Gremious/StS-DefaultModBase/wiki
- https://github.com/kiooeht/Hubris/
- https://github.com/kiooeht/StSLib/wiki/Power-Hooks
- https://www.gdcvault.com/play/1025731/-Slay-the-Spire-Metrics
- https://github.com/Dementophobia/slay-the-spire-sensei
- https://www.rockpapershotgun.com/2018/02/19/why-revealing-all-is-the-secret-of-slay-the-spires-success/
- [Slay the Spire Reference spreadsheet](https://docs.google.com/spreadsheets/u/1/d/1ZsxNXebbELpcCi8N7FVOTNGdX_K9-BRC_LMgx4TORo4/edit?usp=sharing)
- [Slay the Spire Discord](https://discord.gg/slaythespire)
- https://github.com/adnzzzzZ/blog
- https://forgottenarbiter.github.io/Is-Every-Seed-Winnable/ ([discussion](https://news.ycombinator.com/item?id=23910006))
- https://www.twitch.tv/telnetthespire
- [Slay the Spire Reference Spreadsheet](https://docs.google.com/spreadsheets/u/1/d/1ZsxNXebbELpcCi8N7FVOTNGdX_K9-BRC_LMgx4TORo4/edit#gid=1146624812)
- https://alexdriedger.github.io/SlayTheSpireModding/

### Typeface

Licenced from https://mbtype.com/

### Open source artwork

- http://ronenness.github.io/RPGUI/
- https://github.com/game-icons/icons 
- https://www.fromoldbooks.org/
- https://www.oldbookart.com/

</details>
