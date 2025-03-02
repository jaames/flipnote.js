---
editUrl: false
next: false
prev: false
title: "parse"
---

> **parse**(`format`, `source`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`PpmPlaylist`](/api/namespaces/playlist/classes/ppmplaylist/) \| [`KwzPlaylist`](/api/namespaces/playlist/classes/kwzplaylist/)\>

Defined in: [src/parsers/playlist/parse.ts:11](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/playlist/parse.ts#L11)

Parse a playlist file (.pls or .lst) from Flipnote Studio or Flipnote Studio 3D.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `format` | [`FlipnoteFormat`](/api/enumerations/flipnoteformat/) \| `"ppm"` \| `"kwz"` |
| `source` | `any` |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`PpmPlaylist`](/api/namespaces/playlist/classes/ppmplaylist/) \| [`KwzPlaylist`](/api/namespaces/playlist/classes/kwzplaylist/)\>
