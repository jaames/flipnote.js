---
title: Recipes
---

This page provides some basic recipes for achieving common tasks with the flipnote.js API. It assumes you have installed the library via one of the methods listed on the {@page Getting Started} guide, and have very basic working knowledge of HTML and JavaScript.

- [Embedding a Flipnote player](#embedding-a-flipnote-player)
- [Opening a Flipnote](#opening-a-flipnote)
- [GIF conversion](#gif-conversion)
- [WAV conversion](#wav-conversion)
- [Flipnote verification](#flipnote-verification)

## Embedding a Flipnote player

The Web Component version of Flipnote.js provides a custom `<flipnote-player>` HTML tag that can be used to easily embed a Flipnote player UI in any webpage. For more information about this, check out the {@page Web Components} page.

## Opening a Flipnote

Opening a Flipnote will give you a {@link Flipnote} object that implements the {@link FlipnoteParser} API.

### Open a Flipnote from a URL (web, node)

```js
flipnote.parseSource('http://example.com/example.ppm').then(note => {
  // do something with the open note here...
});
```

### Open a Flipnote from the filesystem (node)

```js
const flipnote = require('flipnote.js');
const fs = require('fs').promises;

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
  flipnote.parseSource(file).then(note => {
    // do something with the open note here...
  });
}
```

See also: [Using files from web applications](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications) on MDN.

## GIF conversion

flipnote.js comes with a built-in GIF exporter, which is the easiest way to convert a single Flipnote frame - or the whole animation sequence - into a standard image format. This section assumes you have already opened your Flipnote as a {@link Flipnote} object called `note`.

### Encode GIF (web, node)

The first step of GIF encoding is to create a {@link GifImage} from the Flipnote. This can then be saved in different ways depending on your use-case and environment.

To create a {@link GifImage} from a single animation frame:

```js
const gif = flipnote.GifImage.fromFlipnoteFrame(note, 0);
```

To create a {@link GifImage} from the full animation sequence:

```js
const gif = flipnote.GifImage.fromFlipnote(note);
```

### Save GIF (web)

In browser enviornments, it's recommended to use the `saveAs` function from the {@link https://github.com/eligrey/FileSaver.js/ | FileSaver.js} library to trigger an instant download of the GIF:

```js
saveAs(gif.getBlob(), note.meta.current.filename + '.gif');
```

### Save GIF (node)

In NodeJS we can save the GIF to a file:

```js
const fs = require('fs').promises;
const flipnote = require('flipnote.js');

// Open a Flipnote and convert it to a GifImage here...

const buffer = gif.getBuffer();
fs.writeFile(note.meta.current.filename + '.gif', buffer);
```

## WAV conversion

flipnote.js also comes with a built-in WAV encoder, for converting Flipnote audio tracks into a standard audio format. This section assumes you have already opened your Flipnote as a {@link Flipnote} object called `note`.

### Encode WAV (web, node)

The first step of WAV encoding is to create a {@link WavAudio} from the Flipnote. As with GIF encoding, this can then be saved in different ways depending on your use-case and environment.

To create a {@link WavAudio} from a single audio track:

```js
// 0 = BGM
// 1 = SE1
// 2 = SE2
// 3 = SE3
// 4 = SE4
const wav = flipnote.WavAudio.fromFlipnoteTrack(note, 0);
```

To create a {@link WavAudio} from the mixed audio master:

```js
const wav = flipnote.WavAudio.fromFlipnote(note);
```

### Save WAV (web)

In browser enviornments, it's recommended to use the `saveAs` function from the {@link https://github.com/eligrey/FileSaver.js/ | FileSaver.js} library to trigger an instant download of the WAV:

```js
saveAs(wav.getBlob(), note.meta.current.filename + '.wav');
```

### Save WAV (node)

In NodeJS we can save the WAV to a file:

```js
const fs = require('fs').promises;
const flipnote = require('flipnote.js');

// Open a Flipnote and convert it to a WavAudio here...

const buffer = wav.getBuffer();
fs.writeFile(note.meta.current.filename + '.wav', buffer);
```

### Flipnote verification

flipnote.js can perform public-key verification of a Flipnote's digital signature - this is the same process that the Flipnote Studio apps do when a Flipnote is loaded to make sure that it isn't corrupted.
This section assumes you have already opened your Flipnote as a {@link Flipnote} object called `note`.

Verifying a Flipnote is as simple as calling `note.verify()`, however you should be aware that this is asynchronous.

With the [Promise API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise):

```js
note.verify().then((isValid) => {
  // isValid is a boolean
  console.log('is Flipnote valid?', isValid);
});
```

Or with [`async` / `await`](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await):

```js
(async () => {
  // isValid is a boolean
  const isValid = await note.verify();
  console.log('is Flipnote valid?', isValid);
})();
```