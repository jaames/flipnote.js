---
editUrl: false
next: false
prev: false
title: "PpmPlaylist"
---

Defined in: [src/parsers/playlist/PpmPlaylist.ts:12](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/playlist/PpmPlaylist.ts#L12)

Parses .pls and .lst playlist files from Flipnote Studio (DSiWare).

> This only supports playlists from version 2 of Flipnote Studio.
> Since version 1 was only ever released in Japan (and for a short period of time at that) I didn't bother including support.

File format documentation is at https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/.pls-and-.lst-files

## Extends

- `BasePlaylistParser`

## Constructors

### new PpmPlaylist()

> **new PpmPlaylist**(`buffer`): [`PpmPlaylist`](/api/namespaces/playlist/classes/ppmplaylist/)

Defined in: [src/parsers/playlist/PpmPlaylist.ts:16](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/playlist/PpmPlaylist.ts#L16)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `buffer` | [`ArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) |

#### Returns

[`PpmPlaylist`](/api/namespaces/playlist/classes/ppmplaylist/)

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

> **format**: [`FlipnoteFormat`](/api/enumerations/flipnoteformat/) = `FlipnoteFormat.PPM`

Defined in: [src/parsers/playlist/PpmPlaylist.ts:14](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/playlist/PpmPlaylist.ts#L14)

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
