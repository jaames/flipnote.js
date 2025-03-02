---
editUrl: false
next: false
prev: false
title: "KwzPlaylist"
---

Defined in: [src/parsers/playlist/KwzPlaylist.ts:9](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/playlist/KwzPlaylist.ts#L9)

Parses .lst playlist files from Flipnote Studio 3D.

File format documentation is at https://github.com/Flipnote-Collective/flipnote-studio-3d-docs/wiki/lst-format

## Extends

- `BasePlaylistParser`

## Constructors

### new KwzPlaylist()

> **new KwzPlaylist**(`buffer`): [`KwzPlaylist`](/api/namespaces/playlist/classes/kwzplaylist/)

Defined in: [src/parsers/playlist/KwzPlaylist.ts:13](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/playlist/KwzPlaylist.ts#L13)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `buffer` | [`ArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) |

#### Returns

[`KwzPlaylist`](/api/namespaces/playlist/classes/kwzplaylist/)

#### Overrides

`BasePlaylistParser.constructor`

## Accessors

### bytes

#### Get Signature

> **get** **bytes**(): [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Defined in: [src/utils/DataStream.ts:41](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/utils/DataStream.ts#L41)

Returns the data as an Uint8Array of bytes.

##### Returns

[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

#### Inherited from

`BasePlaylistParser.bytes`

***

### numBytes

#### Get Signature

> **get** **numBytes**(): `number`

Defined in: [src/utils/DataStream.ts:48](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/utils/DataStream.ts#L48)

Returns the total number of bytes in the data.

##### Returns

`number`

#### Inherited from

`BasePlaylistParser.numBytes`

## Properties

### entries

> **entries**: [`Path`](/api/namespaces/playlist/interfaces/path/)[] = `[]`

Defined in: [src/parsers/playlist/Base.ts:52](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/playlist/Base.ts#L52)

List of filepaths in the playlist.

#### Inherited from

`BasePlaylistParser.entries`

***

### format

> **format**: [`FlipnoteFormat`](/api/enumerations/flipnoteformat/) = `FlipnoteFormat.KWZ`

Defined in: [src/parsers/playlist/KwzPlaylist.ts:11](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/playlist/KwzPlaylist.ts#L11)

#### Overrides

`BasePlaylistParser.format`

## Methods

### addEntry()

> **addEntry**(`full`): `void`

Defined in: [src/parsers/playlist/Base.ts:58](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/playlist/Base.ts#L58)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `full` | `string` |

#### Returns

`void`

#### Inherited from

`BasePlaylistParser.addEntry`

***

### end()

> **end**(): `boolean`

Defined in: [src/utils/DataStream.ts:253](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/utils/DataStream.ts#L253)

#### Returns

`boolean`

#### Inherited from

`BasePlaylistParser.end`
