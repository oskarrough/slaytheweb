# Public

This is the full source code of the game _and_ UI. The folder is meant to be deployed as-is to any static web server.

>  Note: the game logic does not concern with the UI

Here's an overview of the contents:

- [game](game) contains the core game logic
- [content](content) uses methods from the game engine to build cards, dungeon and monsters
- [ui](ui) is the example web interface to actually play the game
- [web_modules](web_modules) contains our third party dependencies, loaded as es modules
