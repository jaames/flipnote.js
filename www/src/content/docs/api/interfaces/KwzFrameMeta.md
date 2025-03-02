---
editUrl: false
next: false
prev: false
title: "KwzFrameMeta"
---

Defined in: [src/parsers/KwzParser.ts:166](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/parsers/KwzParser.ts#L166)

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
