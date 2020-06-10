# flipnote.js

Enables browser-based playback of the proprietary animation formats used by [Flipnote Studio](https://en.wikipedia.org/wiki/Flipnote_Studio) and [Flipnote Studio 3D](https://en.wikipedia.org/wiki/Flipnote_Studio_3D), powered by [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API).

I hope that maybe in the long term it will serve some use in archiving Flipnote animations, epecially given that the online services for both applications have been closed down.

## Features

* Perfect image and audio playback for animation files from Flipnote Studio (`.ppm`) *and* Flipnote Studio 3D (`.kwz`)
* Full file parser implementations with metadata, frames, audio, etc
* Player API based on the HTML5 Video and Audio APIs
* Crisp upscaling/downscaling using sharp-bilinear shaders
* Built-in GIF and WAV converters
* Zero dependencies, only ~12kB when minified & gzipped :^)

## Demo

Check out [Flipnote Player](https://github.com/jaames/flipnote-player) for a live demo. :)

## Installation

### Install from NPM

```bash
$ npm install flipnote.js --save
```

Then if you are using a module bundler like Webpack or Rollup, import flipnote.js into your project:

```js
// Using ES6 module syntax
import flipnote from "flipnote.js";

// Using CommonJS
var flipnote = require("flipnote.js");
```

### Or use the jsDelivr CDN

Drop this script into the <head> of your page's HTML:

<script src="https://cdn.jsdelivr.net/npm/flipnote.js/dist/flipnote.js"></script>

When you manually include the library like this, flipnote.js will be made globally available on `window.flipnote`

### Or download and host yourself

[Development version](https://raw.githubusercontent.com/jaames/flipnote.js/master/dist/flipnote.js)
Uncompressed, with source comments included. Intended for debugging.

[Production version](https://raw.githubusercontent.com/jaames/flipnote.js/master/dist/flipnote.min.js)
Minified and optimized version.

## Player setup

To create a new player, we need to make a HTML [canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial) element with a unique identifier (an `id` attribute works well!) to act as a display for the player. 

Make sure that your canvas dimensions match the **3:4** aspect ratio used by Flipnotes.

```html
<canvas id="player-canvas" width="512" height="384"></canvas>
```

Then we can use some JavaScript to create a new instance of `flipnote.player`, and tell it to use the container element we just made by providing a matching [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors), and the canvas' `width` and `height`.

*Please note that this javascript **must** be placed after the `<canvas>` element in your HTML*

```js
var player = new flipnote.player("#player-canvas", 512, 384);
```

After the player has been created, then a Flipnote can be loaded from a URL:

```js
// create a player (as in the previous step)
var player = new flipnote.player("#player-canvas", 512, 384);
player.open("www.example.com/path/to/demo.ppm");
```

## Player API

### Constructor

**Arguments:**

* `{String | HTMLCanvasElement} canvas`

* `{Number} width`

* `{Number} height`

### Properties

#### type

Flipnote type; either "KWZ" for 3DS notes or "PPM" for DSi notes.

#### note

The underlying Flipnote parser object that the player is using.

#### duration

Get the Flipnote duration in seconds.

#### framerate

Get the Flipnote framerate as frames per second.

#### currentFrame

Get/set the index of the current frame being shown. When set to a new value the player will automatically jump to that frame.

#### currentTime

Get/set the current playback prosition in seconds, modelled after the [HTMLMediaElement property of the same name](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime). When set to a new value the player will automatically jump to that time.

#### progress

Get/set the playback progress as a percentage out of 100.

#### volume

Get/set the Flipnote audio volume. This should be a value between 0 and 1.

#### muted

Get/set whether the Flipnotes' audio should be muted.

#### loop

Get/set whether the Flipnote should loop back to the start when it reaches the end.

#### meta

An object containing details about the Flipnote, such as the author, timestamp, etc. This will be slightly different depending on the Flipnote type

#### layerVisibility 

An object containing the visibility status for each layer, e.g. `{ 1: true, 2: true, 3: true }`

### Methods

#### play

Begin Flipnote playback.

#### pause

Pause Flipnote playback.

#### on

Register an event callback. See [Events](#Events) for all event types.

**Arguments:**

* `{String} eventType`
* `{Function} callback`

**Example:**

```js
player.on("playback:start", function() {
  // do something...
})
```

#### off

Remove an event callback that was registered with [`on`](#on)

**Arguments:**

* `{String} eventType`
* `{Function} callback`

#### setFrame

Jump to a specified frame in the Flipnote.

**Arguments:**

* `{Number} index - frame index`

#### nextFrame

Jump to the next frame in the Flipnote. If `loop` is `true` and the Flipnote is on its last frame, it will jump to the first frame.

#### prevFrame

Jump to the previous frame in the Flipnote. If `loop` is `true` and the Flipnote is on its first frame, it will jump to the last frame.

#### firstFrame

Jump to the first frame in the Flipnote.

#### lastFrame

Jump to the last frame in the Flipnote.

#### thumbnailFrame

Jump to the frame being used as the Flipnote's thumbnail.

#### setLayerVisibility

Enable/disable layer visibility.

**Arguments**

* `{Number} layer` - Layer (either 1, 2, or 3)
* `{Boolean} isVisible` - Set to `false` to hide layer

#### resize

Resize the player canvas.

**Arguments:**

* `{Number} width` - New player width in pixels
* `{Number} height` - New player height in pixels

#### forceUpdate

Force the player to refresh.

#### clearEvents

Wipes all of the event listeners currently added to the player object.

### Events

#### load

Emitted when the player has finished loading a KWZ / PPM file.

#### error

Emitted if the player detected an error when playing the Flipnote file.

#### progress

Emitted whenever `currentTime` updates.

#### frame:update

Emitted whenever the current frame changes.

#### playback:start

Emitted whenever playback begins.

#### playback:stop

Emitted whenever playback is paused/stopped.

#### playback:end

Emitted whenever the Flipnote playback has finished (and loop=false).

#### playback:loop

Emitted whenever the Flipnote is about to enter another playback loop (and loop=true).

## Authors

* **[James Daniel](https://github.com/jaames)**

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Building

Install dependencies:
```
npm install
```

Produce build files:
```
npm run build
```

Run development server:
```
npm start
```

## Acknowledgments

* Flipnote.js implementation: [Jaames](https://github.com/jaames).
* KWZ format reverse-engineering: [Kinnay](https://github.com/Kinnay), [Khangaroo](https://github.com/khang06), [MrNbaYoh](https://github.com/MrNbaYoh), [Shutterbug](https://github.com/shutterbug2000), [Jaames](https://github.com/jaames).
* PPM format reverse-engineering & documentaion: [bricklife](http://ugomemo.g.hatena.ne.jp/bricklife/20090307/1236391313), [mirai-iro](http://mirai-iro.hatenablog.jp/entry/20090116/ugomemo_ppm), [harimau_tigris](http://ugomemo.g.hatena.ne.jp/harimau_tigris), [steven](http://www.dsibrew.org/wiki/User:Steven), [yellows8](http://www.dsibrew.org/wiki/User:Yellows8) and [PBSDS](https://github.com/pbsds), [Jaames](https://github.com/jaames).
* Identifying the PPM sound codec: Midmad from Hatena Haiku (no longer active) and WDLMaster from the [HCS forum](https://hcs64.com/mboard/forum.php).
* [PBSDS](https://github.com/pbsds) for creating [Hatena Tools](https://github.com/pbsds/Hatenatools), and for giving me some notes regarding areas where the documentation fell short. 
* Stichting Mathematisch Centrum for writing this [ADPCM to PCM converter in C](http://www.cs.columbia.edu/~gskc/Code/AdvancedInternetServices/SoundNoiseRatio/dvi_adpcm.c) which I semi-ported to JS to handle audio.
* Libretro for their [pixel art shaders](https://github.com/libretro/glsl-shaders), used as reference for the sharp-bilinear implementation
* [Austin Burk](https://sudomemo.net) and [JoshuaDoes](https://github.com/joshuadoes) for helping to debug my Python3 PPM parser (which I used as a reference for the JS decoder).
* [Lauren Kelly](https://github.com/thejsa) for performing packet captures of [Flipnote Hatena](http://flipnote.hatena.com/thankyou) before it shut down, without them reverse-engineering the app in general would have been a *huge* pain.
* [Nintendo](https://www.nintendo.com/) for creating the Flipnote Studio application.
* [Hatena](http://www.hatena.ne.jp/) for creating Flipnote Hatena, the now-defunct online service for sharing Flipnote Studio creations.
