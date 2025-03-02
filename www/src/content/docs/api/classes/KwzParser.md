---
editUrl: false
next: false
prev: false
title: "KwzParser"
---

Defined in: [src/parsers/KwzParser.ts:246](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L246)

Parser class for Flipnote Studio 3D's KWZ animation format. KWZ format docs: https://github.com/Flipnote-Collective/flipnote-studio-3d-docs/wiki/KWZ-Format

## Extends

- `BaseParser`

## Constructors

### new KwzParser()

> **new KwzParser**(`arrayBuffer`, `settings`): [`KwzParser`](/api/classes/kwzparser/)

Defined in: [src/parsers/KwzParser.ts:426](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L426)

Create a new KWZ file parser instance

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `arrayBuffer` | `ArrayBufferLike` | an ArrayBuffer containing file data |
| `settings` | [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`KwzParserSettings`](/api/type-aliases/kwzparsersettings/)\> | parser settings |

#### Returns

[`KwzParser`](/api/classes/kwzparser/)

#### Overrides

`BaseParser.constructor`

## Accessors

### bytes

#### Get Signature

> **get** **bytes**(): [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Defined in: [src/utils/DataStream.ts:41](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/utils/DataStream.ts#L41)

Returns the data as an Uint8Array of bytes.

##### Returns

[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

#### Inherited from

`BaseParser.bytes`

***

### numBytes

#### Get Signature

> **get** **numBytes**(): `number`

Defined in: [src/utils/DataStream.ts:48](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/utils/DataStream.ts#L48)

Returns the total number of bytes in the data.

##### Returns

`number`

#### Inherited from

`BaseParser.numBytes`

## Properties

### defaultSettings

> `static` **defaultSettings**: [`KwzParserSettings`](/api/type-aliases/kwzparsersettings/)

Defined in: [src/parsers/KwzParser.ts:251](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L251)

Default KWZ parser settings

***

### format

> `static` **format**: [`FlipnoteFormat`](/api/enumerations/flipnoteformat/) = `FlipnoteFormat.KWZ`

Defined in: [src/parsers/KwzParser.ts:264](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L264)

File format type

#### Overrides

`BaseParser.format`

***

### width

> `static` **width**: `number` = `320`

Defined in: [src/parsers/KwzParser.ts:268](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L268)

Animation frame width

#### Overrides

`BaseParser.width`

***

### height

> `static` **height**: `number` = `240`

Defined in: [src/parsers/KwzParser.ts:272](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L272)

Animation frame height

#### Overrides

`BaseParser.height`

***

### aspect

> `static` **aspect**: `number`

Defined in: [src/parsers/KwzParser.ts:276](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L276)

Animation frame aspect ratio

#### Overrides

`BaseParser.aspect`

***

### numLayers

> `static` **numLayers**: `number` = `3`

Defined in: [src/parsers/KwzParser.ts:280](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L280)

Number of animation frame layers

#### Overrides

`BaseParser.numLayers`

***

### numLayerColors

> `static` **numLayerColors**: `number` = `2`

Defined in: [src/parsers/KwzParser.ts:284](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L284)

Number of colors per layer (aside from transparent)

#### Overrides

`BaseParser.numLayerColors`

***

### rawSampleRate

> `static` **rawSampleRate**: `number` = `16364`

Defined in: [src/parsers/KwzParser.ts:288](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L288)

Audio track base sample rate

#### Overrides

`BaseParser.rawSampleRate`

***

### sampleRate

> `static` **sampleRate**: `number` = `32768`

Defined in: [src/parsers/KwzParser.ts:292](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L292)

Audio output sample rate

#### Overrides

`BaseParser.sampleRate`

***

### audioTracks

> `static` **audioTracks**: [`FlipnoteAudioTrack`](/api/enumerations/flipnoteaudiotrack/)[]

Defined in: [src/parsers/KwzParser.ts:296](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L296)

Which audio tracks are available in this format

#### Overrides

`BaseParser.audioTracks`

***

### soundEffectTracks

> `static` **soundEffectTracks**: [`FlipnoteSoundEffectTrack`](/api/enumerations/flipnotesoundeffecttrack/)[]

Defined in: [src/parsers/KwzParser.ts:306](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L306)

Which sound effect tracks are available in this format

#### Overrides

`BaseParser.soundEffectTracks`

***

### globalPalette

> `static` **globalPalette**: [`FlipnotePaletteColor`](/api/type-aliases/flipnotepalettecolor/)[]

Defined in: [src/parsers/KwzParser.ts:315](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L315)

Global animation frame color palette

#### Overrides

`BaseParser.globalPalette`

***

### publicKey

> `static` **publicKey**: `string` = `KWZ_PUBLIC_KEY`

Defined in: [src/parsers/KwzParser.ts:327](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L327)

Public key used for Flipnote verification, in PEM format

#### Overrides

`BaseParser.publicKey`

***

### format

> **format**: [`FlipnoteFormat`](/api/enumerations/flipnoteformat/) = `FlipnoteFormat.KWZ`

Defined in: [src/parsers/KwzParser.ts:340](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L340)

File format type, reflects [KwzParser.format](../../../../../../api/classes/kwzparser/#format)

#### Overrides

`BaseParser.format`

***

### \[toStringTag\]

> **\[toStringTag\]**: `string` = `'Flipnote Studio 3D KWZ animation file'`

Defined in: [src/parsers/KwzParser.ts:344](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L344)

Custom object tag

#### Overrides

`BaseParser.[toStringTag]`

***

### imageWidth

> **imageWidth**: `number` = `KwzParser.width`

Defined in: [src/parsers/KwzParser.ts:348](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L348)

Animation frame width, reflects [KwzParser.width](../../../../../../api/classes/kwzparser/#width)

#### Overrides

`BaseParser.imageWidth`

***

### imageHeight

> **imageHeight**: `number` = `KwzParser.height`

Defined in: [src/parsers/KwzParser.ts:352](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L352)

Animation frame height, reflects [KwzParser.height](../../../../../../api/classes/kwzparser/#height)

#### Overrides

`BaseParser.imageHeight`

***

### aspect

> **aspect**: `number` = `KwzParser.aspect`

Defined in: [src/parsers/KwzParser.ts:356](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L356)

Animation frame aspect ratio, reflects [KwzParser.aspect](../../../../../../api/classes/kwzparser/#aspect)

#### Overrides

`BaseParser.aspect`

***

### imageOffsetX

> **imageOffsetX**: `number` = `0`

Defined in: [src/parsers/KwzParser.ts:360](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L360)

X offset for the top-left corner of the animation frame

#### Overrides

`BaseParser.imageOffsetX`

***

### imageOffsetY

> **imageOffsetY**: `number` = `0`

Defined in: [src/parsers/KwzParser.ts:364](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L364)

Y offset for the top-left corner of the animation frame

#### Overrides

`BaseParser.imageOffsetY`

***

### numLayers

> **numLayers**: `number` = `KwzParser.numLayers`

Defined in: [src/parsers/KwzParser.ts:368](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L368)

Number of animation frame layers, reflects [KwzParser.numLayers](../../../../../../api/classes/kwzparser/#numlayers)

#### Overrides

`BaseParser.numLayers`

***

### numLayerColors

> **numLayerColors**: `number` = `KwzParser.numLayerColors`

Defined in: [src/parsers/KwzParser.ts:372](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L372)

Number of colors per layer (aside from transparent), reflects [KwzParser.numLayerColors](../../../../../../api/classes/kwzparser/#numlayercolors)

#### Overrides

`BaseParser.numLayerColors`

***

### publicKey

> **publicKey**: `string` = `KwzParser.publicKey`

Defined in: [src/parsers/KwzParser.ts:376](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L376)

key used for Flipnote verification, in PEM format

#### Overrides

`BaseParser.publicKey`

***

### audioTracks

> **audioTracks**: [`FlipnoteAudioTrack`](/api/enumerations/flipnoteaudiotrack/)[] = `KwzParser.audioTracks`

Defined in: [src/parsers/KwzParser.ts:384](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L384)

Which audio tracks are available in this format, reflects [KwzParser.audioTracks](../../../../../../api/classes/kwzparser/#audiotracks)

#### Overrides

`BaseParser.audioTracks`

***

### soundEffectTracks

> **soundEffectTracks**: [`FlipnoteSoundEffectTrack`](/api/enumerations/flipnotesoundeffecttrack/)[] = `KwzParser.soundEffectTracks`

Defined in: [src/parsers/KwzParser.ts:388](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L388)

Which sound effect tracks are available in this format, reflects [KwzParser.soundEffectTracks](../../../../../../api/classes/kwzparser/#soundeffecttracks)

#### Overrides

`BaseParser.soundEffectTracks`

***

### rawSampleRate

> **rawSampleRate**: `number` = `KwzParser.rawSampleRate`

Defined in: [src/parsers/KwzParser.ts:392](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L392)

Audio track base sample rate, reflects [KwzParser.rawSampleRate](../../../../../../api/classes/kwzparser/#rawsamplerate)

#### Overrides

`BaseParser.rawSampleRate`

***

### sampleRate

> **sampleRate**: `number` = `KwzParser.sampleRate`

Defined in: [src/parsers/KwzParser.ts:396](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L396)

Audio output sample rate, reflects [KwzParser.sampleRate](../../../../../../api/classes/kwzparser/#samplerate)

#### Overrides

`BaseParser.sampleRate`

***

### globalPalette

> **globalPalette**: [`FlipnotePaletteColor`](/api/type-aliases/flipnotepalettecolor/)[] = `KwzParser.globalPalette`

Defined in: [src/parsers/KwzParser.ts:400](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L400)

Global animation frame color palette, reflects [KwzParser.globalPalette](../../../../../../api/classes/kwzparser/#globalpalette)

#### Overrides

`BaseParser.globalPalette`

## Methods

### matchBuffer()

> `static` **matchBuffer**(`buffer`): `boolean`

Defined in: [src/parsers/KwzParser.ts:329](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L329)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `buffer` | `ArrayBufferLike` |

#### Returns

`boolean`

***

### getFrameDiffingFlag()

> **getFrameDiffingFlag**(`frameIndex`): `number`

Defined in: [src/parsers/KwzParser.ts:777](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L777)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `frameIndex` | `number` |

#### Returns

`number`

***

### decodeFrameSoundFlags()

> **decodeFrameSoundFlags**(`frameIndex`): `boolean`[]

Defined in: [src/parsers/KwzParser.ts:1068](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L1068)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `frameIndex` | `number` |

#### Returns

`boolean`[]

***

### decodeAdpcm()

> **decodeAdpcm**(`src`, `dst`, `predictor`, `stepIndex`): `number`

Defined in: [src/parsers/KwzParser.ts:1132](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L1132)

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `src` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | `undefined` |
| `dst` | [`Int16Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int16Array) | `undefined` |
| `predictor` | `number` | `0` |
| `stepIndex` | `number` | `40` |

#### Returns

`number`

***

### pcmAudioMix()

> **pcmAudioMix**(`src`, `dst`, `dstOffset`): `void`

Defined in: [src/parsers/KwzParser.ts:1265](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L1265)

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `src` | [`Int16Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int16Array) | `undefined` |
| `dst` | [`Int16Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int16Array) | `undefined` |
| `dstOffset` | `number` | `0` |

#### Returns

`void`

***

### end()

> **end**(): `boolean`

Defined in: [src/utils/DataStream.ts:253](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/utils/DataStream.ts#L253)

#### Returns

`boolean`

#### Inherited from

`BaseParser.end`

## Meta

### titleFormats

> **titleFormats**: `object`

Defined in: [src/parsers/BaseParser.ts:111](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/BaseParser.ts#L111)

Default formats used for [getTitle](../../../../../../api/classes/kwzparser/#gettitle).

| Name | Type | Default value |
| :------ | :------ | :------ |
| `COMMENT` | `string` | 'Comment by $USERNAME' |
| `FLIPNOTE` | `string` | 'Flipnote by $USERNAME' |
| `ICON` | `string` | 'Folder icon' |

#### Inherited from

`BaseParser.titleFormats`

***

### soundMeta

> **soundMeta**: [`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<[`FlipnoteAudioTrack`](/api/enumerations/flipnoteaudiotrack/), [`FlipnoteAudioTrackInfo`](/api/interfaces/flipnoteaudiotrackinfo/)\>

Defined in: [src/parsers/BaseParser.ts:194](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/BaseParser.ts#L194)

File audio track info, see [FlipnoteAudioTrackInfo](../../../../../../api/interfaces/flipnoteaudiotrackinfo).

#### Inherited from

`BaseParser.soundMeta`

***

### isSpinoff

> **isSpinoff**: `boolean`

Defined in: [src/parsers/BaseParser.ts:210](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/BaseParser.ts#L210)

Spinoffs are remixes of another user's Flipnote.

#### Inherited from

`BaseParser.isSpinoff`

***

### isFolderIcon

> **isFolderIcon**: `boolean` = `false`

Defined in: [src/parsers/BaseParser.ts:215](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/BaseParser.ts#L215)

(KWZ only) Indicates whether or not this file is a Flipnote Studio 3D folder icon.

#### Inherited from

`BaseParser.isFolderIcon`

***

### isComment

> **isComment**: `boolean` = `false`

Defined in: [src/parsers/BaseParser.ts:220](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/BaseParser.ts#L220)

(KWZ only) Indicates whether or not this file is a handwritten comment from Flipnote Gallery World.

#### Inherited from

`BaseParser.isComment`

***

### isDsiLibraryNote

> **isDsiLibraryNote**: `boolean` = `false`

Defined in: [src/parsers/BaseParser.ts:225](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/BaseParser.ts#L225)

(KWZ only) Indicates whether or not this Flipnote is a PPM to KWZ conversion from Flipnote Studio 3D's DSi Library service.

#### Inherited from

`BaseParser.isDsiLibraryNote`

***

### meta

> **meta**: [`KwzMeta`](/api/interfaces/kwzmeta/)

Defined in: [src/parsers/KwzParser.ts:405](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L405)

File metadata, see [KwzMeta](../../../../../../api/interfaces/kwzmeta) for structure.

#### Overrides

`BaseParser.meta`

***

### getTitle()

> **getTitle**(`formats`): `string`

Defined in: [src/parsers/BaseParser.ts:279](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/BaseParser.ts#L279)

Get file default title - e.g. "Flipnote by Y", "Comment by X", etc. 
A format object can be passed for localization, where `$USERNAME` gets replaced by author name:
```js
{
 COMMENT: 'Comment by $USERNAME',
 FLIPNOTE: 'Flipnote by $USERNAME',
 ICON: 'Folder icon'
}
```

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `formats` | \{ `COMMENT`: `string`; `FLIPNOTE`: `string`; `ICON`: `string`; \} |
| `formats.COMMENT` | `string` |
| `formats.FLIPNOTE` | `string` |
| `formats.ICON` | `string` |

#### Returns

`string`

#### Inherited from

`BaseParser.getTitle`

***

### getThumbnailImage()

> **getThumbnailImage**(): `object`

Defined in: [src/parsers/KwzParser.ts:691](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L691)

Decodes the thumbnail image embedded in the Flipnote. Will return a [FlipnoteThumbImage](../../../../../../api/type-aliases/flipnotethumbimage) containing JPEG data.

Note: For most purposes, you should probably just decode the thumbnail frame to get a higher resolution image.

#### Returns

`object`

##### format

> **format**: [`FlipnoteThumbImageFormat`](/api/enumerations/flipnotethumbimageformat/) = `FlipnoteThumbImageFormat.Jpeg`

##### width

> **width**: `number` = `80`

##### height

> **height**: `number` = `64`

##### data

> **data**: [`ArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

#### Overrides

`BaseParser.getThumbnailImage`

***

### getMemoryMeterLevel()

> **getMemoryMeterLevel**(): `number`

Defined in: [src/parsers/KwzParser.ts:712](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L712)

Get the memory meter level for the Flipnote.
This is a value between 0 and 1 indicating how "full" the Flipnote is, based on the size calculation formula inside Flipnote Studio 3D.

Values will never be below 0, but can be above 1 if the Flipnote is larger than the size limit - it is technically possible to exceed the size limit by one frame.

#### Returns

`number`

#### Overrides

`BaseParser.getMemoryMeterLevel`

***

### getFrameAuthor()

> **getFrameAuthor**(`frameIndex`): `string`

Defined in: [src/parsers/KwzParser.ts:817](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L817)

Get the FSID for a given frame's original author.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `frameIndex` | `number` |  |

#### Returns

`string`

#### Overrides

`BaseParser.getFrameAuthor`

## Image

### palette

> **palette**: [`FlipnotePaletteDefinition`](/api/type-aliases/flipnotepalettedefinition/)

Defined in: [src/parsers/BaseParser.ts:184](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/BaseParser.ts#L184)

Flipnote palette.

#### Inherited from

`BaseParser.palette`

***

### layerVisibility

> **layerVisibility**: [`FlipnoteLayerVisibility`](/api/type-aliases/flipnotelayervisibility/)

Defined in: [src/parsers/BaseParser.ts:199](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/BaseParser.ts#L199)

Animation frame global layer visibility.

#### Inherited from

`BaseParser.layerVisibility`

***

### frameCount

> **frameCount**: `number`

Defined in: [src/parsers/BaseParser.ts:230](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/BaseParser.ts#L230)

Animation frame count.

#### Inherited from

`BaseParser.frameCount`

***

### frameSpeed

> **frameSpeed**: `number`

Defined in: [src/parsers/BaseParser.ts:235](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/BaseParser.ts#L235)

In-app animation playback speed.

#### Inherited from

`BaseParser.frameSpeed`

***

### duration

> **duration**: `number`

Defined in: [src/parsers/BaseParser.ts:240](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/BaseParser.ts#L240)

Animation duration, in seconds.

#### Inherited from

`BaseParser.duration`

***

### bgmSpeed

> **bgmSpeed**: `number`

Defined in: [src/parsers/BaseParser.ts:245](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/BaseParser.ts#L245)

In-app animation playback speed when the BGM track was recorded.

#### Inherited from

`BaseParser.bgmSpeed`

***

### framerate

> **framerate**: `number`

Defined in: [src/parsers/BaseParser.ts:250](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/BaseParser.ts#L250)

Animation framerate, measured as frames per second.

#### Inherited from

`BaseParser.framerate`

***

### thumbFrameIndex

> **thumbFrameIndex**: `number`

Defined in: [src/parsers/BaseParser.ts:260](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/BaseParser.ts#L260)

Index of the animation frame used as the Flipnote's thumbnail image.

#### Inherited from

`BaseParser.thumbFrameIndex`

***

### getLayerPixels()

> **getLayerPixels**(`frameIndex`, `layerIndex`, `imageBuffer`, `depthStrength`, `depthEye`): [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Defined in: [src/parsers/BaseParser.ts:351](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/BaseParser.ts#L351)

Get the pixels for a given frame layer, as palette indices

:::tip
Layer indices are not guaranteed to be sorted by 3D depth in KWZs, use [getFrameLayerOrder](/api/classes/ppmparser/#getframelayerorder) to get the correct sort order first.
:::

:::tip
If the visibility flag for this layer is turned off, the result will be empty
:::

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `frameIndex` | `number` | `undefined` |
| `layerIndex` | `number` | `undefined` |
| `imageBuffer` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | `...` |
| `depthStrength` | `number` | `0` |
| `depthEye` | [`FlipnoteStereoscopicEye`](/api/enumerations/flipnotestereoscopiceye/) | `FlipnoteStereoscopicEye.Left` |

#### Returns

[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

#### Inherited from

`BaseParser.getLayerPixels`

***

### getLayerPixelsRgba()

> **getLayerPixelsRgba**(`frameIndex`, `layerIndex`, `imageBuffer`, `paletteBuffer`, `depthStrength`, `depthEye`): [`Uint32Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array)

Defined in: [src/parsers/BaseParser.ts:406](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/BaseParser.ts#L406)

Get the pixels for a given frame layer, as RGBA pixels

:::tip
Layer indices are not guaranteed to be sorted by 3D depth in KWZs, use [getFrameLayerOrder](/api/classes/ppmparser/#getframelayerorder) to get the correct sort order first.
:::

:::tip
If the visibility flag for this layer is turned off, the result will be empty
:::

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `frameIndex` | `number` | `undefined` |
| `layerIndex` | `number` | `undefined` |
| `imageBuffer` | [`Uint32Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array) | `...` |
| `paletteBuffer` | [`Uint32Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array) | `...` |
| `depthStrength` | `number` | `0` |
| `depthEye` | [`FlipnoteStereoscopicEye`](/api/enumerations/flipnotestereoscopiceye/) | `FlipnoteStereoscopicEye.Left` |

#### Returns

[`Uint32Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array)

#### Inherited from

`BaseParser.getLayerPixelsRgba`

***

### getFramePixels()

> **getFramePixels**(`frameIndex`, `imageBuffer`, `depthStrength`, `depthEye`): [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Defined in: [src/parsers/BaseParser.ts:488](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/BaseParser.ts#L488)

Get the image for a given frame, as palette indices

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `frameIndex` | `number` | `undefined` |
| `imageBuffer` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | `...` |
| `depthStrength` | `number` | `0` |
| `depthEye` | [`FlipnoteStereoscopicEye`](/api/enumerations/flipnotestereoscopiceye/) | `FlipnoteStereoscopicEye.Left` |

#### Returns

[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

#### Inherited from

`BaseParser.getFramePixels`

***

### getFramePixelsRgba()

> **getFramePixelsRgba**(`frameIndex`, `imageBuffer`, `paletteBuffer`, `depthStrength`, `depthEye`): [`Uint32Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array)

Defined in: [src/parsers/BaseParser.ts:538](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/BaseParser.ts#L538)

Get the image for a given frame as an uint32 array of RGBA pixels

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `frameIndex` | `number` | `undefined` |
| `imageBuffer` | [`Uint32Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array) | `...` |
| `paletteBuffer` | [`Uint32Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array) | `...` |
| `depthStrength` | `number` | `0` |
| `depthEye` | [`FlipnoteStereoscopicEye`](/api/enumerations/flipnotestereoscopiceye/) | `FlipnoteStereoscopicEye.Left` |

#### Returns

[`Uint32Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array)

#### Inherited from

`BaseParser.getFramePixelsRgba`

***

### getFramePaletteUint32()

> **getFramePaletteUint32**(`frameIndex`, `paletteBuffer`): [`Uint32Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array)

Defined in: [src/parsers/BaseParser.ts:603](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/BaseParser.ts#L603)

Get the color palette for a given frame, as an uint32 array

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `frameIndex` | `number` |
| `paletteBuffer` | [`Uint32Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array) |

#### Returns

[`Uint32Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array)

#### Inherited from

`BaseParser.getFramePaletteUint32`

***

### getFramePaletteIndices()

> **getFramePaletteIndices**(`frameIndex`): `number`[]

Defined in: [src/parsers/KwzParser.ts:743](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L743)

Get the color palette indices for a given frame. RGBA colors for these values can be indexed from [KwzParser.globalPalette](../../../../../../api/classes/kwzparser/#globalpalette)

Returns an array where:
 - index 0 is the paper color index
 - index 1 is the layer A color 1 index
 - index 2 is the layer A color 2 index
 - index 3 is the layer B color 1 index
 - index 4 is the layer B color 2 index
 - index 5 is the layer C color 1 index
 - index 6 is the layer C color 2 index

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `frameIndex` | `number` |

#### Returns

`number`[]

#### Overrides

`BaseParser.getFramePaletteIndices`

***

### getFramePalette()

> **getFramePalette**(`frameIndex`): [`FlipnotePaletteColor`](/api/type-aliases/flipnotepalettecolor/)[]

Defined in: [src/parsers/KwzParser.ts:771](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L771)

Get the RGBA colors for a given frame

Returns an array where:
 - index 0 is the paper color
 - index 1 is the layer A color 1
 - index 2 is the layer A color 2
 - index 3 is the layer B color 1
 - index 4 is the layer B color 2
 - index 5 is the layer C color 1
 - index 6 is the layer C color 2

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `frameIndex` | `number` |

#### Returns

[`FlipnotePaletteColor`](/api/type-aliases/flipnotepalettecolor/)[]

#### Overrides

`BaseParser.getFramePalette`

***

### getIsKeyFrame()

> **getIsKeyFrame**(`frameIndex`): `boolean`[]

Defined in: [src/parsers/KwzParser.ts:788](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L788)

Determines if a given frame is a video key frame or not. This returns an array of booleans for each layer, since keyframe encoding is done on a per-layer basis.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `frameIndex` | `number` |  |

#### Returns

`boolean`[]

#### Overrides

`BaseParser.getIsKeyFrame`

***

### getFrameLayerDepths()

> **getFrameLayerDepths**(`frameIndex`): `number`[]

Defined in: [src/parsers/KwzParser.ts:802](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L802)

Get the 3D depths for each layer in a given frame.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `frameIndex` | `number` |  |

#### Returns

`number`[]

#### Overrides

`BaseParser.getFrameLayerDepths`

***

### getFrameCameraFlags()

> **getFrameCameraFlags**(`frameIndex`): `boolean`[]

Defined in: [src/parsers/KwzParser.ts:828](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L828)

Get the camera flags for a given frame

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `frameIndex` | `number` |

#### Returns

`boolean`[]

Array of booleans, indicating whether each layer uses a photo or not

#### Overrides

`BaseParser.getFrameCameraFlags`

***

### getFrameLayerOrder()

> **getFrameLayerOrder**(`frameIndex`): `number`[]

Defined in: [src/parsers/KwzParser.ts:842](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L842)

Get the layer draw order for a given frame

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `frameIndex` | `number` |

#### Returns

`number`[]

#### Overrides

`BaseParser.getFrameLayerOrder`

***

### decodeFrame()

> **decodeFrame**(`frameIndex`, `diffingFlag`, `isPrevFrame`): \[[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)\]

Defined in: [src/parsers/KwzParser.ts:852](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L852)

Decode a frame, returning the raw pixel buffers for each layer

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `frameIndex` | `number` | `undefined` |
| `diffingFlag` | `number` | `0x7` |
| `isPrevFrame` | `boolean` | `false` |

#### Returns

\[[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)\]

#### Overrides

`BaseParser.decodeFrame`

## Audio

### bgmrate

> **bgmrate**: `number`

Defined in: [src/parsers/BaseParser.ts:255](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/BaseParser.ts#L255)

Animation framerate when the BGM track was recorded, measured as frames per second.

#### Inherited from

`BaseParser.bgmrate`

***

### audioClipRatio

> **audioClipRatio**: `number`

Defined in: [src/parsers/BaseParser.ts:265](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/BaseParser.ts#L265)

Get the amount of clipping in the master audio track, useful for determining if a Flipnote's audio is corrupted. Closer to 1.0 = more clipping. Only available after [getAudioMasterPcm](../../../../../../api/classes/kwzparser/#getaudiomasterpcm) has been called.

#### Inherited from

`BaseParser.audioClipRatio`

***

### getSoundEffectFlagsForTrack()

> **getSoundEffectFlagsForTrack**(`trackId`): `boolean`[]

Defined in: [src/parsers/BaseParser.ts:637](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/BaseParser.ts#L637)

Get the usage flags for a given track across every frame

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `trackId` | [`FlipnoteSoundEffectTrack`](/api/enumerations/flipnotesoundeffecttrack/) |

#### Returns

`boolean`[]

an array of booleans for every frame, indicating whether the track is used on that frame

#### Inherited from

`BaseParser.getSoundEffectFlagsForTrack`

***

### isSoundEffectUsedOnFrame()

> **isSoundEffectUsedOnFrame**(`trackId`, `frameIndex`): `boolean`

Defined in: [src/parsers/BaseParser.ts:645](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/BaseParser.ts#L645)

Is a given track used on a given frame

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `trackId` | [`FlipnoteSoundEffectTrack`](/api/enumerations/flipnotesoundeffecttrack/) |
| `frameIndex` | `number` |

#### Returns

`boolean`

#### Inherited from

`BaseParser.isSoundEffectUsedOnFrame`

***

### hasAudioTrack()

> **hasAudioTrack**(`trackId`): `boolean`

Defined in: [src/parsers/BaseParser.ts:657](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/BaseParser.ts#L657)

Does an audio track exist in the Flipnote?

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `trackId` | [`FlipnoteAudioTrack`](/api/enumerations/flipnoteaudiotrack/) |

#### Returns

`boolean`

boolean

#### Inherited from

`BaseParser.hasAudioTrack`

***

### decodeSoundFlags()

> **decodeSoundFlags**(): `boolean`[][]

Defined in: [src/parsers/KwzParser.ts:1084](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L1084)

Get the sound effect flags for every frame in the Flipnote

#### Returns

`boolean`[][]

#### Overrides

`BaseParser.decodeSoundFlags`

***

### getSoundEffectFlags()

> **getSoundEffectFlags**(): [`FlipnoteSoundEffectFlags`](/api/type-aliases/flipnotesoundeffectflags/)[]

Defined in: [src/parsers/KwzParser.ts:1097](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L1097)

Get the sound effect usage flags for every frame

#### Returns

[`FlipnoteSoundEffectFlags`](/api/type-aliases/flipnotesoundeffectflags/)[]

#### Overrides

`BaseParser.getSoundEffectFlags`

***

### getFrameSoundEffectFlags()

> **getFrameSoundEffectFlags**(`frameIndex`): [`FlipnoteSoundEffectFlags`](/api/type-aliases/flipnotesoundeffectflags/)

Defined in: [src/parsers/KwzParser.ts:1111](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L1111)

Get the sound effect usage for a given frame

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `frameIndex` | `number` |  |

#### Returns

[`FlipnoteSoundEffectFlags`](/api/type-aliases/flipnotesoundeffectflags/)

#### Overrides

`BaseParser.getFrameSoundEffectFlags`

***

### getAudioTrackRaw()

> **getAudioTrackRaw**(`trackId`): [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Defined in: [src/parsers/KwzParser.ts:1126](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L1126)

Get the raw compressed audio data for a given track

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `trackId` | [`FlipnoteAudioTrack`](/api/enumerations/flipnoteaudiotrack/) |

#### Returns

[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Byte array

#### Overrides

`BaseParser.getAudioTrackRaw`

***

### decodeAudioTrack()

> **decodeAudioTrack**(`trackId`): [`Int16Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int16Array)

Defined in: [src/parsers/KwzParser.ts:1190](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L1190)

Get the decoded audio data for a given track, using the track's native samplerate

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `trackId` | [`FlipnoteAudioTrack`](/api/enumerations/flipnoteaudiotrack/) |

#### Returns

[`Int16Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int16Array)

Signed 16-bit PCM audio

#### Overrides

`BaseParser.decodeAudioTrack`

***

### getAudioTrackPcm()

> **getAudioTrackPcm**(`trackId`, `dstFreq`): [`Int16Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int16Array)

Defined in: [src/parsers/KwzParser.ts:1252](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L1252)

Get the decoded audio data for a given track, using the specified samplerate

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `trackId` | [`FlipnoteAudioTrack`](/api/enumerations/flipnoteaudiotrack/) |
| `dstFreq` | `number` |

#### Returns

[`Int16Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int16Array)

Signed 16-bit PCM audio

#### Overrides

`BaseParser.getAudioTrackPcm`

***

### getAudioMasterPcm()

> **getAudioMasterPcm**(`dstFreq`): [`Int16Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int16Array)

Defined in: [src/parsers/KwzParser.ts:1282](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L1282)

Get the full mixed audio for the Flipnote, using the specified samplerate

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `dstFreq` | `number` |

#### Returns

[`Int16Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int16Array)

Signed 16-bit PCM audio

#### Overrides

`BaseParser.getAudioMasterPcm`

## Verification

### getBody()

> **getBody**(): [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Defined in: [src/parsers/KwzParser.ts:1324](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L1324)

Get the body of the Flipnote - the data that is digested for the signature

#### Returns

[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

#### Overrides

`BaseParser.getBody`

***

### getSignature()

> **getSignature**(): [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Defined in: [src/parsers/KwzParser.ts:1333](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L1333)

Get the Flipnote's signature data

#### Returns

[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

#### Overrides

`BaseParser.getSignature`

***

### verify()

> **verify**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`boolean`\>

Defined in: [src/parsers/KwzParser.ts:1342](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/KwzParser.ts#L1342)

Verify whether this Flipnote's signature is valid

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`boolean`\>

#### Overrides

`BaseParser.verify`

## Utility

### toString()

> **toString**(): `string`

Defined in: [src/parsers/BaseParser.ts:295](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/BaseParser.ts#L295)

Returns the Flipnote title when casting a parser instance to a string.

```js
const str = 'Title: ' + note;
// str === 'Title: Flipnote by username'
```

#### Returns

`string`

#### Inherited from

`BaseParser.toString`

***

### \[iterator\]()

> **\[iterator\]**(): [`Generator`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Generator)\<`number`, `void`, `unknown`\>

Defined in: [src/parsers/BaseParser.ts:309](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/BaseParser.ts#L309)

Allows for frame index iteration when using the parser instance as a for..of iterator.

```js
for (const frameIndex of note) {
  // do something with frameIndex...
}
```

#### Returns

[`Generator`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Generator)\<`number`, `void`, `unknown`\>

#### Inherited from

`BaseParser.[iterator]`
