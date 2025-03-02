---
editUrl: false
next: false
prev: false
title: "parse"
---

> **parse**(`format`, `source`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`PpmPlaylist`](/api/namespaces/playlist/classes/ppmplaylist/) \| [`KwzPlaylist`](/api/namespaces/playlist/classes/kwzplaylist/)\>

Defined in: [src/parsers/playlist/parse.ts:11](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/parsers/playlist/parse.ts#L11)

Parse a playlist file (.pls or .lst) from Flipnote Studio or Flipnote Studio 3D.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `format` | [`FlipnoteFormat`](/api/enumerations/flipnoteformat/) \| `"ppm"` \| `"kwz"` |
| `source` | `any` |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`PpmPlaylist`](/api/namespaces/playlist/classes/ppmplaylist/) \| [`KwzPlaylist`](/api/namespaces/playlist/classes/kwzplaylist/)\>
