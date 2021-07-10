## Installation

There are multiple options for installing flipnote.js, depending on your use-case and familiarity with JavaScript. Once you've installed the library, check out the {@page Recipes} page for some quick usage tips.

### From a CDN (web)

This is the simplest way to embed the library in your web project, since you don't have to host the script yourself and you will automatically recieve updates until the next major version. Just drop the following snippet into the `<head></head>` of your page's HTML:

```html
<script src="https://cdn.jsdelivr.net/npm/flipnote.js@5"></script>
```

When including the library this way, all of the [global exports](#global-exports) will be available on `window.flipnote`.

### Self-host (web)

You can also download the latest version of the library and self-host it on your own server if you prefer. You will have to manage updates yourself this way, but it's more secure.

[**Development version**](https://raw.githubusercontent.com/jaames/flipnote.js/master/dist/flipnote.js)<br/>
Uncompressed, with source comments included. Intended for debugging.

[**Production version**](https://raw.githubusercontent.com/jaames/flipnote.js/master/dist/flipnote.min.js)<br/>
Minified and optimized version.

When including the library this way, all of the [global exports](#global-exports) will be available on `window.flipnote`.

### From NPM (web, node)

Flipnote.js is also available as a package on [NPM](https://www.npmjs.com/package/flipnote.js). For this, you'll need a NodeJS environment set up and access to a command line. 

To use this method on the web, you should run your code through a bundler like [Parcel](https://parceljs.org/getting_started.html), [Rollup](https://rollupjs.org/guide/en/), or [Webpack](https://webpack.js.org/).

You can import the library the old `require()` way:

```js
const flipnote = require('flipnote.js');
```

Or via ES6 imports if they are supported in your environment:

```js
import flipnote from 'flipnote.js';
```

When using the library this way, all of the [global exports](#global-exports) will be available as the [default import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Importing_defaults).

### Typescript

Flipnote.js exports comprehensive type definitions for [Typescript](https://www.typescriptlang.org/), which will be included automatically when you import the library from NPM. 

Using Typescript isn't necessary, but it is highly recommended if you are using flipnote.js for any critical infrastructure such as Flipnote conversion services, since it will help you catch type errors at compile time rather than when your code is running.

In some cases, you may want to use types separately from the core library. For example, if you wanted to only import the {@link Flipnote} and {@link FlipnoteFormat} types, you could do:

```ts
import { Flipnote, FlipnoteFormat } from 'flipnote.js';

// Then you can use these as Typescript types like:
const note: Flipnote;

// load a note...

if (note.format === FlipnoteFormat.KWZ) {
  // only run this code if the note is a KWZ...
}
```

## Global exports

Flipnote.js exports the following interfaces globally:

- {@link parseSource}
- {@link PpmParser}
- {@link KwzParser}
- {@link Player}
- {@link GifImage}
- {@link WavAudio}
- {@link WebglCanvas}
- {@link Html5Canvas}
- {@link UniversalCanvas}
- {@link WebAudioPlayer}
- {@link version}

For Typescript, it also exports the following types:

- {@link Flipnote}
- {@link FlipnoteFormat}
- {@link FlipnoteVersion}
- {@link FlipnoteRegion}
- {@link FlipnoteMeta}
- {@link FlipnotePaletteColor}
- {@link FlipnotePaletteDefinition}
- {@link FlipnoteLayerVisibility}
- {@link FlipnoteAudioTrack}
- {@link FlipnoteAudioTrackInfo}
- {@link FlipnoteSoundEffectTrack}
- {@link FlipnoteSoundEffectFlags}
- {@link FlipnoteParserSettings}
- {@link KwzParserSettings}
- {@link PpmParserSettings}
- {@link PlayerEvent}
- {@link PlayerMixin}
- {@link CanvasInterface}