---
editUrl: false
next: false
prev: false
title: "PpmParser"
---

Defined in: [src/parsers/PpmParser.ts:117](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L117)

Parser class for (DSiWare) Flipnote Studio's PPM animation format.

Format docs: https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format

## Extends

- `BaseParser`

## Constructors

### new PpmParser()

> **new PpmParser**(`arrayBuffer`, `settings`): [`PpmParser`](/api/classes/ppmparser/)

Defined in: [src/parsers/PpmParser.ts:300](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L300)

Create a new PPM file parser instance

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `arrayBuffer` | [`ArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | an ArrayBuffer containing file data |
| `settings` | [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`PpmParserSettings`](/api/type-aliases/ppmparsersettings/)\> | parser settings (none currently implemented) |

#### Returns

[`PpmParser`](/api/classes/ppmparser/)

#### Overrides

`BaseParser.constructor`

## Accessors

### bytes

#### Get Signature

> **get** **bytes**(): [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Defined in: [src/utils/DataStream.ts:41](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/utils/DataStream.ts#L41)

Returns the data as an Uint8Array of bytes.

##### Returns

[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

#### Inherited from

`BaseParser.bytes`

***

### numBytes

#### Get Signature

> **get** **numBytes**(): `number`

Defined in: [src/utils/DataStream.ts:48](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/utils/DataStream.ts#L48)

Returns the total number of bytes in the data.

##### Returns

`number`

#### Inherited from

`BaseParser.numBytes`

## Properties

### defaultSettings

> `static` **defaultSettings**: [`PpmParserSettings`](/api/type-aliases/ppmparsersettings/) = `{}`

Defined in: [src/parsers/PpmParser.ts:122](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L122)

Default PPM parser settings.

***

### format

> `static` **format**: [`FlipnoteFormat`](/api/enumerations/flipnoteformat/) = `FlipnoteFormat.PPM`

Defined in: [src/parsers/PpmParser.ts:126](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L126)

File format type.

#### Overrides

`BaseParser.format`

***

### width

> `static` **width**: `number` = `256`

Defined in: [src/parsers/PpmParser.ts:130](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L130)

Animation frame width.

#### Overrides

`BaseParser.width`

***

### height

> `static` **height**: `number` = `192`

Defined in: [src/parsers/PpmParser.ts:134](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L134)

Animation frame height.

#### Overrides

`BaseParser.height`

***

### aspect

> `static` **aspect**: `number`

Defined in: [src/parsers/PpmParser.ts:138](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L138)

Animation frame aspect ratio.

#### Overrides

`BaseParser.aspect`

***

### numLayers

> `static` **numLayers**: `number` = `2`

Defined in: [src/parsers/PpmParser.ts:142](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L142)

Number of animation frame layers.

#### Overrides

`BaseParser.numLayers`

***

### numLayerColors

> `static` **numLayerColors**: `number` = `1`

Defined in: [src/parsers/PpmParser.ts:146](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L146)

Number of colors per layer (aside from transparent).

#### Overrides

`BaseParser.numLayerColors`

***

### rawSampleRate

> `static` **rawSampleRate**: `number` = `8192`

Defined in: [src/parsers/PpmParser.ts:150](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L150)

Audio track base sample rate.

#### Overrides

`BaseParser.rawSampleRate`

***

### sampleRate

> `static` **sampleRate**: `number` = `32768`

Defined in: [src/parsers/PpmParser.ts:154](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L154)

Nintendo DSi audio output rate.

#### Overrides

`BaseParser.sampleRate`

***

### audioTracks

> `static` **audioTracks**: [`FlipnoteAudioTrack`](/api/enumerations/flipnoteaudiotrack/)[]

Defined in: [src/parsers/PpmParser.ts:158](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L158)

Which audio tracks are available in this format.

#### Overrides

`BaseParser.audioTracks`

***

### soundEffectTracks

> `static` **soundEffectTracks**: [`FlipnoteSoundEffectTrack`](/api/enumerations/flipnotesoundeffecttrack/)[]

Defined in: [src/parsers/PpmParser.ts:167](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L167)

Which sound effect tracks are available in this format.

#### Overrides

`BaseParser.soundEffectTracks`

***

### globalPalette

> `static` **globalPalette**: [`FlipnotePaletteColor`](/api/type-aliases/flipnotepalettecolor/)[]

Defined in: [src/parsers/PpmParser.ts:175](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L175)

Global animation frame color palette.

#### Overrides

`BaseParser.globalPalette`

***

### publicKey

> `static` **publicKey**: `string` = `PPM_PUBLIC_KEY`

Defined in: [src/parsers/PpmParser.ts:184](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L184)

Public key used for Flipnote verification, in PEM format.

#### Overrides

`BaseParser.publicKey`

## Methods

### matchBuffer()

> `static` **matchBuffer**(`buffer`): `boolean`

Defined in: [src/parsers/PpmParser.ts:186](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L186)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `buffer` | [`ArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) |

