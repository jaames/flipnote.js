---
editUrl: false
next: false
prev: false
title: "KwzFrameMeta"
---

Defined in: [src/parsers/KwzParser.ts:166](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L166)

KWZ frame metadata, stores information about each frame, like layer depths sound effect usage

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="flags"></a> `flags` | `number`[] | Frame flags |
| <a id="layersize"></a> `layerSize` | `number`[] | Frame layer sizes |
| <a id="frameauthor"></a> `frameAuthor` | `string` | Frame author's Flipnote Studio ID |
| <a id="layerdepth"></a> `layerDepth` | `number`[] | Frame layer 3D depths |
| <a id="soundflags"></a> `soundFlags` | `number` | Frame sound |
| <a id="cameraflag"></a> `cameraFlag` | `number` | Whether this frame contains photos taken with the console's camera |
