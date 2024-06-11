---
editUrl: false
next: false
prev: false
title: "GifImage"
---

GIF image encoder.

Supports static single-frame GIF export as well as animated GIF.

## Extends

- `EncoderBase`

## Constructors

### new GifImage()

> **new GifImage**(`width`, `height`, `settings`): [`GifImage`](/api/classes/gifimage/)

Create a new GIF image object.

#### Parameters

• **width**: `number`

image width

• **height**: `number`

image height

• **settings**: [`Partial ↗️`]( https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype )\<[`GifImageSettings`](/api/interfaces/gifimagesettings/)\>= `{}`

whether the gif should loop, the delay between frames, etc. See GifEncoderSettings

#### Returns

[`GifImage`](/api/classes/gifimage/)

#### Overrides

`EncoderBase.constructor`

#### Source

[src/encoders/GifImage.ts:97](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/GifImage.ts#L97)

## Properties

### dataUrl

> **dataUrl**: `string` = `null`

#### Inherited from

`EncoderBase.dataUrl`

#### Source

[src/encoders/EncoderBase.ts:6](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/EncoderBase.ts#L6)

***

### defaultSettings

> `static` **defaultSettings**: [`GifImageSettings`](/api/interfaces/gifimagesettings/)

Default GIF encoder settings

#### Source

[src/encoders/GifImage.ts:59](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/GifImage.ts#L59)

***

### mimeType

> `readonly` **mimeType**: `"gif/image"` = `'gif/image'`

#### Overrides

`EncoderBase.mimeType`

#### Source

[src/encoders/GifImage.ts:65](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/GifImage.ts#L65)

***

### width

> **width**: `number`

Image width (in pixels).

#### Source

[src/encoders/GifImage.ts:69](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/GifImage.ts#L69)

***

### height

> **height**: `number`

Image height (in pixels).

#### Source

[src/encoders/GifImage.ts:73](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/GifImage.ts#L73)

***

### palette

> **palette**: [`GifPaletteColor`](/api/type-aliases/gifpalettecolor/)[]

GIF global RGBA color palette. Max 256 colors, alpha channel is ignored.

#### Source

[src/encoders/GifImage.ts:77](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/GifImage.ts#L77)

***

### settings

> **settings**: [`GifImageSettings`](/api/interfaces/gifimagesettings/)

GIF image settings, such as whether it should loop, the delay between frames, etc.

#### Source

[src/encoders/GifImage.ts:81](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/GifImage.ts#L81)

***

### frameCount

> **frameCount**: `number` = `0`

Number of current GIF frames.

#### Source

[src/encoders/GifImage.ts:85](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/GifImage.ts#L85)

## Methods

### getBuffer()

> **getBuffer**(): `Buffer`

Returns the file data as a NodeJS [Buffer](https://nodejs.org/api/buffer.html).

> Note: This method does not work outside of NodeJS environments.

#### Returns

`Buffer`

#### Inherited from

`EncoderBase.getBuffer`

#### Source

[src/encoders/EncoderBase.ts:18](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/EncoderBase.ts#L18)

***

### getBlob()

> **getBlob**(): [`Blob ↗️`]( https://developer.mozilla.org/docs/Web/API/Blob )

Returns the file data as a [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob).

#### Returns

[`Blob ↗️`]( https://developer.mozilla.org/docs/Web/API/Blob )

#### Inherited from

`EncoderBase.getBlob`

#### Source

[src/encoders/EncoderBase.ts:26](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/EncoderBase.ts#L26)

***

### getUrl()

> **getUrl**(): `string`

Returns the file data as an [Object URL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL).

> Note: This method does not work outside of browser environments.

#### Returns

`string`

#### Inherited from

`EncoderBase.getUrl`

#### Source

[src/encoders/EncoderBase.ts:38](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/EncoderBase.ts#L38)

***

### revokeUrl()

> **revokeUrl**(): `void`

Revokes this file's [Object URL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL) if one has been created, use this when the url created with [getUrl](../../../../../../../api/classes/gifimage/#geturl) is no longer needed, to preserve memory.

> Note: This method does not work outside of browser environments.

#### Returns

`void`

#### Inherited from

`EncoderBase.revokeUrl`

#### Source

[src/encoders/EncoderBase.ts:50](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/EncoderBase.ts#L50)

***

### fromFlipnote()

> `static` **fromFlipnote**(`flipnote`, `settings`): [`GifImage`](/api/classes/gifimage/)

Create an animated GIF image from a Flipnote.

This will encode the entire animation, so depending on the number of frames it could take a while to return.

#### Parameters

• **flipnote**: `BaseParser`

[Flipnote](../../../../../../../api/type-aliases/flipnote) object ([PpmParser](../../../../../../../api/classes/ppmparser) or [KwzParser](../../../../../../../api/classes/kwzparser) instance)

• **settings**: [`Partial ↗️`]( https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype )\<[`GifImageSettings`](/api/interfaces/gifimagesettings/)\>= `{}`

whether the gif should loop, the delay between frames, etc. See GifEncoderSettings

#### Returns

[`GifImage`](/api/classes/gifimage/)

#### Source

[src/encoders/GifImage.ts:113](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/GifImage.ts#L113)

***

### fromFlipnoteFrame()

> `static` **fromFlipnoteFrame**(`flipnote`, `frameIndex`, `settings`): [`GifImage`](/api/classes/gifimage/)

Create an GIF image from a single Flipnote frame

#### Parameters

• **flipnote**: `BaseParser`

• **frameIndex**: `number`

animation frame index to encode

• **settings**: [`Partial ↗️`]( https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype )\<[`GifImageSettings`](/api/interfaces/gifimagesettings/)\>= `{}`

whether the gif should loop, the delay between frames, etc. See GifEncoderSettings

#### Returns

[`GifImage`](/api/classes/gifimage/)

#### Source

[src/encoders/GifImage.ts:135](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/GifImage.ts#L135)

***

### writeFrame()

> **writeFrame**(`pixels`): `void`

Add a frame to the GIF image

#### Parameters

• **pixels**: [`Uint8Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )

Raw pixels to encode, must be an uncompressed 8bit array of palette indices with a size matching image width * image height

#### Returns

`void`

#### Source

[src/encoders/GifImage.ts:151](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/GifImage.ts#L151)

***

### finish()

> **finish**(): `void`

Call once all frames have been written to finish the GIF image.

#### Returns

`void`

#### Source

[src/encoders/GifImage.ts:162](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/GifImage.ts#L162)

***

### getArrayBuffer()

> **getArrayBuffer**(): `ArrayBufferLike`

Returns the GIF image data as an [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

#### Returns

`ArrayBufferLike`

#### Overrides

`EncoderBase.getArrayBuffer`

#### Source

[src/encoders/GifImage.ts:169](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/GifImage.ts#L169)

***

### getImage()

> **getImage**(): [`HTMLImageElement ↗️`]( https://developer.mozilla.org/docs/Web/API/HTMLImageElement )

Returns the GIF image data as an [Image](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image) object

Note: This method does not work outside of browser environments

#### Returns

[`HTMLImageElement ↗️`]( https://developer.mozilla.org/docs/Web/API/HTMLImageElement )

#### Source

[src/encoders/GifImage.ts:178](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/GifImage.ts#L178)
