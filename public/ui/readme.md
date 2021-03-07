# UI

The UI is made with htm and preact. I've tried not to create too many components and abstractions, although this might come back to haunt us.

Everything starts with [index.html](https://github.com/oskarrough/slaytheweb/blob/main/public/ui/index.html). When loaded,
we  show a splash/welcome screen as defined in [index.js](https://github.com/oskarrough/slaytheweb/blob/main/public/ui/index.js).

Next, when you tap "Start Game", we load [app.js](https://github.com/oskarrough/slaytheweb/blob/main/public/ui/app.js). 
This one connects everything and manages the game state.

## Animations

See [animations.js](animations.js). Most are made with gsap.

## Sounds

See [sounds.js](sounds.js) using Tone.js.
