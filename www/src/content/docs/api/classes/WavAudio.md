---
editUrl: false
next: false
prev: false
title: "WavAudio"
---

Defined in: [src/encoders/WavAudio.ts:14](https://github.com/jaames/flipnote.js/blob/fa9305c29e8ec1c9100d20a6b44d2fa614eb1888/src/encoders/WavAudio.ts#L14)

Wav audio object. Used to create a [WAV](https://en.wikipedia.org/wiki/WAV) file from a PCM audio stream or a [Flipnote](../../../../../../api/type-aliases/flipnote) object. 

Currently only supports PCM s16_le audio encoding.

## Extends

- `EncoderBase`

## Constructors

### new WavAudio()

> **new WavAudio**(`sampleRate`, `channels`, `bitsPerSample`): [`WavAudio`](/api/classes/wavaudio/)

Defined in: [src/encoders/WavAudio.ts:40](https://github.com/jaames/flipnote.js/blob/fa9305c29e8ec1c9100d20a6b44d2fa614eb1888/src/encoders/WavAudio.ts#L40)

Create a new WAV audio object

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `sampleRate` | `number` | `undefined` | audio samplerate |
| `channels` | `number` | `1` | number of audio channels |
| `bitsPerSample` | `number` | `16` | number of bits per sample |

#### Returns

[`WavAudio`](/api/classes/wavaudio/)

#### Overrides

`EncoderBase.constructor`

## Properties

### dataUrl

> **dataUrl**: `string` = `null`

Defined in: [src/encoders/EncoderBase.ts:6](https://github.com/jaames/flipnote.js/blob/fa9305c29e8ec1c9100d20a6b44d2fa614eb1888/src/encoders/EncoderBase.ts#L6)

#### Inherited from

`EncoderBase.dataUrl`

***

### mimeType

> **mimeType**: `"audio/wav"`

Defined in: [src/encoders/WavAudio.ts:16](https://github.com/jaames/flipnote.js/blob/fa9305c29e8ec1c9100d20a6b44d2fa614eb1888/src/encoders/WavAudio.ts#L16)

#### Overrides

`EncoderBase.mimeType`

***

### sampleRate

> **sampleRate**: `number`

Defined in: [src/encoders/WavAudio.ts:21](https://github.com/jaames/flipnote.js/blob/fa9305c29e8ec1c9100d20a6b44d2fa614eb1888/src/encoders/WavAudio.ts#L21)

Audio samplerate

***

### channels

> **channels**: `number`

Defined in: [src/encoders/WavAudio.ts:25](https://github.com/jaames/flipnote.js/blob/fa9305c29e8ec1c9100d20a6b44d2fa614eb1888/src/encoders/WavAudio.ts#L25)

Number of audio channels

***

### bitsPerSample

> **bitsPerSample**: `number`

Defined in: [src/encoders/WavAudio.ts:29](https://github.com/jaames/flipnote.js/blob/fa9305c29e8ec1c9100d20a6b44d2fa614eb1888/src/encoders/WavAudio.ts#L29)

Number of bits per sample

## Methods

### getBuffer()

> **getBuffer**(): `Buffer`

Defined in: [src/encoders/EncoderBase.ts:18](https://github.com/jaames/flipnote.js/blob/fa9305c29e8ec1c9100d20a6b44d2fa614eb1888/src/encoders/EncoderBase.ts#L18)

Returns the file data as a NodeJS [Buffer](https://nodejs.org/api/buffer.html).

> Note: This method does not work outside of NodeJS environments.

#### Returns

`Buffer`

#### Inherited from

`EncoderBase.getBuffer`

***

### getBlob()

> **getBlob**(): [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob)

Defined in: [src/encoders/EncoderBase.ts:26](https://github.com/jaames/flipnote.js/blob/fa9305c29e8ec1c9100d20a6b44d2fa614eb1888/src/encoders/EncoderBase.ts#L26)

Returns the file data as a [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob).

#### Returns

[`Blob`](https://developer.mozilla.org/docs/Web/API/Blob)

#### Inherited from

`EncoderBase.getBlob`

***

### getUrl()

> **getUrl**(): `string`

Defined in: [src/encoders/EncoderBase.ts:38](https://github.com/jaames/flipnote.js/blob/fa9305c29e8ec1c9100d20a6b44d2fa614eb1888/src/encoders/EncoderBase.ts#L38)

Returns the file data as an [Object URL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL).

> Note: This method does not work outside of browser environments.

#### Returns

`string`

#### Inherited from

`EncoderBase.getUrl`

***

### revokeUrl()

> **revokeUrl**(): `void`

Defined in: [src/encoders/EncoderBase.ts:50](https://github.com/jaames/flipnote.js/blob/fa9305c29e8ec1c9100d20a6b44d2fa614eb1888/src/encoders/EncoderBase.ts#L50)

Revokes this file's [Object URL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL) if one has been created, use this when the url created with [getUrl](../../../../../../api/classes/gifimage/#geturl) is no longer needed, to preserve memory.

> Note: This method does not work outside of browser environments.

#### Returns

`void`

#### Inherited from

`EncoderBase.revokeUrl`

***

### fromFlipnote()

> `static` **fromFlipnote**(`note`): [`WavAudio`](/api/classes/wavaudio/)

Defined in: [src/encoders/WavAudio.ts:84](https://github.com/jaames/flipnote.js/blob/fa9305c29e8ec1c9100d20a6b44d2fa614eb1888/src/encoders/WavAudio.ts#L84)

Create a WAV audio file from a Flipnote's master audio track

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `note` | `BaseParser` |

#### Returns

[`WavAudio`](/api/classes/wavaudio/)

***

### fromFlipnoteTrack()

> `static` **fromFlipnoteTrack**(`flipnote`, `trackId`): [`WavAudio`](/api/classes/wavaudio/)

Defined in: [src/encoders/WavAudio.ts:97](https://github.com/jaames/flipnote.js/blob/fa9305c29e8ec1c9100d20a6b44d2fa614eb1888/src/encoders/WavAudio.ts#L97)

Create a WAV audio file from a given Flipnote audio track

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `flipnote` | `BaseParser` |  |
| `trackId` | [`FlipnoteAudioTrack`](/api/enumerations/flipnoteaudiotrack/) |  |

#### Returns

[`WavAudio`](/api/classes/wavaudio/)

***

### writeSamples()

> **writeSamples**(`pcmData`): `void`

Defined in: [src/encoders/WavAudio.ts:109](https://github.com/jaames/flipnote.js/blob/fa9305c29e8ec1c9100d20a6b44d2fa614eb1888/src/encoders/WavAudio.ts#L109)

Add PCM audio frames to the WAV

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `pcmData` | [`Int16Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int16Array) | signed int16 PCM audio samples |

#### Returns

`void`

***

### getArrayBuffer()

> **getArrayBuffer**(): `ArrayBufferLike`

Defined in: [src/encoders/WavAudio.ts:123](https://github.com/jaames/flipnote.js/blob/fa9305c29e8ec1c9100d20a6b44d2fa614eb1888/src/encoders/WavAudio.ts#L123)

Returns the WAV audio data as an [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

#### Returns

`ArrayBufferLike`

#### Overrides

`EncoderBase.getArrayBuffer`
