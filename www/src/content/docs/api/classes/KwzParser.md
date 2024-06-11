---
editUrl: false
next: false
prev: false
title: "KwzParser"
---

Parser class for Flipnote Studio 3D's KWZ animation format

KWZ format docs: https://github.com/Flipnote-Collective/flipnote-studio-3d-docs/wiki/KWZ-Format

## Extends

- `BaseParser`

## Constructors

### new KwzParser()

> **new KwzParser**(`arrayBuffer`, `settings`): [`KwzParser`](/api/classes/kwzparser/)

Create a new KWZ file parser instance

#### Parameters

• **arrayBuffer**: [`ArrayBuffer ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer )

an ArrayBuffer containing file data

• **settings**: [`Partial ↗️`]( https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype )\<[`KwzParserSettings`](/api/type-aliases/kwzparsersettings/)\>= `{}`

parser settings

#### Returns

[`KwzParser`](/api/classes/kwzparser/)

#### Overrides

`BaseParser.constructor`

#### Source

[src/parsers/KwzParser.ts:427](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L427)

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

> `static` **defaultSettings**: [`KwzParserSettings`](/api/type-aliases/kwzparsersettings/)

Default KWZ parser settings

#### Source

[src/parsers/KwzParser.ts:253](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L253)

***

### format

> `static` **format**: [`FlipnoteFormat`](/api/enumerations/flipnoteformat/) = `FlipnoteFormat.KWZ`

File format type

#### Overrides

`BaseParser.format`

#### Source

[src/parsers/KwzParser.ts:266](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L266)

***

### width

> `static` **width**: `number` = `320`

Animation frame width

#### Overrides

`BaseParser.width`

#### Source

[src/parsers/KwzParser.ts:270](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L270)

***

### height

> `static` **height**: `number` = `240`

Animation frame height

#### Overrides

`BaseParser.height`

#### Source

[src/parsers/KwzParser.ts:274](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L274)

***

### aspect

> `static` **aspect**: `number`

Animation frame aspect ratio

#### Overrides

`BaseParser.aspect`

#### Source

[src/parsers/KwzParser.ts:278](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L278)

***

### numLayers

> `static` **numLayers**: `number` = `3`

Number of animation frame layers

#### Overrides

`BaseParser.numLayers`

#### Source

[src/parsers/KwzParser.ts:282](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L282)

***

### numLayerColors

> `static` **numLayerColors**: `number` = `2`

Number of colors per layer (aside from transparent)

#### Overrides

`BaseParser.numLayerColors`

#### Source

[src/parsers/KwzParser.ts:286](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L286)

***

### rawSampleRate

> `static` **rawSampleRate**: `number` = `16364`

Audio track base sample rate

#### Overrides

`BaseParser.rawSampleRate`

#### Source

[src/parsers/KwzParser.ts:290](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L290)

***

### sampleRate

> `static` **sampleRate**: `number` = `32768`

Audio output sample rate

#### Overrides

`BaseParser.sampleRate`

#### Source

[src/parsers/KwzParser.ts:294](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L294)

***

### audioTracks

> `static` **audioTracks**: [`FlipnoteAudioTrack`](/api/enumerations/flipnoteaudiotrack/)[]

Which audio tracks are available in this format

#### Overrides

`BaseParser.audioTracks`

#### Source

[src/parsers/KwzParser.ts:298](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L298)

***

### soundEffectTracks

> `static` **soundEffectTracks**: [`FlipnoteSoundEffectTrack`](/api/enumerations/flipnotesoundeffecttrack/)[]

Which sound effect tracks are available in this format

#### Overrides

`BaseParser.soundEffectTracks`

#### Source

[src/parsers/KwzParser.ts:308](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L308)

***

### globalPalette

> `static` **globalPalette**: [`FlipnotePaletteColor`](/api/type-aliases/flipnotepalettecolor/)[]

Global animation frame color palette

#### Overrides

`BaseParser.globalPalette`

#### Source

[src/parsers/KwzParser.ts:317](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L317)

***

### publicKey

> `static` **publicKey**: `string` = `KWZ_PUBLIC_KEY`

Public key used for Flipnote verification, in PEM format

#### Overrides

`BaseParser.publicKey`

#### Source

[src/parsers/KwzParser.ts:329](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L329)

***

### format

> **format**: [`FlipnoteFormat`](/api/enumerations/flipnoteformat/) = `FlipnoteFormat.KWZ`

File format type, reflects [KwzParser.format](../../../../../../../api/classes/kwzparser/#format)

#### Overrides

`BaseParser.format`

#### Source

[src/parsers/KwzParser.ts:342](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L342)

***

### [toStringTag]

> **[toStringTag]**: `string` = `'Flipnote Studio 3D KWZ animation file'`

Custom object tag

#### Overrides

`BaseParser.[toStringTag]`

#### Source

[src/parsers/KwzParser.ts:346](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L346)

***

### imageWidth

> **imageWidth**: `number` = `KwzParser.width`

Animation frame width, reflects [KwzParser.width](../../../../../../../api/classes/kwzparser/#width)

#### Overrides

`BaseParser.imageWidth`

#### Source

[src/parsers/KwzParser.ts:350](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L350)

***

### imageHeight

> **imageHeight**: `number` = `KwzParser.height`

Animation frame height, reflects [KwzParser.height](../../../../../../../api/classes/kwzparser/#height)

#### Overrides

`BaseParser.imageHeight`

#### Source

[src/parsers/KwzParser.ts:354](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L354)

***

### aspect

> **aspect**: `number` = `KwzParser.aspect`

Animation frame aspect ratio, reflects [KwzParser.aspect](../../../../../../../api/classes/kwzparser/#aspect)

#### Overrides

`BaseParser.aspect`

#### Source

[src/parsers/KwzParser.ts:358](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L358)

***

### imageOffsetX

> **imageOffsetX**: `number` = `0`

X offset for the top-left corner of the animation frame

#### Overrides

`BaseParser.imageOffsetX`

#### Source

[src/parsers/KwzParser.ts:362](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L362)

***

### imageOffsetY

> **imageOffsetY**: `number` = `0`

Y offset for the top-left corner of the animation frame

#### Overrides

`BaseParser.imageOffsetY`

#### Source

[src/parsers/KwzParser.ts:366](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L366)

***

### numLayers

> **numLayers**: `number` = `KwzParser.numLayers`

Number of animation frame layers, reflects [KwzParser.numLayers](../../../../../../../api/classes/kwzparser/#numlayers)

#### Overrides

`BaseParser.numLayers`

#### Source

[src/parsers/KwzParser.ts:370](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L370)

***

### numLayerColors

> **numLayerColors**: `number` = `KwzParser.numLayerColors`

Number of colors per layer (aside from transparent), reflects [KwzParser.numLayerColors](../../../../../../../api/classes/kwzparser/#numlayercolors)

#### Overrides

`BaseParser.numLayerColors`

#### Source

[src/parsers/KwzParser.ts:374](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L374)

***

### publicKey

> **publicKey**: `string` = `KwzParser.publicKey`

key used for Flipnote verification, in PEM format

#### Overrides

`BaseParser.publicKey`

#### Source

[src/parsers/KwzParser.ts:378](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L378)

***

### audioTracks

> **audioTracks**: [`FlipnoteAudioTrack`](/api/enumerations/flipnoteaudiotrack/)[] = `KwzParser.audioTracks`

Which audio tracks are available in this format, reflects [KwzParser.audioTracks](../../../../../../../api/classes/kwzparser/#audiotracks)

#### Overrides

`BaseParser.audioTracks`

#### Source

[src/parsers/KwzParser.ts:386](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L386)

***

### soundEffectTracks

> **soundEffectTracks**: [`FlipnoteSoundEffectTrack`](/api/enumerations/flipnotesoundeffecttrack/)[] = `KwzParser.soundEffectTracks`

Which sound effect tracks are available in this format, reflects [KwzParser.soundEffectTracks](../../../../../../../api/classes/kwzparser/#soundeffecttracks)

#### Overrides

`BaseParser.soundEffectTracks`

#### Source

[src/parsers/KwzParser.ts:390](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L390)

***

### rawSampleRate

> **rawSampleRate**: `number` = `KwzParser.rawSampleRate`

Audio track base sample rate, reflects [KwzParser.rawSampleRate](../../../../../../../api/classes/kwzparser/#rawsamplerate)

#### Overrides

`BaseParser.rawSampleRate`

#### Source

[src/parsers/KwzParser.ts:394](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L394)

***

### sampleRate

> **sampleRate**: `number` = `KwzParser.sampleRate`

Audio output sample rate, reflects [KwzParser.sampleRate](../../../../../../../api/classes/kwzparser/#samplerate)

#### Overrides

`BaseParser.sampleRate`

#### Source

[src/parsers/KwzParser.ts:398](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L398)

***

### globalPalette

> **globalPalette**: [`FlipnotePaletteColor`](/api/type-aliases/flipnotepalettecolor/)[] = `KwzParser.globalPalette`

Global animation frame color palette, reflects [KwzParser.globalPalette](../../../../../../../api/classes/kwzparser/#globalpalette)

#### Overrides

`BaseParser.globalPalette`

#### Source

[src/parsers/KwzParser.ts:402](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L402)

## Methods

### matchBuffer()

> `static` **matchBuffer**(`buffer`): `boolean`

#### Parameters

• **buffer**: [`ArrayBuffer ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer )

