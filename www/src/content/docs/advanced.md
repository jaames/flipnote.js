---
title: Advanced
---

# Partial Builds

If you have installed the library via NPM, you can optionally import only the parts of the library you need, which will reduce the size of your bundle and improve load times.

| Path | Exports |
| --- | --- |
| `flipnote.js` | All exports |
| `flipnote.js/webcomponent` | All exports, plus the Web Components |
| `flipnote.js/PpmParser` | [PpmParser](/api/classes/ppmparser/) |
| `flipnote.js/KwzParser` | [KwzParser](/api/classes/kwzparser/) |
| `flipnote.js/Player` | [Player](/api/classes/player/) |
| `flipnote.js/playlist` | [PpmPlaylist](http://localhost:4322/api/namespaces/playlist/classes/ppmplaylist), [KwzPlaylist](http://localhost:4322/api/namespaces/playlist/classes/kwzplaylist) |
| `flipnote.js/filename` | All exports from [filename](/api/namespaces/filename/) |
| `flipnote.js/id` | All exports from [id](/api/namespaces/id/) |
| `flipnote.js/renderers` | [WebGlCanvas](/api/classes/webglcanvas/), [Html5Canvas](/api/classes/html5canvas/), [UniversalCanvas](/api/classes/universalcanvas/) |

# Typescript

Flipnote.js exports comprehensive type definitions for [Typescript](https://www.typescriptlang.org/), which will be included automatically when you import the library from NPM. 

Using Typescript isn't necessary, but it is highly recommended if you are using flipnote.js for any critical infrastructure such as Flipnote conversion services, since it will help you catch type errors at compile time rather than when your code is running.

In some cases, you may want to use types separately from the core library. For example, if you wanted to only import the 
[Flipnote](/api/type-aliases/flipnote/) and [FlipnoteFormat](/api/enumerations/flipnoteformat/) types, you could do:

```ts
import type { Flipnote, FlipnoteFormat } from 'flipnote.js';

// Then you can use these as Typescript types like:
const note: Flipnote;

// load a note...

if (note.format === FlipnoteFormat.KWZ) {
  // only run this code if the note is a KWZ...
}
```