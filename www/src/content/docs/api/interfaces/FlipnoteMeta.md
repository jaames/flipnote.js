---
editUrl: false
next: false
prev: false
title: "FlipnoteMeta"
---

Defined in: [src/parsers/types.ts:4](https://github.com/jaames/flipnote.js/blob/8ec10f089e866d1297261b52ab6750bd899577ce/src/parsers/types.ts#L4)

Flipnote details

## Extended by

- [`PpmMeta`](/api/interfaces/ppmmeta/)
- [`KwzMeta`](/api/interfaces/kwzmeta/)

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="lock"></a> `lock` | `boolean` | File lock state. Locked Flipnotes cannot be edited by anyone other than the current author |
| <a id="loop"></a> `loop` | `boolean` | Playback loop state. If `true`, playback will loop once the end is reached |
| <a id="advancedtools"></a> `advancedTools` | `boolean` | If `true`, the Flipnote was created using the "Advanced" toolset. This is only used by KWZ files. |
| <a id="isspinoff"></a> `isSpinoff` | `boolean` | Spinoffs are remixes of another user's Flipnote |
| <a id="framecount"></a> `frameCount` | `number` | Total number of animation frames |
| <a id="framespeed"></a> `frameSpeed` | `number` | In-app frame playback speed |
| <a id="thumbindex"></a> `thumbIndex` | `number` | Index of the animation frame used as the Flipnote's thumbnail image |
| <a id="timestamp"></a> `timestamp` | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | Date representing when the file was last edited |
| <a id="duration"></a> `duration` | `number` | Flipnote duration measured in seconds, assuming normal playback speed |
| <a id="root"></a> `root` | [`FlipnoteVersion`](/api/interfaces/flipnoteversion/) | Metadata about the author of the original Flipnote file |
| <a id="parent"></a> `parent` | [`FlipnoteVersion`](/api/interfaces/flipnoteversion/) | Metadata about the previous author of the Flipnote file |
| <a id="current"></a> `current` | [`FlipnoteVersion`](/api/interfaces/flipnoteversion/) | Metadata about the current author of the Flipnote file |
