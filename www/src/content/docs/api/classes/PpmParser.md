---
editUrl: false
next: false
prev: false
title: "PpmParser"
---

Parser class for (DSiWare) Flipnote Studio's PPM animation format.

Format docs: https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format

## Extends

- `BaseParser`

## Constructors

### new PpmParser()

> **new PpmParser**(`arrayBuffer`, `settings`): [`PpmParser`](/api/classes/ppmparser/)

Create a new PPM file parser instance

#### Parameters

• **arrayBuffer**: [`ArrayBuffer ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer )

an ArrayBuffer containing file data

• **settings**: [`Partial ↗️`]( https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype )\<[`PpmParserSettings`](/api/type-aliases/ppmparsersettings/)\>= `{}`

parser settings (none currently implemented)

#### Returns

[`PpmParser`](/api/classes/ppmparser/)

#### Overrides

`BaseParser.constructor`

#### Source

[src/parsers/PpmParser.ts:295](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L295)

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

### defaultSettings

> `static` **defaultSettings**: [`PpmParserSettings`](/api/type-aliases/ppmparsersettings/) = `{}`

Default PPM parser settings.

#### Source

[src/parsers/PpmParser.ts:117](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L117)

***

### format

> `static` **format**: [`FlipnoteFormat`](/api/enumerations/flipnoteformat/) = `FlipnoteFormat.PPM`

File format type.

#### Overrides

`BaseParser.format`

#### Source

[src/parsers/PpmParser.ts:121](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L121)

***

### width

> `static` **width**: `number` = `256`

Animation frame width.

#### Overrides

`BaseParser.width`

#### Source

[src/parsers/PpmParser.ts:125](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L125)

***

### height

> `static` **height**: `number` = `192`

Animation frame height.

#### Overrides

`BaseParser.height`

#### Source

[src/parsers/PpmParser.ts:129](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L129)

***

### aspect

> `static` **aspect**: `number`

Animation frame aspect ratio.

#### Overrides

`BaseParser.aspect`

#### Source

[src/parsers/PpmParser.ts:133](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L133)

***

### numLayers

> `static` **numLayers**: `number` = `2`

Number of animation frame layers.

#### Overrides

`BaseParser.numLayers`

#### Source

[src/parsers/PpmParser.ts:137](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L137)

***

### numLayerColors

> `static` **numLayerColors**: `number` = `1`

Number of colors per layer (aside from transparent).

#### Overrides

`BaseParser.numLayerColors`

#### Source

[src/parsers/PpmParser.ts:141](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L141)

***

### rawSampleRate

> `static` **rawSampleRate**: `number` = `8192`

Audio track base sample rate.

#### Overrides

`BaseParser.rawSampleRate`

#### Source

[src/parsers/PpmParser.ts:145](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L145)

***

### sampleRate

> `static` **sampleRate**: `number` = `32768`

Nintendo DSi audio output rate.

#### Overrides

`BaseParser.sampleRate`

#### Source

[src/parsers/PpmParser.ts:149](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L149)

***

### audioTracks

> `static` **audioTracks**: [`FlipnoteAudioTrack`](/api/enumerations/flipnoteaudiotrack/)[]

Which audio tracks are available in this format.

#### Overrides

`BaseParser.audioTracks`

#### Source

[src/parsers/PpmParser.ts:153](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L153)

***

### soundEffectTracks

> `static` **soundEffectTracks**: [`FlipnoteSoundEffectTrack`](/api/enumerations/flipnotesoundeffecttrack/)[]

Which sound effect tracks are available in this format.

#### Overrides

`BaseParser.soundEffectTracks`

#### Source

[src/parsers/PpmParser.ts:162](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L162)

***

### globalPalette

> `static` **globalPalette**: [`FlipnotePaletteColor`](/api/type-aliases/flipnotepalettecolor/)[]

Global animation frame color palette.

#### Overrides

`BaseParser.globalPalette`

#### Source

[src/parsers/PpmParser.ts:170](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L170)

***

### publicKey

> `static` **publicKey**: `string` = `PPM_PUBLIC_KEY`

Public key used for Flipnote verification, in PEM format.

#### Overrides

`BaseParser.publicKey`

#### Source

[src/parsers/PpmParser.ts:179](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L179)

## Methods

### matchBuffer()

> `static` **matchBuffer**(`buffer`): `boolean`

#### Parameters

• **buffer**: [`ArrayBuffer ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer )

#### Returns

`boolean`

#### Source

[src/parsers/PpmParser.ts:181](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L181)

***

### end()

> **end**(): `boolean`

#### Returns

`boolean`

#### Inherited from

`BaseParser.end`

#### Source

[src/utils/DataStream.ts:253](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/utils/DataStream.ts#L253)

## Meta

### titleFormats

> **titleFormats**: `object`

Default formats used for [getTitle](../../../../../../../api/classes/ppmparser/#gettitle).

#### COMMENT

> **COMMENT**: `string` = `'Comment by $USERNAME'`

#### FLIPNOTE

> **FLIPNOTE**: `string` = `'Flipnote by $USERNAME'`

#### ICON

> **ICON**: `string` = `'Folder icon'`

#### Inherited from

`BaseParser.titleFormats`

#### Source

[src/parsers/BaseParser.ts:111](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/BaseParser.ts#L111)

***

### soundMeta

> **soundMeta**: [`Map ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map )\<[`FlipnoteAudioTrack`](/api/enumerations/flipnoteaudiotrack/), [`FlipnoteAudioTrackInfo`](/api/interfaces/flipnoteaudiotrackinfo/)\>

File audio track info, see [FlipnoteAudioTrackInfo](../../../../../../../api/interfaces/flipnoteaudiotrackinfo).

#### Inherited from

`BaseParser.soundMeta`

#### Source

[src/parsers/BaseParser.ts:194](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/BaseParser.ts#L194)

***

### isSpinoff

> **isSpinoff**: `boolean`

Spinoffs are remixes of another user's Flipnote.

#### Inherited from

`BaseParser.isSpinoff`

#### Source

[src/parsers/BaseParser.ts:210](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/BaseParser.ts#L210)

***

### isFolderIcon

> **isFolderIcon**: `boolean` = `false`

(KWZ only) Indicates whether or not this file is a Flipnote Studio 3D folder icon.

#### Inherited from

`BaseParser.isFolderIcon`

#### Source

[src/parsers/BaseParser.ts:215](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/BaseParser.ts#L215)

***

### isComment

> **isComment**: `boolean` = `false`

(KWZ only) Indicates whether or not this file is a handwritten comment from Flipnote Gallery World.

#### Inherited from

`BaseParser.isComment`

#### Source

[src/parsers/BaseParser.ts:220](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/BaseParser.ts#L220)

***

### isDsiLibraryNote

> **isDsiLibraryNote**: `boolean` = `false`

(KWZ only) Indicates whether or not this Flipnote is a PPM to KWZ conversion from Flipnote Studio 3D's DSi Library service.

#### Inherited from

`BaseParser.isDsiLibraryNote`

#### Source

[src/parsers/BaseParser.ts:225](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/BaseParser.ts#L225)

***

### format

> **format**: [`FlipnoteFormat`](/api/enumerations/flipnoteformat/) = `FlipnoteFormat.PPM`

File format type, reflects [PpmParser.format](../../../../../../../api/classes/ppmparser/#format).

#### Overrides

`BaseParser.format`

#### Source

[src/parsers/PpmParser.ts:193](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L193)

***

### meta

> **meta**: [`PpmMeta`](/api/interfaces/ppmmeta/)

File metadata, see [PpmMeta](../../../../../../../api/interfaces/ppmmeta) for structure.

#### Overrides

`BaseParser.meta`

#### Source

[src/parsers/PpmParser.ts:273](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L273)

***

### version

> **version**: `number`

File format version; always the same as far as we know.

#### Source

[src/parsers/PpmParser.ts:278](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L278)

***

### getTitle()

> **getTitle**(`formats`): `string`

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

• **formats**= `undefined`

• **formats.COMMENT**: `string`= `'Comment by $USERNAME'`

• **formats.FLIPNOTE**: `string`= `'Flipnote by $USERNAME'`

• **formats.ICON**: `string`= `'Folder icon'`

#### Returns

`string`

#### Inherited from

`BaseParser.getTitle`

#### Source

[src/parsers/BaseParser.ts:279](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/BaseParser.ts#L279)

***

### getThumbnailImage()

> **getThumbnailImage**(): `object`

Decodes the thumbnail image embedded in the Flipnote. Will return a [FlipnoteThumbImage](../../../../../../../api/type-aliases/flipnotethumbimage) containing raw RGBA data.

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

#### Source

[src/parsers/PpmParser.ts:455](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L455)

***

### getFrameAuthor()

> **getFrameAuthor**(`frameIndex`): `string`

Get the FSID for a given frame's original author. The PPM format doesn't actually store this information, so the current author FSID is returned. This method is only here for consistency with KWZ.

#### Parameters

• **frameIndex**: `number`

#### Returns

`string`

#### Overrides

`BaseParser.getFrameAuthor`

#### Source

[src/parsers/PpmParser.ts:703](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L703)

## Image

### palette

> **palette**: [`FlipnotePaletteDefinition`](/api/type-aliases/flipnotepalettedefinition/)

Flipnote palette.

#### Inherited from

`BaseParser.palette`

#### Source

[src/parsers/BaseParser.ts:184](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/BaseParser.ts#L184)

***

### layerVisibility

> **layerVisibility**: [`FlipnoteLayerVisibility`](/api/type-aliases/flipnotelayervisibility/)

Animation frame global layer visibility.

#### Inherited from

`BaseParser.layerVisibility`

#### Source

[src/parsers/BaseParser.ts:199](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/BaseParser.ts#L199)

***

### frameCount

> **frameCount**: `number`

Animation frame count.

#### Inherited from

`BaseParser.frameCount`

#### Source

[src/parsers/BaseParser.ts:230](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/BaseParser.ts#L230)

***

### frameSpeed

> **frameSpeed**: `number`

In-app animation playback speed.

#### Inherited from

`BaseParser.frameSpeed`

#### Source

[src/parsers/BaseParser.ts:235](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/BaseParser.ts#L235)

***

### duration

> **duration**: `number`

Animation duration, in seconds.

#### Inherited from

`BaseParser.duration`

#### Source

[src/parsers/BaseParser.ts:240](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/BaseParser.ts#L240)

***

### bgmSpeed

> **bgmSpeed**: `number`

In-app animation playback speed when the BGM track was recorded.

#### Inherited from

`BaseParser.bgmSpeed`

#### Source

[src/parsers/BaseParser.ts:245](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/BaseParser.ts#L245)

***

### framerate

> **framerate**: `number`

Animation framerate, measured as frames per second.

#### Inherited from

`BaseParser.framerate`

#### Source

[src/parsers/BaseParser.ts:250](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/BaseParser.ts#L250)

***

### thumbFrameIndex

> **thumbFrameIndex**: `number`

Index of the animation frame used as the Flipnote's thumbnail image.

#### Inherited from

`BaseParser.thumbFrameIndex`

#### Source

[src/parsers/BaseParser.ts:260](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/BaseParser.ts#L260)

***

### imageWidth

> **imageWidth**: `number` = `PpmParser.width`

Animation frame width, reflects [PpmParser.width](../../../../../../../api/classes/ppmparser/#width).

#### Overrides

`BaseParser.imageWidth`

#### Source

[src/parsers/PpmParser.ts:203](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L203)

***

### imageHeight

> **imageHeight**: `number` = `PpmParser.height`

Animation frame height, reflects [PpmParser.height](../../../../../../../api/classes/ppmparser/#height).

#### Overrides

`BaseParser.imageHeight`

#### Source

[src/parsers/PpmParser.ts:208](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L208)

***

### aspect

> **aspect**: `number` = `PpmParser.aspect`

Animation frame aspect ratio, reflects [PpmParser.aspect](../../../../../../../api/classes/ppmparser/#aspect).

#### Overrides

`BaseParser.aspect`

#### Source

[src/parsers/PpmParser.ts:213](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L213)

***

### imageOffsetX

> **imageOffsetX**: `number` = `0`

X offset for the top-left corner of the animation frame.

#### Overrides

`BaseParser.imageOffsetX`

#### Source

[src/parsers/PpmParser.ts:218](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L218)

***

### imageOffsetY

> **imageOffsetY**: `number` = `0`

Y offset for the top-left corner of the animation frame.

#### Overrides

`BaseParser.imageOffsetY`

#### Source

[src/parsers/PpmParser.ts:223](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L223)

***

### numLayers

> **numLayers**: `number` = `PpmParser.numLayers`

Number of animation frame layers, reflects [PpmParser.numLayers](../../../../../../../api/classes/ppmparser/#numlayers).

#### Overrides

`BaseParser.numLayers`

#### Source

[src/parsers/PpmParser.ts:228](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L228)

***

### numLayerColors

> **numLayerColors**: `number` = `PpmParser.numLayerColors`

Number of colors per layer (aside from transparent), reflects [PpmParser.numLayerColors](../../../../../../../api/classes/ppmparser/#numlayercolors).

#### Overrides

`BaseParser.numLayerColors`

#### Source

[src/parsers/PpmParser.ts:233](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L233)

***

### globalPalette

> **globalPalette**: [`FlipnotePaletteColor`](/api/type-aliases/flipnotepalettecolor/)[] = `PpmParser.globalPalette`

Global animation frame color palette, reflects [PpmParser.globalPalette](../../../../../../../api/classes/ppmparser/#globalpalette).

#### Overrides

`BaseParser.globalPalette`

#### Source

[src/parsers/PpmParser.ts:268](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L268)

***

### getLayerPixels()

> **getLayerPixels**(`frameIndex`, `layerIndex`, `imageBuffer`, `depthStrength`, `depthEye`): [`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )

Get the pixels for a given frame layer, as palette indices
NOTE: layerIndex are not guaranteed to be sorted by 3D depth in KWZs, use [getFrameLayerOrder](../../../../../../../api/classes/ppmparser/#getframelayerorder) to get the correct sort order first
NOTE: if the visibility flag for this layer is turned off, the result will be empty

#### Parameters

• **frameIndex**: `number`

• **layerIndex**: `number`

• **imageBuffer**: [`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )= `undefined`

• **depthStrength**: `number`= `0`

• **depthEye**: [`FlipnoteStereoscopicEye`](/api/enumerations/flipnotestereoscopiceye/)= `FlipnoteStereoscopicEye.Left`

#### Returns

[`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )

#### Inherited from

`BaseParser.getLayerPixels`

#### Source

[src/parsers/BaseParser.ts:334](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/BaseParser.ts#L334)

***

### getLayerPixelsRgba()

> **getLayerPixelsRgba**(`frameIndex`, `layerIndex`, `imageBuffer`, `paletteBuffer`, `depthStrength`, `depthEye`): [`Uint32Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array )

Get the pixels for a given frame layer, as RGBA pixels
NOTE: layerIndex are not guaranteed to be sorted by 3D depth in KWZs, use [getFrameLayerOrder](../../../../../../../api/classes/ppmparser/#getframelayerorder) to get the correct sort order first
NOTE: if the visibility flag for this layer is turned off, the result will be empty

#### Parameters

• **frameIndex**: `number`

• **layerIndex**: `number`

• **imageBuffer**: [`Uint32Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array )= `undefined`

• **paletteBuffer**: [`Uint32Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array )= `undefined`

• **depthStrength**: `number`= `0`

• **depthEye**: [`FlipnoteStereoscopicEye`](/api/enumerations/flipnotestereoscopiceye/)= `FlipnoteStereoscopicEye.Left`

#### Returns

[`Uint32Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array )

#### Inherited from

`BaseParser.getLayerPixelsRgba`

#### Source

[src/parsers/BaseParser.ts:382](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/BaseParser.ts#L382)

***

### getFramePixels()

> **getFramePixels**(`frameIndex`, `imageBuffer`, `depthStrength`, `depthEye`): [`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )

Get the image for a given frame, as palette indices

#### Parameters

• **frameIndex**: `number`

• **imageBuffer**: [`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )= `undefined`

• **depthStrength**: `number`= `0`

• **depthEye**: [`FlipnoteStereoscopicEye`](/api/enumerations/flipnotestereoscopiceye/)= `FlipnoteStereoscopicEye.Left`

#### Returns

[`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )

#### Inherited from

`BaseParser.getFramePixels`

#### Source

[src/parsers/BaseParser.ts:464](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/BaseParser.ts#L464)

***

### getFramePixelsRgba()

> **getFramePixelsRgba**(`frameIndex`, `imageBuffer`, `paletteBuffer`, `depthStrength`, `depthEye`): [`Uint32Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array )

Get the image for a given frame as an uint32 array of RGBA pixels

#### Parameters

• **frameIndex**: `number`

• **imageBuffer**: [`Uint32Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array )= `undefined`

• **paletteBuffer**: [`Uint32Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array )= `undefined`

• **depthStrength**: `number`= `0`

• **depthEye**: [`FlipnoteStereoscopicEye`](/api/enumerations/flipnotestereoscopiceye/)= `FlipnoteStereoscopicEye.Left`

#### Returns

[`Uint32Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array )

#### Inherited from

`BaseParser.getFramePixelsRgba`

#### Source

[src/parsers/BaseParser.ts:514](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/BaseParser.ts#L514)

***

### getFramePaletteUint32()

> **getFramePaletteUint32**(`frameIndex`, `paletteBuffer`): [`Uint32Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array )

Get the color palette for a given frame, as an uint32 array

#### Parameters

• **frameIndex**: `number`

• **paletteBuffer**: [`Uint32Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array )= `undefined`

#### Returns

[`Uint32Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array )

#### Inherited from

`BaseParser.getFramePaletteUint32`

#### Source

[src/parsers/BaseParser.ts:579](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/BaseParser.ts#L579)

***

### decodeFrame()

> **decodeFrame**(`frameIndex`): [[`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array ), [`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )]

Decode a frame, returning the raw pixel buffers for each layer

#### Parameters

• **frameIndex**: `number`

#### Returns

[[`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array ), [`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )]

#### Overrides

`BaseParser.decodeFrame`

#### Source

[src/parsers/PpmParser.ts:484](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L484)

***

### getFramePaletteIndices()

> **getFramePaletteIndices**(`frameIndex`): `number`[]

Get the color palette indices for a given frame. RGBA colors for these values can be indexed from [PpmParser.globalPalette](../../../../../../../api/classes/ppmparser/#globalpalette)

Returns an array where:
 - index 0 is the paper color index
 - index 1 is the layer 1 color index
 - index 2 is the layer 2 color index

#### Parameters

• **frameIndex**: `number`

#### Returns

`number`[]

#### Overrides

`BaseParser.getFramePaletteIndices`

#### Source

[src/parsers/PpmParser.ts:646](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L646)

***

### getFramePalette()

> **getFramePalette**(`frameIndex`): [`FlipnotePaletteColor`](/api/type-aliases/flipnotepalettecolor/)[]

Get the RGBA colors for a given frame

Returns an array where:
 - index 0 is the paper color
 - index 1 is the layer 1 color
 - index 2 is the layer 2 color

#### Parameters

• **frameIndex**: `number`

#### Returns

[`FlipnotePaletteColor`](/api/type-aliases/flipnotepalettecolor/)[]

#### Overrides

`BaseParser.getFramePalette`

#### Source

[src/parsers/PpmParser.ts:673](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L673)

***

### getIsKeyFrame()

> **getIsKeyFrame**(`frameIndex`): `boolean`[]

Determines if a given frame is a video key frame or not. This returns an array of booleans for each layer, since in the KWZ format, keyframe encoding is done on a per-layer basis.

#### Parameters

• **frameIndex**: `number`

#### Returns

`boolean`[]

#### Overrides

`BaseParser.getIsKeyFrame`

#### Source

[src/parsers/PpmParser.ts:684](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L684)

***

### getFrameLayerDepths()

> **getFrameLayerDepths**(`frameIndex`): `number`[]

Get the 3D depths for each layer in a given frame. The PPM format doesn't actually store this information, so `0` is returned for both layers. This method is only here for consistency with KWZ.

#### Parameters

• **frameIndex**: `number`

#### Returns

`number`[]

#### Overrides

`BaseParser.getFrameLayerDepths`

#### Source

[src/parsers/PpmParser.ts:694](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L694)

***

### getFrameCameraFlags()

> **getFrameCameraFlags**(`frameIndex`): `boolean`[]

Get the camera flags for a given frame. The PPM format doesn't actually store this information so `false` will be returned for both layers. This method is only here for consistency with KWZ.

#### Parameters

• **frameIndex**: `number`

#### Returns

`boolean`[]

Array of booleans, indicating whether each layer uses a photo or not

#### Overrides

`BaseParser.getFrameCameraFlags`

#### Source

[src/parsers/PpmParser.ts:712](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L712)

***

### getFrameLayerOrder()

> **getFrameLayerOrder**(`frameIndex`): `number`[]

Get the layer draw order for a given frame

#### Parameters

• **frameIndex**: `number`

#### Returns

`number`[]

Array of layer indices, in the order they should be drawn

#### Overrides

`BaseParser.getFrameLayerOrder`

#### Source

[src/parsers/PpmParser.ts:721](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L721)

## Audio

### bgmrate

> **bgmrate**: `number`

Animation framerate when the BGM track was recorded, measured as frames per second.

#### Inherited from

`BaseParser.bgmrate`

#### Source

[src/parsers/BaseParser.ts:255](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/BaseParser.ts#L255)

***

### audioClipRatio

> **audioClipRatio**: `number`

Get the amount of clipping in the master audio track, useful for determining if a Flipnote's audio is corrupted. Closer to 1.0 = more clipping. Only available after [getAudioMasterPcm](../../../../../../../api/classes/ppmparser/#getaudiomasterpcm) has been called.

#### Inherited from

`BaseParser.audioClipRatio`

#### Source

[src/parsers/BaseParser.ts:265](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/BaseParser.ts#L265)

***

### audioTracks

> **audioTracks**: [`FlipnoteAudioTrack`](/api/enumerations/flipnoteaudiotrack/)[] = `PpmParser.audioTracks`

Which audio tracks are available in this format, reflects [PpmParser.audioTracks](../../../../../../../api/classes/ppmparser/#audiotracks).

#### Overrides

`BaseParser.audioTracks`

#### Source

[src/parsers/PpmParser.ts:248](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L248)

***

### soundEffectTracks

> **soundEffectTracks**: [`FlipnoteSoundEffectTrack`](/api/enumerations/flipnotesoundeffecttrack/)[] = `PpmParser.soundEffectTracks`

Which sound effect tracks are available in this format, reflects [PpmParser.soundEffectTracks](../../../../../../../api/classes/ppmparser/#soundeffecttracks).

#### Overrides

`BaseParser.soundEffectTracks`

#### Source

[src/parsers/PpmParser.ts:253](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L253)

***

### rawSampleRate

> **rawSampleRate**: `number` = `PpmParser.rawSampleRate`

Audio track base sample rate, reflects [PpmParser.rawSampleRate](../../../../../../../api/classes/ppmparser/#rawsamplerate).

#### Overrides

`BaseParser.rawSampleRate`

#### Source

[src/parsers/PpmParser.ts:258](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L258)

***

### sampleRate

> **sampleRate**: `number` = `PpmParser.sampleRate`

Audio output sample rate, reflects [PpmParser.sampleRate](../../../../../../../api/classes/ppmparser/#samplerate).

#### Overrides

`BaseParser.sampleRate`

#### Source

[src/parsers/PpmParser.ts:263](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L263)

***

### getSoundEffectFlagsForTrack()

> **getSoundEffectFlagsForTrack**(`trackId`): `boolean`[]

Get the usage flags for a given track across every frame

#### Parameters

• **trackId**: [`FlipnoteSoundEffectTrack`](/api/enumerations/flipnotesoundeffecttrack/)

#### Returns

`boolean`[]

an array of booleans for every frame, indicating whether the track is used on that frame

#### Inherited from

`BaseParser.getSoundEffectFlagsForTrack`

#### Source

[src/parsers/BaseParser.ts:613](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/BaseParser.ts#L613)

***

### isSoundEffectUsedOnFrame()

> **isSoundEffectUsedOnFrame**(`trackId`, `frameIndex`): `boolean`

Is a given track used on a given frame

#### Parameters

• **trackId**: [`FlipnoteSoundEffectTrack`](/api/enumerations/flipnotesoundeffecttrack/)

• **frameIndex**: `number`

#### Returns

`boolean`

#### Inherited from

`BaseParser.isSoundEffectUsedOnFrame`

#### Source

[src/parsers/BaseParser.ts:621](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/BaseParser.ts#L621)

***

### hasAudioTrack()

> **hasAudioTrack**(`trackId`): `boolean`

Does an audio track exist in the Flipnote?

#### Parameters

• **trackId**: [`FlipnoteAudioTrack`](/api/enumerations/flipnoteaudiotrack/)

#### Returns

`boolean`

boolean

#### Inherited from

`BaseParser.hasAudioTrack`

#### Source

[src/parsers/BaseParser.ts:633](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/BaseParser.ts#L633)

***

### decodeSoundFlags()

> **decodeSoundFlags**(): `boolean`[][]

Get the sound effect flags for every frame in the Flipnote

#### Returns

`boolean`[][]

#### Overrides

`BaseParser.decodeSoundFlags`

#### Source

[src/parsers/PpmParser.ts:729](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L729)

***

### getSoundEffectFlags()

> **getSoundEffectFlags**(): [`FlipnoteSoundEffectFlags`](/api/type-aliases/flipnotesoundeffectflags/)[]

Get the sound effect usage flags for every frame

#### Returns

[`FlipnoteSoundEffectFlags`](/api/type-aliases/flipnotesoundeffectflags/)[]

#### Overrides

`BaseParser.getSoundEffectFlags`

#### Source

[src/parsers/PpmParser.ts:753](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L753)

***

### getFrameSoundEffectFlags()

> **getFrameSoundEffectFlags**(`frameIndex`): [`FlipnoteSoundEffectFlags`](/api/type-aliases/flipnotesoundeffectflags/)

Get the sound effect usage flags for a given frame

#### Parameters

• **frameIndex**: `number`

#### Returns

[`FlipnoteSoundEffectFlags`](/api/type-aliases/flipnotesoundeffectflags/)

#### Overrides

`BaseParser.getFrameSoundEffectFlags`

#### Source

[src/parsers/PpmParser.ts:766](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L766)

***

### getAudioTrackRaw()

> **getAudioTrackRaw**(`trackId`): [`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )

Get the raw compressed audio data for a given track

#### Parameters

• **trackId**: [`FlipnoteAudioTrack`](/api/enumerations/flipnoteaudiotrack/)

#### Returns

[`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )

byte array

#### Overrides

`BaseParser.getAudioTrackRaw`

#### Source

[src/parsers/PpmParser.ts:783](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L783)

***

### decodeAudioTrack()

> **decodeAudioTrack**(`trackId`): [`Int16Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int16Array )

Get the decoded audio data for a given track, using the track's native samplerate

#### Parameters

• **trackId**: [`FlipnoteAudioTrack`](/api/enumerations/flipnoteaudiotrack/)

#### Returns

[`Int16Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int16Array )

Signed 16-bit PCM audio

#### Overrides

`BaseParser.decodeAudioTrack`

#### Source

[src/parsers/PpmParser.ts:795](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L795)

***

### getAudioTrackPcm()

> **getAudioTrackPcm**(`trackId`, `dstFreq`): [`Int16Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int16Array )

Get the decoded audio data for a given track, using the specified samplerate

#### Parameters

• **trackId**: [`FlipnoteAudioTrack`](/api/enumerations/flipnoteaudiotrack/)

• **dstFreq**: `number`= `undefined`

#### Returns

[`Int16Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int16Array )

Signed 16-bit PCM audio

#### Overrides

`BaseParser.getAudioTrackPcm`

#### Source

[src/parsers/PpmParser.ts:840](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L840)

***

### getAudioMasterPcm()

> **getAudioMasterPcm**(`dstFreq`): [`Int16Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int16Array )

Get the full mixed audio for the Flipnote, using the specified samplerate

#### Parameters

• **dstFreq**: `number`= `undefined`

#### Returns

[`Int16Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int16Array )

Signed 16-bit PCM audio

#### Overrides

`BaseParser.getAudioMasterPcm`

#### Source

[src/parsers/PpmParser.ts:869](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L869)

## Verification

### publicKey

> **publicKey**: `string` = `PpmParser.publicKey`

Key used for Flipnote verification, in PEM format.

#### Overrides

`BaseParser.publicKey`

#### Source

[src/parsers/PpmParser.ts:238](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L238)

***

### getBody()

> **getBody**(): [`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )

Get the body of the Flipnote - the data that is digested for the signature

#### Returns

[`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )

#### Overrides

`BaseParser.getBody`

#### Source

[src/parsers/PpmParser.ts:907](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L907)

***

### getSignature()

> **getSignature**(): [`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )

Get the Flipnote's signature data

#### Returns

[`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )

#### Overrides

`BaseParser.getSignature`

#### Source

[src/parsers/PpmParser.ts:916](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L916)

***

### verify()

> **verify**(): [`Promise ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<`boolean`\>

Verify whether this Flipnote's signature is valid

#### Returns

[`Promise ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<`boolean`\>

#### Overrides

`BaseParser.verify`

#### Source

[src/parsers/PpmParser.ts:925](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L925)

## Utility

### [toStringTag]

> **[toStringTag]**: `string` = `'Flipnote Studio PPM animation file'`

Custom object tag.

#### Overrides

`BaseParser.[toStringTag]`

#### Source

[src/parsers/PpmParser.ts:198](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/PpmParser.ts#L198)

***

### toString()

> **toString**(): `string`

Returns the Flipnote title when casting a parser instance to a string.

```js
const str = 'Title: ' + note;
// str === 'Title: Flipnote by username'
```

#### Returns

`string`

#### Inherited from

`BaseParser.toString`

#### Source

[src/parsers/BaseParser.ts:295](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/BaseParser.ts#L295)

***

### `[iterator]`()

> **[iterator]**(): [`Generator ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Generator )\<`number`, `void`, `unknown`\>

Allows for frame index iteration when using the parser instance as a for..of iterator.

```js
for (const frameIndex of note) {
  // do something with frameIndex...
}
```

#### Returns

[`Generator ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Generator )\<`number`, `void`, `unknown`\>

#### Inherited from

`BaseParser.[iterator]`

#### Source

[src/parsers/BaseParser.ts:309](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/BaseParser.ts#L309)