#### Returns

`boolean`

#### Source

[src/parsers/KwzParser.ts:331](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L331)

***

### getFrameDiffingFlag()

> **getFrameDiffingFlag**(`frameIndex`): `number`

#### Parameters

• **frameIndex**: `number`

#### Returns

`number`

#### Source

[src/parsers/KwzParser.ts:748](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L748)

***

### decodeFrameSoundFlags()

> **decodeFrameSoundFlags**(`frameIndex`): `boolean`[]

#### Parameters

• **frameIndex**: `number`

#### Returns

`boolean`[]

#### Source

[src/parsers/KwzParser.ts:1039](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L1039)

***

### decodeAdpcm()

> **decodeAdpcm**(`src`, `dst`, `predictor`, `stepIndex`): `number`

#### Parameters

• **src**: [`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )

• **dst**: [`Int16Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int16Array )

• **predictor**: `number`= `0`

• **stepIndex**: `number`= `0`

#### Returns

`number`

#### Source

[src/parsers/KwzParser.ts:1103](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L1103)

***

### pcmAudioMix()

> **pcmAudioMix**(`src`, `dst`, `dstOffset`): `void`

#### Parameters

• **src**: [`Int16Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int16Array )

• **dst**: [`Int16Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int16Array )

• **dstOffset**: `number`= `0`

