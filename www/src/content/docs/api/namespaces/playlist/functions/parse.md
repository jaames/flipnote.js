---
editUrl: false
next: false
prev: false
title: "parse"
---

> **parse**(`format`, `source`): [`Promise ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<[`PpmPlaylist`](/api/namespaces/playlist/classes/ppmplaylist/) \| [`KwzPlaylist`](/api/namespaces/playlist/classes/kwzplaylist/)\>

Parse a playlist file (.pls or .lst) from Flipnote Studio or Flipnote Studio 3D.

## Parameters

• **format**: [`FlipnoteFormat`](/api/enumerations/flipnoteformat/) \| `"ppm"` \| `"kwz"`

• **source**: `any`

## Returns

[`Promise ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<[`PpmPlaylist`](/api/namespaces/playlist/classes/ppmplaylist/) \| [`KwzPlaylist`](/api/namespaces/playlist/classes/kwzplaylist/)\>

## Source

[src/parsers/playlist/parse.ts:11](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/playlist/parse.ts#L11)
