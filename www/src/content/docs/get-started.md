---
title: Get Started
---

## Installation

There are multiple options for installing flipnote.js, depending on your use-case and familiarity with JavaScript. Once you've installed the library, check out the [Recipes](/recipes) page for some quick usage tips.

### From a CDN (web)

This is the most straightforward way to embed the library in your web project, since you don't have to host the script yourself and you will automatically receive updates until the next major version. To use this, drop the following snippet into the `<head></head>` of your page's HTML:

```html
<script src="https://cdn.jsdelivr.net/npm/flipnote.js@6"></script>
```

When including the library this way, all of the [global exports](#global-exports) will be available on `window.flipnote`.

### Self-host (web)

You can also download the latest version of the library and self-host it on your own server if you prefer. You will have to manage updates yourself this way.

[**Development version**](https://raw.githubusercontent.com/jaames/flipnote.js/master/dist/flipnote.js)<br/>
Uncompressed, with source comments included. Intended for debugging.

[**Production version**](https://raw.githubusercontent.com/jaames/flipnote.js/master/dist/flipnote.min.js)<br/>
Minified and optimized version.

When including the library this way, all of the [global exports](#global-exports) will be available on `window.flipnote`.

### From NPM (web, node)

Flipnote.js is also available as a package on [NPM](https://www.npmjs.com/package/flipnote.js). For this, you'll need to have a NodeJS environment and access to a command line. 

To use this method on the web, you should run your code through a bundler like [Vite](https://vite.dev), [Parcel](https://parceljs.org/getting_started.html), [Rollup](https://rollupjs.org/guide/en/), or [Webpack](https://webpack.js.org/).

Then you can import the library via an ES6 import:

```js
import flipnote from 'flipnote.js';
```

Or via the old `require()` way:

```js
const flipnote = require('flipnote.js');
```

When using the library this way, all of the [global exports](#global-exports) will be available as the [default import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Importing_defaults).