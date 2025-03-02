---
editUrl: false
next: false
prev: false
title: "GifImage"
---

Defined in: [src/encoders/GifImage.ts:54](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/encoders/GifImage.ts#L54)

GIF image encoder.

Supports static single-frame GIF export as well as animated GIF.

## Extends

- `EncoderBase`

## Constructors

### new GifImage()

> **new GifImage**(`width`, `height`, `settings`): [`GifImage`](/api/classes/gifimage/)

Defined in: [src/encoders/GifImage.ts:97](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/encoders/GifImage.ts#L97)

Create a new GIF image object.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `width` | `number` | image width |
| `height` | `number` | image height |
| `settings` | [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`GifImageSettings`](/api/interfaces/gifimagesettings/)\> | whether the gif should loop, the delay between frames, etc. See GifEncoderSettings |

#### Returns

[`GifImage`](/api/classes/gifimage/)

#### Overrides

`EncoderBase.constructor`

## Properties

### dataUrl

> **dataUrl**: `string` = `null`

Defined in: [src/encoders/EncoderBase.ts:6](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/encoders/EncoderBase.ts#L6)

#### Inherited from

`EncoderBase.dataUrl`

***

### defaultSettings

> `static` **defaultSettings**: [`GifImageSettings`](/api/interfaces/gifimagesettings/)

Defined in: [src/encoders/GifImage.ts:59](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/encoders/GifImage.ts#L59)

Default GIF encoder settings

***

### mimeType

> `readonly` **mimeType**: `"gif/image"` = `'gif/image'`

Defined in: [src/encoders/GifImage.ts:65](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/encoders/GifImage.ts#L65)

#### Overrides

`EncoderBase.mimeType`

***

### width

> **width**: `number`

Defined in: [src/encoders/GifImage.ts:69](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/encoders/GifImage.ts#L69)

Image width (in pixels).

***

### height

> **height**: `number`

Defined in: [src/encoders/GifImage.ts:73](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/encoders/GifImage.ts#L73)

Image height (in pixels).

***

### palette

> **palette**: [`GifPaletteColor`](/api/type-aliases/gifpalettecolor/)[]

Defined in: [src/encoders/GifImage.ts:77](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/encoders/GifImage.ts#L77)

GIF global RGBA color palette. Max 256 colors, alpha channel is ignored.

***

### settings

> **settings**: [`GifImageSettings`](/api/interfaces/gifimagesettings/)

Defined in: [src/encoders/GifImage.ts:81](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/encoders/GifImage.ts#L81)

GIF image settings, such as whether it should loop, the delay between frames, etc.

***

### frameCount

> **frameCount**: `number` = `0`

Defined in: [src/encoders/GifImage.ts:85](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/encoders/GifImage.ts#L85)

Number of current GIF frames.

## Methods

### getBuffer()

> **getBuffer**(): `Buffer`

Defined in: [src/encoders/EncoderBase.ts:18](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/encoders/EncoderBase.ts#L18)

Returns the file data as a NodeJS [Buffer](https://nodejs.org/api/buffer.html).

> Note: This method does not work outside of NodeJS environments.

#### Returns

`Buffer`

#### Inherited from

`EncoderBase.getBuffer`

***

### getBlob()

> **getBlob**(): [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob)

Defined in: [src/encoders/EncoderBase.ts:26](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/encoders/EncoderBase.ts#L26)

Returns the file data as a [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob).

#### Returns

[`Blob`](https://developer.mozilla.org/docs/Web/API/Blob)

#### Inherited from

`EncoderBase.getBlob`

***

### getUrl()

> **getUrl**(): `string`

Defined in: [src/encoders/EncoderBase.ts:38](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/encoders/EncoderBase.ts#L38)

Returns the file data as an [Object URL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL).

> Note: This method does not work outside of browser environments.

#### Returns

`string`

#### Inherited from

`EncoderBase.getUrl`

***

### revokeUrl()

> **revokeUrl**(): `void`

Defined in: [src/encoders/EncoderBase.ts:50](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/encoders/EncoderBase.ts#L50)

Revokes this file's [Object URL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL) if one has been created, use this when the url created with [getUrl](../../../../../../api/classes/gifimage/#geturl) is no longer needed, to preserve memory.

> Note: This method does not work outside of browser environments.

#### Returns

`void`

#### Inherited from

`EncoderBase.revokeUrl`

***

### fromFlipnote()

> `static` **fromFlipnote**(`flipnote`, `settings`): [`GifImage`](/api/classes/gifimage/)

Defined in: [src/encoders/GifImage.ts:113](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/encoders/GifImage.ts#L113)

Create an animated GIF image from a Flipnote.

This will encode the entire animation, so depending on the number of frames it could take a while to return.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `flipnote` | `BaseParser` | [Flipnote](../../../../../../api/type-aliases/flipnote) object ([PpmParser](../../../../../../api/classes/ppmparser) or [KwzParser](../../../../../../api/classes/kwzparser) instance) |
| `settings` | [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`GifImageSettings`](/api/interfaces/gifimagesettings/)\> | whether the gif should loop, the delay between frames, etc. See GifEncoderSettings |

#### Returns

[`GifImage`](/api/classes/gifimage/)

***

### fromFlipnoteFrame()

> `static` **fromFlipnoteFrame**(`flipnote`, `frameIndex`, `settings`): [`GifImage`](/api/classes/gifimage/)

Defined in: [src/encoders/GifImage.ts:135](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/encoders/GifImage.ts#L135)

Create an GIF image from a single Flipnote frame

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `flipnote` | `BaseParser` |  |
| `frameIndex` | `number` | animation frame index to encode |
| `settings` | [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`GifImageSettings`](/api/interfaces/gifimagesettings/)\> | whether the gif should loop, the delay between frames, etc. See GifEncoderSettings |

#### Returns

[`GifImage`](/api/classes/gifimage/)

***

### writeFrame()

> **writeFrame**(`pixels`): `void`

Defined in: [src/encoders/GifImage.ts:151](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/encoders/GifImage.ts#L151)

Add a frame to the GIF image

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `pixels` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | Raw pixels to encode, must be an uncompressed 8bit array of palette indices with a size matching image width * image height |

#### Returns

`void`

***

### finish()

> **finish**(): `void`

Defined in: [src/encoders/GifImage.ts:162](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/encoders/GifImage.ts#L162)

Call once all frames have been written to finish the GIF image.

#### Returns

`void`

***

### getArrayBuffer()

> **getArrayBuffer**(): `ArrayBufferLike`

Defined in: [src/encoders/GifImage.ts:169](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/encoders/GifImage.ts#L169)

Returns the GIF image data as an [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

#### Returns

`ArrayBufferLike`

#### Overrides

`EncoderBase.getArrayBuffer`

***

### getImage()

> **getImage**(): [`HTMLImageElement`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement)

Defined in: [src/encoders/GifImage.ts:178](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/encoders/GifImage.ts#L178)

Returns the GIF image data as an [Image](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image) object

Note: This method does not work outside of browser environments

#### Returns

[`HTMLImageElement`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement)