#### Returns

`void`

#### Source

[src/parsers/KwzParser.ts:1236](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L1236)

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

Default formats used for [getTitle](../../../../../../../api/classes/kwzparser/#gettitle).

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

### meta

> **meta**: [`KwzMeta`](/api/interfaces/kwzmeta/)

File metadata, see [KwzMeta](../../../../../../../api/interfaces/kwzmeta) for structure.

#### Overrides

`BaseParser.meta`

#### Source

[src/parsers/KwzParser.ts:407](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L407)

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

Decodes the thumbnail image embedded in the Flipnote. Will return a [FlipnoteThumbImage](../../../../../../../api/type-aliases/flipnotethumbimage) containing JPEG data.

Note: For most purposes, you should probably just decode the thumbnail fraa to get a higher resolution image.

#### Returns

`object`

##### format

> **format**: [`FlipnoteThumbImageFormat`](/api/enumerations/flipnotethumbimageformat/) = `FlipnoteThumbImageFormat.Jpeg`

##### width

> **width**: `number` = `80`

##### height

> **height**: `number` = `64`

##### data

> **data**: `ArrayBufferLike` = `bytes.buffer`

#### Overrides

`BaseParser.getThumbnailImage`

#### Source

[src/parsers/KwzParser.ts:688](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L688)

***

### getFrameAuthor()

> **getFrameAuthor**(`frameIndex`): `string`

Get the FSID for a given frame's original author.

#### Parameters

• **frameIndex**: `number`

#### Returns

`string`

#### Overrides

`BaseParser.getFrameAuthor`

#### Source

[src/parsers/KwzParser.ts:788](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L788)

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

### getLayerPixels()

> **getLayerPixels**(`frameIndex`, `layerIndex`, `imageBuffer`, `depthStrength`, `depthEye`): [`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )

Get the pixels for a given frame layer, as palette indices
NOTE: layerIndex are not guaranteed to be sorted by 3D depth in KWZs, use [getFrameLayerOrder](../../../../../../../api/classes/kwzparser/#getframelayerorder) to get the correct sort order first
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
NOTE: layerIndex are not guaranteed to be sorted by 3D depth in KWZs, use [getFrameLayerOrder](../../../../../../../api/classes/kwzparser/#getframelayerorder) to get the correct sort order first
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

### getFramePaletteIndices()

> **getFramePaletteIndices**(`frameIndex`): `number`[]

Get the color palette indices for a given frame. RGBA colors for these values can be indexed from [KwzParser.globalPalette](../../../../../../../api/classes/kwzparser/#globalpalette)

Returns an array where:
 - index 0 is the paper color index
 - index 1 is the layer A color 1 index
 - index 2 is the layer A color 2 index
 - index 3 is the layer B color 1 index
 - index 4 is the layer B color 2 index
 - index 5 is the layer C color 1 index
 - index 6 is the layer C color 2 index

#### Parameters

• **frameIndex**: `number`

#### Returns

`number`[]

#### Overrides

`BaseParser.getFramePaletteIndices`

#### Source

[src/parsers/KwzParser.ts:714](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L714)

***

### getFramePalette()

> **getFramePalette**(`frameIndex`): [`FlipnotePaletteColor`](/api/type-aliases/flipnotepalettecolor/)[]

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

• **frameIndex**: `number`

#### Returns

[`FlipnotePaletteColor`](/api/type-aliases/flipnotepalettecolor/)[]

#### Overrides

`BaseParser.getFramePalette`

#### Source

[src/parsers/KwzParser.ts:742](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L742)

***

### getIsKeyFrame()

> **getIsKeyFrame**(`frameIndex`): `boolean`[]

Determines if a given frame is a video key frame or not. This returns an array of booleans for each layer, since keyframe encoding is done on a per-layer basis.

#### Parameters

• **frameIndex**: `number`

#### Returns

`boolean`[]

#### Overrides

`BaseParser.getIsKeyFrame`

#### Source

[src/parsers/KwzParser.ts:759](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L759)

***

### getFrameLayerDepths()

> **getFrameLayerDepths**(`frameIndex`): `number`[]

Get the 3D depths for each layer in a given frame.

#### Parameters

• **frameIndex**: `number`

#### Returns

`number`[]

#### Overrides

`BaseParser.getFrameLayerDepths`

#### Source

[src/parsers/KwzParser.ts:773](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L773)

***

### getFrameCameraFlags()

> **getFrameCameraFlags**(`frameIndex`): `boolean`[]

Get the camera flags for a given frame

#### Parameters

• **frameIndex**: `number`

#### Returns

`boolean`[]

Array of booleans, indicating whether each layer uses a photo or not

#### Overrides

`BaseParser.getFrameCameraFlags`

#### Source

[src/parsers/KwzParser.ts:799](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L799)

***

### getFrameLayerOrder()

> **getFrameLayerOrder**(`frameIndex`): `number`[]

Get the layer draw order for a given frame

#### Parameters

• **frameIndex**: `number`

#### Returns

`number`[]

#### Overrides

`BaseParser.getFrameLayerOrder`

#### Source

[src/parsers/KwzParser.ts:813](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L813)

***

### decodeFrame()

> **decodeFrame**(`frameIndex`, `diffingFlag`, `isPrevFrame`): [[`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array ), [`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array ), [`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )]

