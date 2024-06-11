---
editUrl: false
next: false
prev: false
title: "KwzPlaylist"
---

Parses .lst playlist files from Flipnote Studio 3D.

File format documentation is at https://github.com/Flipnote-Collective/flipnote-studio-3d-docs/wiki/lst-format

## Extends

- `BasePlaylistParser`

## Constructors

### new KwzPlaylist()

> **new KwzPlaylist**(`buffer`): [`KwzPlaylist`](/api/namespaces/playlist/classes/kwzplaylist/)

#### Parameters

• **buffer**: [`ArrayBuffer ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer )

#### Returns

[`KwzPlaylist`](/api/namespaces/playlist/classes/kwzplaylist/)

#### Overrides

`BasePlaylistParser.constructor`

#### Source

[src/parsers/playlist/KwzPlaylist.ts:13](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/playlist/KwzPlaylist.ts#L13)

## Accessors

### bytes

> `get` **bytes**(): [`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )

Returns the data as an Uint8Array of bytes.

#### Returns

[`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )

#### Source

[src/utils/DataStream.ts:41](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/utils/DataStream.ts#L41)

***

### numBytes

> `get` **numBytes**(): `number`

Returns the total number of bytes in the data.

#### Returns

`number`

#### Source

[src/utils/DataStream.ts:48](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/utils/DataStream.ts#L48)

## Properties

### entries

> **entries**: [`Path`](/api/namespaces/playlist/interfaces/path/)[] = `[]`

List of filepaths in the playlist.

#### Inherited from

`BasePlaylistParser.entries`

#### Source

[src/parsers/playlist/Base.ts:52](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/playlist/Base.ts#L52)

***

### format

> **format**: [`FlipnoteFormat`](/api/enumerations/flipnoteformat/) = `FlipnoteFormat.KWZ`

#### Overrides

`BasePlaylistParser.format`

#### Source

[src/parsers/playlist/KwzPlaylist.ts:11](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/playlist/KwzPlaylist.ts#L11)

## Methods

### addEntry()

> **addEntry**(`full`): `void`

#### Parameters

• **full**: `string`

#### Returns

`void`

#### Inherited from

`BasePlaylistParser.addEntry`

#### Source

[src/parsers/playlist/Base.ts:58](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/playlist/Base.ts#L58)

***

### end()

> **end**(): `boolean`

#### Returns

`boolean`

#### Inherited from

`BasePlaylistParser.end`

#### Source

[src/utils/DataStream.ts:253](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/utils/DataStream.ts#L253)