#### Returns

`boolean`

***

### end()

> **end**(): `boolean`

Defined in: [src/utils/DataStream.ts:253](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/utils/DataStream.ts#L253)

#### Returns

`boolean`

#### Inherited from

`BaseParser.end`

## Meta

### titleFormats

> **titleFormats**: `object`

Defined in: [src/parsers/BaseParser.ts:111](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/BaseParser.ts#L111)

Default formats used for [getTitle](../../../../../../api/classes/ppmparser/#gettitle).

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

Defined in: [src/parsers/BaseParser.ts:194](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/BaseParser.ts#L194)

File audio track info, see [FlipnoteAudioTrackInfo](../../../../../../api/interfaces/flipnoteaudiotrackinfo).

#### Inherited from

`BaseParser.soundMeta`

***

### isSpinoff

> **isSpinoff**: `boolean`

Defined in: [src/parsers/BaseParser.ts:210](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/BaseParser.ts#L210)

Spinoffs are remixes of another user's Flipnote.

#### Inherited from

`BaseParser.isSpinoff`

***

### isFolderIcon

> **isFolderIcon**: `boolean` = `false`

Defined in: [src/parsers/BaseParser.ts:215](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/BaseParser.ts#L215)

(KWZ only) Indicates whether or not this file is a Flipnote Studio 3D folder icon.

#### Inherited from

`BaseParser.isFolderIcon`

***

### isComment

> **isComment**: `boolean` = `false`

Defined in: [src/parsers/BaseParser.ts:220](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/BaseParser.ts#L220)

(KWZ only) Indicates whether or not this file is a handwritten comment from Flipnote Gallery World.

#### Inherited from

`BaseParser.isComment`

***

### isDsiLibraryNote

> **isDsiLibraryNote**: `boolean` = `false`

Defined in: [src/parsers/BaseParser.ts:225](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/BaseParser.ts#L225)

(KWZ only) Indicates whether or not this Flipnote is a PPM to KWZ conversion from Flipnote Studio 3D's DSi Library service.

#### Inherited from

`BaseParser.isDsiLibraryNote`

***

### format

> **format**: [`FlipnoteFormat`](/api/enumerations/flipnoteformat/) = `FlipnoteFormat.PPM`

Defined in: [src/parsers/PpmParser.ts:198](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L198)

File format type, reflects [PpmParser.format](../../../../../../api/classes/ppmparser/#format).

#### Overrides

`BaseParser.format`

***

### meta

> **meta**: [`PpmMeta`](/api/interfaces/ppmmeta/)

Defined in: [src/parsers/PpmParser.ts:278](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L278)

File metadata, see [PpmMeta](../../../../../../api/interfaces/ppmmeta) for structure.

#### Overrides

`BaseParser.meta`

***

### version

> **version**: `number`

Defined in: [src/parsers/PpmParser.ts:283](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L283)

File format version; always the same as far as we know.

***

### getTitle()

> **getTitle**(`formats`): `string`

Defined in: [src/parsers/BaseParser.ts:279](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/BaseParser.ts#L279)

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

Defined in: [src/parsers/PpmParser.ts:461](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L461)

Decodes the thumbnail image embedded in the Flipnote. Will return a [FlipnoteThumbImage](../../../../../../api/type-aliases/flipnotethumbimage) containing raw RGBA data.

Note: For most purposes, you should probably just decode the thumbnail frame to get a higher resolution image.

#### Returns

`object`

##### format

> **format**: [`FlipnoteThumbImageFormat`](/api/enumerations/flipnotethumbimageformat/) = `FlipnoteThumbImageFormat.Rgba`

##### width

> **width**: `number` = `64`

##### height

> **height**: `number` = `48`

##### data

> **data**: `ArrayBufferLike` = `pixels.buffer`

#### Overrides

`BaseParser.getThumbnailImage`

***

### getMemoryMeterLevel()

> **getMemoryMeterLevel**(): `number`

Defined in: [src/parsers/PpmParser.ts:494](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L494)

Get the memory meter level for the Flipnote.
This is a value between 0 and 1 indicating how "full" the Flipnote is, based on the size limit of Flipnote Studio.

Values will never be below 0, but can be above 1 if the Flipnote is larger than the size limit - it is technically possible to exceed the size limit by one frame.

#### Returns

`number`

#### Overrides

`BaseParser.getMemoryMeterLevel`

***

### getFrameAuthor()

> **getFrameAuthor**(`frameIndex`): `string`

Defined in: [src/parsers/PpmParser.ts:725](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L725)

Get the FSID for a given frame's original author. The PPM format doesn't actually store this information, so the current author FSID is returned. This method is only here for consistency with KWZ.

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

Defined in: [src/parsers/BaseParser.ts:184](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/BaseParser.ts#L184)

Flipnote palette.

#### Inherited from

`BaseParser.palette`

***

### layerVisibility

> **layerVisibility**: [`FlipnoteLayerVisibility`](/api/type-aliases/flipnotelayervisibility/)

Defined in: [src/parsers/BaseParser.ts:199](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/BaseParser.ts#L199)

Animation frame global layer visibility.

#### Inherited from

`BaseParser.layerVisibility`

***

### frameCount

> **frameCount**: `number`

Defined in: [src/parsers/BaseParser.ts:230](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/BaseParser.ts#L230)

Animation frame count.

#### Inherited from

`BaseParser.frameCount`

***

### frameSpeed

> **frameSpeed**: `number`

Defined in: [src/parsers/BaseParser.ts:235](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/BaseParser.ts#L235)

In-app animation playback speed.

#### Inherited from

`BaseParser.frameSpeed`

***

### duration

> **duration**: `number`

Defined in: [src/parsers/BaseParser.ts:240](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/BaseParser.ts#L240)

Animation duration, in seconds.

#### Inherited from

`BaseParser.duration`

***

### bgmSpeed

> **bgmSpeed**: `number`

Defined in: [src/parsers/BaseParser.ts:245](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/BaseParser.ts#L245)

In-app animation playback speed when the BGM track was recorded.

#### Inherited from

`BaseParser.bgmSpeed`

***

### framerate

> **framerate**: `number`

Defined in: [src/parsers/BaseParser.ts:250](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/BaseParser.ts#L250)

Animation framerate, measured as frames per second.

#### Inherited from

`BaseParser.framerate`

***

### thumbFrameIndex

> **thumbFrameIndex**: `number`

Defined in: [src/parsers/BaseParser.ts:260](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/BaseParser.ts#L260)

Index of the animation frame used as the Flipnote's thumbnail image.

#### Inherited from

`BaseParser.thumbFrameIndex`

***

### imageWidth

> **imageWidth**: `number` = `PpmParser.width`

Defined in: [src/parsers/PpmParser.ts:208](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L208)

Animation frame width, reflects [PpmParser.width](../../../../../../api/classes/ppmparser/#width).

#### Overrides

`BaseParser.imageWidth`

***

### imageHeight

> **imageHeight**: `number` = `PpmParser.height`

Defined in: [src/parsers/PpmParser.ts:213](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L213)

Animation frame height, reflects [PpmParser.height](../../../../../../api/classes/ppmparser/#height).

#### Overrides

`BaseParser.imageHeight`

***

### aspect

> **aspect**: `number` = `PpmParser.aspect`

Defined in: [src/parsers/PpmParser.ts:218](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L218)

Animation frame aspect ratio, reflects [PpmParser.aspect](../../../../../../api/classes/ppmparser/#aspect).

#### Overrides

`BaseParser.aspect`

***

### imageOffsetX

> **imageOffsetX**: `number` = `0`

Defined in: [src/parsers/PpmParser.ts:223](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L223)

X offset for the top-left corner of the animation frame.

#### Overrides

`BaseParser.imageOffsetX`

***

### imageOffsetY

> **imageOffsetY**: `number` = `0`

Defined in: [src/parsers/PpmParser.ts:228](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L228)

Y offset for the top-left corner of the animation frame.

#### Overrides

`BaseParser.imageOffsetY`

***

### numLayers

> **numLayers**: `number` = `PpmParser.numLayers`

Defined in: [src/parsers/PpmParser.ts:233](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L233)

Number of animation frame layers, reflects [PpmParser.numLayers](../../../../../../api/classes/ppmparser/#numlayers).

#### Overrides

`BaseParser.numLayers`

***

### numLayerColors

> **numLayerColors**: `number` = `PpmParser.numLayerColors`

Defined in: [src/parsers/PpmParser.ts:238](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L238)

Number of colors per layer (aside from transparent), reflects [PpmParser.numLayerColors](../../../../../../api/classes/ppmparser/#numlayercolors).

#### Overrides

`BaseParser.numLayerColors`

***

### globalPalette

> **globalPalette**: [`FlipnotePaletteColor`](/api/type-aliases/flipnotepalettecolor/)[] = `PpmParser.globalPalette`

Defined in: [src/parsers/PpmParser.ts:273](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L273)

Global animation frame color palette, reflects [PpmParser.globalPalette](../../../../../../api/classes/ppmparser/#globalpalette).

#### Overrides

`BaseParser.globalPalette`

***

### getLayerPixels()

> **getLayerPixels**(`frameIndex`, `layerIndex`, `imageBuffer`, `depthStrength`, `depthEye`): [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Defined in: [src/parsers/BaseParser.ts:344](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/BaseParser.ts#L344)

Get the pixels for a given frame layer, as palette indices
NOTE: layerIndex are not guaranteed to be sorted by 3D depth in KWZs, use [getFrameLayerOrder](../../../../../../api/classes/ppmparser/#getframelayerorder) to get the correct sort order first
NOTE: if the visibility flag for this layer is turned off, the result will be empty

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

Defined in: [src/parsers/BaseParser.ts:392](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/BaseParser.ts#L392)

Get the pixels for a given frame layer, as RGBA pixels
NOTE: layerIndex are not guaranteed to be sorted by 3D depth in KWZs, use [getFrameLayerOrder](../../../../../../api/classes/ppmparser/#getframelayerorder) to get the correct sort order first
NOTE: if the visibility flag for this layer is turned off, the result will be empty

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

Defined in: [src/parsers/BaseParser.ts:474](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/BaseParser.ts#L474)

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

Defined in: [src/parsers/BaseParser.ts:524](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/BaseParser.ts#L524)

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

Defined in: [src/parsers/BaseParser.ts:589](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/BaseParser.ts#L589)

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

### decodeFrame()

> **decodeFrame**(`frameIndex`): \[[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)\]

Defined in: [src/parsers/PpmParser.ts:506](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L506)

Decode a frame, returning the raw pixel buffers for each layer

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `frameIndex` | `number` |

#### Returns

\[[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)\]

#### Overrides

`BaseParser.decodeFrame`

***

### getFramePaletteIndices()

> **getFramePaletteIndices**(`frameIndex`): `number`[]

Defined in: [src/parsers/PpmParser.ts:668](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L668)

Get the color palette indices for a given frame. RGBA colors for these values can be indexed from [PpmParser.globalPalette](../../../../../../api/classes/ppmparser/#globalpalette)

Returns an array where:
 - index 0 is the paper color index
 - index 1 is the layer 1 color index
 - index 2 is the layer 2 color index

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

Defined in: [src/parsers/PpmParser.ts:695](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L695)

Get the RGBA colors for a given frame

Returns an array where:
 - index 0 is the paper color
 - index 1 is the layer 1 color
 - index 2 is the layer 2 color

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

Defined in: [src/parsers/PpmParser.ts:706](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L706)

Determines if a given frame is a video key frame or not. This returns an array of booleans for each layer, since in the KWZ format, keyframe encoding is done on a per-layer basis.

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

Defined in: [src/parsers/PpmParser.ts:716](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L716)

Get the 3D depths for each layer in a given frame. The PPM format doesn't actually store this information, so `0` is returned for both layers. This method is only here for consistency with KWZ.

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

Defined in: [src/parsers/PpmParser.ts:734](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L734)

Get the camera flags for a given frame. The PPM format doesn't actually store this information so `false` will be returned for both layers. This method is only here for consistency with KWZ.

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

Defined in: [src/parsers/PpmParser.ts:743](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L743)

Get the layer draw order for a given frame

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `frameIndex` | `number` |

#### Returns

`number`[]

Array of layer indices, in the order they should be drawn

#### Overrides

`BaseParser.getFrameLayerOrder`

## Audio

### bgmrate

> **bgmrate**: `number`

Defined in: [src/parsers/BaseParser.ts:255](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/BaseParser.ts#L255)

Animation framerate when the BGM track was recorded, measured as frames per second.

#### Inherited from

`BaseParser.bgmrate`

***

### audioClipRatio

> **audioClipRatio**: `number`

Defined in: [src/parsers/BaseParser.ts:265](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/BaseParser.ts#L265)

Get the amount of clipping in the master audio track, useful for determining if a Flipnote's audio is corrupted. Closer to 1.0 = more clipping. Only available after [getAudioMasterPcm](../../../../../../api/classes/ppmparser/#getaudiomasterpcm) has been called.

#### Inherited from

`BaseParser.audioClipRatio`

***

### audioTracks

> **audioTracks**: [`FlipnoteAudioTrack`](/api/enumerations/flipnoteaudiotrack/)[] = `PpmParser.audioTracks`

Defined in: [src/parsers/PpmParser.ts:253](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L253)

Which audio tracks are available in this format, reflects [PpmParser.audioTracks](../../../../../../api/classes/ppmparser/#audiotracks).

#### Overrides

`BaseParser.audioTracks`

***

### soundEffectTracks

> **soundEffectTracks**: [`FlipnoteSoundEffectTrack`](/api/enumerations/flipnotesoundeffecttrack/)[] = `PpmParser.soundEffectTracks`

Defined in: [src/parsers/PpmParser.ts:258](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L258)

Which sound effect tracks are available in this format, reflects [PpmParser.soundEffectTracks](../../../../../../api/classes/ppmparser/#soundeffecttracks).

#### Overrides

`BaseParser.soundEffectTracks`

***

### rawSampleRate

> **rawSampleRate**: `number` = `PpmParser.rawSampleRate`

Defined in: [src/parsers/PpmParser.ts:263](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L263)

Audio track base sample rate, reflects [PpmParser.rawSampleRate](../../../../../../api/classes/ppmparser/#rawsamplerate).

#### Overrides

`BaseParser.rawSampleRate`

***

### sampleRate

> **sampleRate**: `number` = `PpmParser.sampleRate`

Defined in: [src/parsers/PpmParser.ts:268](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L268)

Audio output sample rate, reflects [PpmParser.sampleRate](../../../../../../api/classes/ppmparser/#samplerate).

#### Overrides

`BaseParser.sampleRate`

***

### getSoundEffectFlagsForTrack()

> **getSoundEffectFlagsForTrack**(`trackId`): `boolean`[]

Defined in: [src/parsers/BaseParser.ts:623](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/BaseParser.ts#L623)

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

Defined in: [src/parsers/BaseParser.ts:631](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/BaseParser.ts#L631)

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

Defined in: [src/parsers/BaseParser.ts:643](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/BaseParser.ts#L643)

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

Defined in: [src/parsers/PpmParser.ts:751](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L751)

Get the sound effect flags for every frame in the Flipnote

#### Returns

`boolean`[][]

#### Overrides

`BaseParser.decodeSoundFlags`

***

### getSoundEffectFlags()

> **getSoundEffectFlags**(): [`FlipnoteSoundEffectFlags`](/api/type-aliases/flipnotesoundeffectflags/)[]

Defined in: [src/parsers/PpmParser.ts:775](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L775)

Get the sound effect usage flags for every frame

#### Returns

[`FlipnoteSoundEffectFlags`](/api/type-aliases/flipnotesoundeffectflags/)[]

#### Overrides

`BaseParser.getSoundEffectFlags`

***

### getFrameSoundEffectFlags()

> **getFrameSoundEffectFlags**(`frameIndex`): [`FlipnoteSoundEffectFlags`](/api/type-aliases/flipnotesoundeffectflags/)

Defined in: [src/parsers/PpmParser.ts:788](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L788)

Get the sound effect usage flags for a given frame

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `frameIndex` | `number` |

#### Returns

[`FlipnoteSoundEffectFlags`](/api/type-aliases/flipnotesoundeffectflags/)

#### Overrides

`BaseParser.getFrameSoundEffectFlags`

***

### getAudioTrackRaw()

> **getAudioTrackRaw**(`trackId`): [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Defined in: [src/parsers/PpmParser.ts:805](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L805)

Get the raw compressed audio data for a given track

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `trackId` | [`FlipnoteAudioTrack`](/api/enumerations/flipnoteaudiotrack/) |

#### Returns

[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

byte array

#### Overrides

`BaseParser.getAudioTrackRaw`

***

### decodeAudioTrack()

> **decodeAudioTrack**(`trackId`): [`Int16Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int16Array)

Defined in: [src/parsers/PpmParser.ts:817](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L817)

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

Defined in: [src/parsers/PpmParser.ts:862](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L862)

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

Defined in: [src/parsers/PpmParser.ts:891](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L891)

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

### publicKey

> **publicKey**: `string` = `PpmParser.publicKey`

Defined in: [src/parsers/PpmParser.ts:243](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L243)

Key used for Flipnote verification, in PEM format.

#### Overrides

`BaseParser.publicKey`

***

### getBody()

> **getBody**(): [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Defined in: [src/parsers/PpmParser.ts:929](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L929)

Get the body of the Flipnote - the data that is digested for the signature

#### Returns

[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

#### Overrides

`BaseParser.getBody`

***

### getSignature()

> **getSignature**(): [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Defined in: [src/parsers/PpmParser.ts:938](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L938)

Get the Flipnote's signature data

#### Returns

[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

#### Overrides

`BaseParser.getSignature`

***

### verify()

> **verify**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`boolean`\>

Defined in: [src/parsers/PpmParser.ts:947](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L947)

Verify whether this Flipnote's signature is valid

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`boolean`\>

#### Overrides

`BaseParser.verify`

## Utility

### \[toStringTag\]

> **\[toStringTag\]**: `string` = `'Flipnote Studio PPM animation file'`

Defined in: [src/parsers/PpmParser.ts:203](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/PpmParser.ts#L203)

Custom object tag.

#### Overrides

`BaseParser.[toStringTag]`

***

### toString()

> **toString**(): `string`

Defined in: [src/parsers/BaseParser.ts:295](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/BaseParser.ts#L295)

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

Defined in: [src/parsers/BaseParser.ts:309](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/BaseParser.ts#L309)

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
