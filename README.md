# Slay the Web

This is a browser-based card game and engine based on Slay The Spire, a fantastic video game designed by [MegaCrit](https://www.megacrit.com/):

> We fused card games and roguelikes together to make the best single player deckbuilder we could. Craft a unique deck, encounter bizarre creatures, discover relics of immense power, and Slay the Spire!

### 🎴 [Play now on https://slaytheweb.cards](https://slaytheweb.cards/)

<a href="https://slaytheweb.cards"><img src="https://i.imgur.com/m9CRCsa.png" alt="Screenshot of Slay the Web" width="640"></a>

After many runs in the Spire, I really got into the theory behind the game. Inspired by the STS modding community, I thought it'd be neat and a great learning experience to try and implement the core logic of the game in JavaScript for the web. And that is what _Slay the Web_ is: a kind of stable, UI agnostic game engine and an example UI for the web.

## Documentation

If you're interested in contributing to the game or merely curious how it works, see [the documentation](DOCUMENTATION.md).

TLDR; Clone the repository and open the `public` folder in a web browser. The code is written in a way so no compiling is necessary. The `public/game` folder contains the actual game logic and the `public/ui` folder is the website UI where you can actually play the game. To ease development, you can run `npm install; npm start` to get a live-reloading server, although this is not required.

## How to deploy it

The `main` branch automatically deploys to https://slaytheweb.cards, via the Vercel service, every time it is pushed to.  
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

### Slay the Spire modding, tools and things

- https://en.wikipedia.org/wiki/Slay_the_Spire
- https://slay-the-spire.fandom.com/wiki/Slay_the_Spire_Wiki
- https://spirelogs.com/
- https://maybelatergames.co.uk/tools/slaythespire/		
-	https://github.com/daviscook477/BaseMod
- https://github.com/Gremious/StS-DefaultModBase
-	https://github.com/Gremious/StS-DefaultModBase/wiki
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

### Open source artwork

- http://ronenness.github.io/RPGUI/
- https://github.com/game-icons/icons 
- https://www.fromoldbooks.org/
- https://www.oldbookart.com/

</details>
