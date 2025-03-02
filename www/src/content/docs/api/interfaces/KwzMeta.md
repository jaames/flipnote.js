---
editUrl: false
next: false
prev: false
title: "KwzMeta"
---

Defined in: [src/parsers/KwzParser.ts:156](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/parsers/KwzParser.ts#L156)

KWZ file metadata, stores information about its playback, author details, etc

## Extends

- [`FlipnoteMeta`](/api/interfaces/flipnotemeta/)

## Properties

| Property | Type | Description | Inherited from |
| :------ | :------ | :------ | :------ |
| <a id="creationtimestamp"></a> `creationTimestamp` | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | Date representing when the file was created | - |
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
