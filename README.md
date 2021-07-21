## webaudio-music

Example project for real-time dynamic webaudio music.

----

This is a baseline project demonstrating my setup for working with
real-time procedural music in Web Audio. The main feature is that the 
musical logic is isolated into small modules that are 
[hot-reloadable](https://webpack.js.org/concepts/hot-module-replacement/), 
so one can hack on the algorithms in realtime while the music plays.

[Live demo](https://fenomas.github.io/webaudio-music/) ← what it sounds like 
out of the box (playing random nonmusical notes, for demo purposes).


## Usage

This project is meant to be forked and modified, not used as a dependency.

```sh
# (clone the repo)
cd webaudio-music
npm install
npm start
```

Now view the demo at `localhost:8080` or thereabouts, and start hacking. 
Any edits you save to the song modules (in `/demo/song/`) should take effect 
live in realtime, without reloading the page.


## Overview

The key moving parts are:

 * `src/index`: basic audio engine - does scheduling (bpm, look-ahead, etc), 
   and manages an audio chain (master volume and compressor)
 * `demo/lib/*`: rigging to manage audio nodes, hot-reloading, etc.
 * `demo/song/*`: song modules that decide what notes to play

The song modules are the bits that get hot-reloaded, so they can be 
hacked on in realtime as the music plays.

----

Made with 🍺 by [Andy Hall](https://twitter.com/fenomas).

License is ISC.
