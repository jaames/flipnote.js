This page contains a bunch of recipes

## Opening a Flipnote

Opening a Flipnote will give you a {@link Flipnote} object that implements the {@link FlipnoteParserBase} API.

### Open a Flipnote from a URL (web, node)

```js
flipnote.parseSource('http://example.com/example.ppm')
then(note => {
  // do something with the open note here...
});
```

### Open a Flipnote from the filesystem (node)

```js
const fs = require('fs').promises;
const flipnote = require('flipnote.js');

fs.readFile('./example.ppm')
.then(file => flipnote.parseSource(file))
.then(note => {
  // do something with the open note here...
});
```

### Open a Flipnote from file upload (web)

Add a file upload input to your HTML:

```html
<input type="file" id="input">
```

And use this JS to handle it:

```js
const inputElement = document.getElementById("input");

inputElement.addEventListener('change', handleFiles, false);

function handleFiles() {
  const file = this.files[0];
  flipnote.parseSource(file)
  .then(note => {
    // do something with the open note here...
  });
}
```

See also: [Using files from web applications](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications) on MDN.

## Basic Flipnote export

This section assumes you have already opened your Flipnote as a {@link Flipnote} object called `note`.

### Encode GIF (web, node)

Returns a {@link GifImage}

Encode a single animation frame:

```js
const gif = flipnote.GifImage.fromFlipnoteFrame(note, 0);
```

Or encoder the full animation as a single GIF:

```js
const gif = flipnote.GifImage.fromFlipnote(note);
```

### Save GIF (web)

Returns a {@link GifImage}

```js
```

### Save GIF (node)

Returns a {@link GifImage}

```js
```

### Encode WAV