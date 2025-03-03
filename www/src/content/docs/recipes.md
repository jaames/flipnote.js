---
title: Recipes
---

This page provides some basic recipes for achieving common tasks with the flipnote.js API. It assumes you have installed the library via one of the methods listed on the [Get Started](/get-started) guide, and have very basic working knowledge of HTML and JavaScript, including ES6 syntax and async/await.

- [Embedding a Flipnote player](#embedding-a-flipnote-player)
- [Opening a Flipnote](#opening-a-flipnote)
- [GIF conversion](#flipnote-gif-conversion)
- [WAV conversion](#flipnote-wav-conversion)
- [Flipnote verification](#flipnote-verification-web-node)

## Embedding a Flipnote player

The Web Component version of Flipnote.js provides a custom `<flipnote-player>` HTML tag that can be used to easily embed a Flipnote player UI in any webpage. For more information about this, check out the [Web Components](/web-components) page.

## Opening a Flipnote

The `flipnote.parse` function can be used to open a Flipnote file from a variety of different sources. This function will return a [Flipnote](/api/type-aliases/flipnote/) object that implements the [FlipnoteParser](/api/interfaces/FlipnoteParser/) API.

### Open a Flipnote from a URL (web, node)

Passing a string to `flipnote.parse` will attempt to load the Flipnote from the given URL:

```js
import flipnote from 'flipnote.js';

const note = await flipnote.parse('http://example.com/example.ppm');
// do something with the open note here...
```

### Open a Flipnote from the filesystem (node)

In NodeJS, passing a `Buffer` to `flipnote.parse` will attempt to load the Flipnote from the given file:

```js
import flipnote from 'flipnote.js';
import { promises as fs } from 'fs';

const file = await fs.readFile('./example.ppm');
const note = await flipnote.parse(file);
// do something with the open note here...
```

### Open a Flipnote from file input (web)

Add a file upload input to your HTML:

```html
<input type="file" id="input">
```

And use this JS to handle it:

```js
import flipnote from 'flipnote.js';

const inputElement = document.getElementById("input");

inputElement.addEventListener('change', handleFiles, false);

async function handleFiles() {
  const file = this.files[0];
  const note = await flipnote.parse(file);
  // do something with the open note here...
}
```

See also: [Using files from web applications](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications) on MDN.

## Flipnote GIF conversion

flipnote.js comes with a built-in GIF exporter, which is the easiest way to convert a single Flipnote frame - or the whole animation sequence - into a standard image format.

### Encode GIF (web, node)

The first step of GIF encoding is to create a [GitImage](/api/classes/gifimage/) from the Flipnote. This can then be saved in different ways depending on your use-case and environment.

To create a [GitImage](/api/classes/gifimage/) from a single animation frame:

```js
import flipnote from 'flipnote.js';

const note = await flipnote.parse('http://example.com/example.ppm');
const gif = flipnote.GifImage.fromFlipnoteFrame(note, 0);
```

To create a [GitImage](/api/classes/gifimage/) from the full animation sequence:

```js
import flipnote from 'flipnote.js';

const note = await flipnote.parse('http://example.com/example.ppm');
const gif = flipnote.GifImage.fromFlipnote(note);
```

### Save GIF (web)

In browser environments, it's recommended to use the `saveAs` function from the [FileSaver.js](https://github.com/eligrey/FileSaver.js/) library to trigger an instant download of the GIF:

```js
import flipnote from 'flipnote.js';

const note = await flipnote.parse('http://example.com/example.ppm');
const gif = flipnote.GifImage.fromFlipnote(note);

saveAs(gif.getBlob(), note.meta.current.filename + '.gif');
```

### Save GIF (node)

In NodeJS we can save the GIF to a file:

```js
import flipnote from 'flipnote.js';
import { promises as fs } from 'fs';

const file = await fs.readFile('./example.ppm');
const note = await flipnote.parse(file);

const buffer = gif.getBuffer();
await fs.writeFile(note.meta.current.filename + '.gif', buffer);
```

## Flipnote WAV conversion

flipnote.js also comes with a built-in WAV encoder, for converting Flipnote audio tracks into a standard audio format.

### Encode WAV (web, node)

The first step of WAV encoding is to create a [WavAudio](/api/classes/wavaudio/) from the Flipnote. As with GIF encoding, this can then be saved in different ways depending on your use-case and environment.

To create a [WavAudio](/api/classes/wavaudio/) from a single audio track:

```js
import flipnote from 'flipnote.js';

const note = await flipnote.parse('http://example.com/example.ppm');

// 0 = BGM
// 1 = SE1
// 2 = SE2
// 3 = SE3
// 4 = SE4
const wav = flipnote.WavAudio.fromFlipnoteTrack(note, 0);
```

To create a [WavAudio](/api/classes/wavaudio/) from the mixed audio master:

```js
import flipnote from 'flipnote.js';

const note = await flipnote.parse('http://example.com/example.ppm');
const wav = flipnote.WavAudio.fromFlipnote(note);
```

### Save WAV (web)

In browser environments, it's recommended to use the `saveAs` function from the [FileSaver.js](https://github.com/eligrey/FileSaver.js/) library to trigger an instant download of the WAV:

```js
import flipnote from 'flipnote.js';

const note = await flipnote.parse('http://example.com/example.ppm');
const wav = flipnote.WavAudio.fromFlipnote(note);

saveAs(wav.getBlob(), note.meta.current.filename + '.wav');
```

### Save WAV (node)

In NodeJS we can save the WAV to a file:

```js
import flipnote from 'flipnote.js';
import { promises as fs } from 'fs';

const file = await fs.readFile('./example.ppm');
const note = await flipnote.parse(file);
const wav = flipnote.WavAudio.fromFlipnote(note);
const buffer = wav.getBuffer();
await fs.writeFile(note.meta.current.filename + '.wav', buffer);
```

### Flipnote verification (web, node)

flipnote.js can perform public-key verification of a Flipnote's digital signature - this is the same process that the Flipnote Studio apps do when a Flipnote is loaded to make sure that it isn't corrupted.

Verifying a Flipnote is as simple as calling `note.verify()`, however you should be aware that this is asynchronous.

```js
import flipnote from 'flipnote.js';

const note = await flipnote.parse('http://example.com/example.ppm');
const isValid = await note.verify();
```