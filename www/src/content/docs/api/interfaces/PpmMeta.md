---
editUrl: false
next: false
prev: false
title: "PpmMeta"
---

Defined in: [src/parsers/PpmParser.ts:98](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L98)

PPM file metadata, stores information about its playback, author details, etc

## Extends

- [`FlipnoteMeta`](/api/interfaces/flipnotemeta/)

## Properties

| Property | Type | Description | Inherited from |
| :------ | :------ | :------ | :------ |
| <a id="bgmspeed"></a> `bgmSpeed` | `number` | In-app frame playback speed when the BGM audio track was recorded | - |
| <a id="lock"></a> `lock` | `boolean` | File lock state. Locked Flipnotes cannot be edited by anyone other than the current author | [`FlipnoteMeta`](/api/interfaces/flipnotemeta/).[`lock`](/api/interfaces/flipnotemeta/#lock) |
| <a id="loop"></a> `loop` | `boolean` | Playback loop state. If `true`, playback will loop once the end is reached | [`FlipnoteMeta`](/api/interfaces/flipnotemeta/).[`loop`](/api/interfaces/flipnotemeta/#loop) |
| <a id="advancedtools"></a> `advancedTools` | `boolean` | If `true`, the Flipnote was created using the "Advanced" toolset. This is only used by KWZ files. | [`FlipnoteMeta`](/api/interfaces/flipnotemeta/).[`advancedTools`](/api/interfaces/flipnotemeta/#advancedtools) |
| <a id="isspinoff"></a> `isSpinoff` | `boolean` | Spinoffs are remixes of another user's Flipnote | [`FlipnoteMeta`](/api/interfaces/flipnotemeta/).[`isSpinoff`](/api/interfaces/flipnotemeta/#isspinoff) |
| <a id="framecount"></a> `frameCount` | `number` | Total number of animation frames | [`FlipnoteMeta`](/api/interfaces/flipnotemeta/).[`frameCount`](/api/interfaces/flipnotemeta/#framecount) |
| <a id="framespeed"></a> `frameSpeed` | `number` | In-app frame playback speed | [`FlipnoteMeta`](/api/interfaces/flipnotemeta/).[`frameSpeed`](/api/interfaces/flipnotemeta/#framespeed) |
| <a id="thumbindex"></a> `thumbIndex` | `number` | Index of the animation frame used as the Flipnote's thumbnail image | [`FlipnoteMeta`](/api/interfaces/flipnotemeta/).[`thumbIndex`](/api/interfaces/flipnotemeta/#thumbindex) |
| <a id="timestamp"></a> `timestamp` | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | Date representing when the file was last edited | [`FlipnoteMeta`](/api/interfaces/flipnotemeta/).[`timestamp`](/api/interfaces/flipnotemeta/#timestamp) |
| <a id="duration"></a> `duration` | `number` | Flipnote duration measured in seconds, assuming normal playback speed | [`FlipnoteMeta`](/api/interfaces/flipnotemeta/).[`duration`](/api/interfaces/flipnotemeta/#duration) |
| <a id="root"></a> `root` | [`FlipnoteVersion`](/api/interfaces/flipnoteversion/) | Metadata about the author of the original Flipnote file | [`FlipnoteMeta`](/api/interfaces/flipnotemeta/).[`root`](/api/interfaces/flipnotemeta/#root) |
| <a id="parent"></a> `parent` | [`FlipnoteVersion`](/api/interfaces/flipnoteversion/) | Metadata about the previous author of the Flipnote file | [`FlipnoteMeta`](/api/interfaces/flipnotemeta/).[`parent`](/api/interfaces/flipnotemeta/#parent) |
| <a id="current"></a> `current` | [`FlipnoteVersion`](/api/interfaces/flipnoteversion/) | Metadata about the current author of the Flipnote file | [`FlipnoteMeta`](/api/interfaces/flipnotemeta/).[`current`](/api/interfaces/flipnotemeta/#current) |
