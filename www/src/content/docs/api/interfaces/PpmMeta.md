---
editUrl: false
next: false
prev: false
title: "PpmMeta"
---

PPM file metadata, stores information about its playback, author details, etc

## Extends

- [`FlipnoteMeta`](/api/interfaces/flipnotemeta/)

## Properties

### bgmSpeed

> **bgmSpeed**: `number`

In-app frame playback speed when the BGM audio track was recorded

#### Source

[src/parsers/PpmParser.ts:97](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L97)

***

### lock

> **lock**: `boolean`

File lock state. Locked Flipnotes cannot be edited by anyone other than the current author

#### Inherited from

[`FlipnoteMeta`](/api/interfaces/flipnotemeta/).[`lock`](/api/interfaces/flipnotemeta/#lock)

#### Source

[src/parsers/types.ts:8](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/types.ts#L8)

***

### loop

> **loop**: `boolean`

Playback loop state. If `true`, playback will loop once the end is reached

#### Inherited from

[`FlipnoteMeta`](/api/interfaces/flipnotemeta/).[`loop`](/api/interfaces/flipnotemeta/#loop)

#### Source

[src/parsers/types.ts:12](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/types.ts#L12)

***

### isSpinoff

> **isSpinoff**: `boolean`

Spinoffs are remixes of another user's Flipnote

#### Inherited from

[`FlipnoteMeta`](/api/interfaces/flipnotemeta/).[`isSpinoff`](/api/interfaces/flipnotemeta/#isspinoff)

#### Source

[src/parsers/types.ts:16](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/types.ts#L16)

***

### frameCount

> **frameCount**: `number`

Total number of animation frames

#### Inherited from

[`FlipnoteMeta`](/api/interfaces/flipnotemeta/).[`frameCount`](/api/interfaces/flipnotemeta/#framecount)

#### Source

[src/parsers/types.ts:20](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/types.ts#L20)

***

### frameSpeed

> **frameSpeed**: `number`

In-app frame playback speed

#### Inherited from

[`FlipnoteMeta`](/api/interfaces/flipnotemeta/).[`frameSpeed`](/api/interfaces/flipnotemeta/#framespeed)

#### Source

[src/parsers/types.ts:24](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/types.ts#L24)

***

### thumbIndex

> **thumbIndex**: `number`

Index of the animation frame used as the Flipnote's thumbnail image

#### Inherited from

[`FlipnoteMeta`](/api/interfaces/flipnotemeta/).[`thumbIndex`](/api/interfaces/flipnotemeta/#thumbindex)

#### Source

[src/parsers/types.ts:28](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/types.ts#L28)

***

### timestamp

> **timestamp**: [`Date ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date )

Date representing when the file was last edited

#### Inherited from

[`FlipnoteMeta`](/api/interfaces/flipnotemeta/).[`timestamp`](/api/interfaces/flipnotemeta/#timestamp)

#### Source

[src/parsers/types.ts:32](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/types.ts#L32)

***

### duration

> **duration**: `number`

Flipnote duration measured in seconds, assuming normal playback speed

#### Inherited from

[`FlipnoteMeta`](/api/interfaces/flipnotemeta/).[`duration`](/api/interfaces/flipnotemeta/#duration)

#### Source

[src/parsers/types.ts:36](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/types.ts#L36)

***

### root

> **root**: [`FlipnoteVersion`](/api/interfaces/flipnoteversion/)

Metadata about the author of the original Flipnote file

#### Inherited from

[`FlipnoteMeta`](/api/interfaces/flipnotemeta/).[`root`](/api/interfaces/flipnotemeta/#root)

#### Source

[src/parsers/types.ts:40](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/types.ts#L40)

***

### parent

> **parent**: [`FlipnoteVersion`](/api/interfaces/flipnoteversion/)

Metadata about the previous author of the Flipnote file

#### Inherited from

[`FlipnoteMeta`](/api/interfaces/flipnotemeta/).[`parent`](/api/interfaces/flipnotemeta/#parent)

#### Source

[src/parsers/types.ts:44](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/types.ts#L44)

***

### current

> **current**: [`FlipnoteVersion`](/api/interfaces/flipnoteversion/)

Metadata about the current author of the Flipnote file

#### Inherited from

[`FlipnoteMeta`](/api/interfaces/flipnotemeta/).[`current`](/api/interfaces/flipnotemeta/#current)

#### Source

[src/parsers/types.ts:48](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/types.ts#L48)