Decode a frame, returning the raw pixel buffers for each layer

#### Parameters

• **frameIndex**: `number`

• **diffingFlag**: `number`= `0x7`

• **isPrevFrame**: `boolean`= `false`

#### Returns

[[`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array ), [`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array ), [`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )]

#### Overrides

`BaseParser.decodeFrame`

#### Source

[src/parsers/KwzParser.ts:823](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L823)

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

Get the amount of clipping in the master audio track, useful for determining if a Flipnote's audio is corrupted. Closer to 1.0 = more clipping. Only available after [getAudioMasterPcm](../../../../../../../api/classes/kwzparser/#getaudiomasterpcm) has been called.

#### Inherited from

`BaseParser.audioClipRatio`

#### Source

[src/parsers/BaseParser.ts:265](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/BaseParser.ts#L265)

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

[src/parsers/KwzParser.ts:1055](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L1055)

***

### getSoundEffectFlags()

> **getSoundEffectFlags**(): [`FlipnoteSoundEffectFlags`](/api/type-aliases/flipnotesoundeffectflags/)[]

Get the sound effect usage flags for every frame

#### Returns

[`FlipnoteSoundEffectFlags`](/api/type-aliases/flipnotesoundeffectflags/)[]

#### Overrides

`BaseParser.getSoundEffectFlags`

#### Source

[src/parsers/KwzParser.ts:1068](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L1068)

***

### getFrameSoundEffectFlags()

> **getFrameSoundEffectFlags**(`frameIndex`): [`FlipnoteSoundEffectFlags`](/api/type-aliases/flipnotesoundeffectflags/)

Get the sound effect usage for a given frame

#### Parameters

• **frameIndex**: `number`

#### Returns

[`FlipnoteSoundEffectFlags`](/api/type-aliases/flipnotesoundeffectflags/)

#### Overrides

`BaseParser.getFrameSoundEffectFlags`

#### Source

[src/parsers/KwzParser.ts:1082](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L1082)

***

### getAudioTrackRaw()

> **getAudioTrackRaw**(`trackId`): [`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )

Get the raw compressed audio data for a given track

#### Parameters

• **trackId**: [`FlipnoteAudioTrack`](/api/enumerations/flipnoteaudiotrack/)

#### Returns

[`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )

Byte array

#### Overrides

`BaseParser.getAudioTrackRaw`

#### Source

[src/parsers/KwzParser.ts:1097](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L1097)

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

[src/parsers/KwzParser.ts:1161](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L1161)

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

[src/parsers/KwzParser.ts:1223](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L1223)

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

[src/parsers/KwzParser.ts:1253](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L1253)

## Verification

### getBody()

> **getBody**(): [`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )

Get the body of the Flipnote - the data that is digested for the signature

#### Returns

[`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )

#### Overrides

`BaseParser.getBody`

#### Source

[src/parsers/KwzParser.ts:1295](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L1295)

***

### getSignature()

> **getSignature**(): [`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )

Get the Flipnote's signature data

#### Returns

[`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )

#### Overrides

`BaseParser.getSignature`

#### Source

[src/parsers/KwzParser.ts:1304](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L1304)

***

### verify()

> **verify**(): [`Promise ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<`boolean`\>

Verify whether this Flipnote's signature is valid

#### Returns

[`Promise ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<`boolean`\>

#### Overrides

`BaseParser.verify`

#### Source

[src/parsers/KwzParser.ts:1313](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/KwzParser.ts#L1313)

## Utility

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
