---
editUrl: false
next: false
prev: false
title: "parse"
---

> **parse**(`format`, `source`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`PpmPlaylist`](/api/namespaces/playlist/classes/ppmplaylist/) \| [`KwzPlaylist`](/api/namespaces/playlist/classes/kwzplaylist/)\>

Defined in: [src/parsers/playlist/parse.ts:11](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/playlist/parse.ts#L11)

Parse a playlist file (.pls or .lst) from Flipnote Studio or Flipnote Studio 3D.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `format` | [`FlipnoteFormat`](/api/enumerations/flipnoteformat/) \| `"ppm"` \| `"kwz"` |
| `source` | `any` |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`PpmPlaylist`](/api/namespaces/playlist/classes/ppmplaylist/) \| [`KwzPlaylist`](/api/namespaces/playlist/classes/kwzplaylist/)\>
