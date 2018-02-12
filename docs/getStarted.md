## Download

[Development Version](https://raw.githubusercontent.com/jaames/flipnote.js/master/dist/flipnote.js) 
Uncompressed with comments at around 70kb.

[Production Version](https://raw.githubusercontent.com/jaames/flipnote.js/master/dist/flipnote.min.js) 
Minified to 20kb. Use this one if you're unsure.

---

Alternatively, you can grab the latest version of flipnote.js from npm:

```bash
$ npm install flipnote.js
```

Then using a module bundler like Rollup or Webpack, you can import it like any other module:

```js
// Using ES6 module syntax
import flipnote from "flipnote.js";

// Using CommonJS
var flipnote = require("flipnote.js");
```

## Installation

Before starting you'll want to [download](#Download) flipnote.js and add it to your page. Once you've downloaded the script, add it to the `<head>` of your page with a `<script>` tag: 

```html
<html>
  <head>
    <!-- ... -->
    <script src="./path/to/flipnote.min.js"></script>
  </head>
  <!-- ... -->
</html>
```

## Basic Usage

To set up a new player, we need to make a HTML [canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial) element with a unique identifier (an `id` attribute works well!) to act as a container. Also give it a width and height (to maintain proper aspect ratio, `width` and `height` should be multiples of `256` and `192` respectively).

```html
<canvas id="player-canvas" width="512" height="384"></canvas>
```

Now all we to use JavaScript to create a new instance of `flipnote.player`, and tell it to use the container element we just made by providing a matching [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors), and the canvas' `width` and `height`.

*Please note that currently this script **must** be placed below the `<canvas>` element in your HTML*

```js
var player = new flipnote.player("#player-canvas", 512, 384);
```

After the player has been created, then a Flipnote can be loaded from a URL:

```js
// create a player (as in the previous step)
var player = new flipnote.player("#player-canvas", 512, 384);
player.open("www.example.com/path/to/demo.ppm");
```

Cool! Since flipnote.js is meant to provide a low-level Flipnote playback API you might notice that it doesn't provide any playback controls yet. The [Player API Docs](https://github.com/jaames/flipnote.js/blob/master/docs/playerAPI.md) should help you implement them, though. :)


