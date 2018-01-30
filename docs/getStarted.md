## Download

[Development Version](https://raw.githubusercontent.com/jaames/flipnote.js/master/dist/flipnote.js) 
Uncompressed with comments at around 60kb.

[Production Version](https://raw.githubusercontent.com/jaames/flipnote.js/master/dist/ugomemo.min.js) 
Minified to 17kb. Use this one if you're unsure.

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

To set up a new player, we need to make a HTML [canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial) element with a unique identifier (an id attribute works well!) to act as a container. Also give it a width and height (for best results, `width` should be a multiple of `256`, and `height` should be a multiple of `192`. They can be anything you want though!)

```html
<canvas id="player-canvas" width="512" height="384"></canvas>
```

Now all we to use JavaScript to create a new instance of `ugomemo.player`, and tell it to use the container element we just made by providing a matching [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors), and the canvas' `width` and `height`.

*Please note that currently this script **must** be placed below the `<canvas>` element in your HTML*

```js
var player = new flipnote.player("#player-canvas", 512, 384);
```

After the player has been created you can then load a Flipnote into it from an ArrayBuffer. In this example we'll load a Flipnote from a URL via an SVH, but it's also possible to get an ArrayBuffer from a file upload or elsewhere:

```js
// create a player (as in the previous step)
var player = new flipnote.player("#player-canvas", 512, 384);

// make a new request for a Flipnote ppm at www.example.com/path/to/demo.ppm
var request = new XMLHttpRequest();
request.open("GET", "www.example.com/path/to/demo.ppm", true);
request.responseType = "arraybuffer";

// when the request loads, open the result in the player
request.onload = function (e) {
  player.open(request.response);
};

// finish the request
request.send(null);
```

Cool! Since flipnote.js is meant to provide a low-level Flipnote playback API you might notice that it doesn't provide any playback controls yet. The [Player API Docs](https://github.com/jaames/flipnote.js/blob/master/docs/playerAPI.md) should help you implement them, though. :)


