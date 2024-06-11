---
editUrl: false
next: false
prev: false
title: "WavAudio"
---

Wav audio object. Used to create a [WAV](https://en.wikipedia.org/wiki/WAV) file from a PCM audio stream or a [Flipnote](../../../../../../../api/type-aliases/flipnote) object. 

Currently only supports PCM s16_le audio encoding.

## Extends

- `EncoderBase`

## Constructors

### new WavAudio()

> **new WavAudio**(`sampleRate`, `channels`, `bitsPerSample`): [`WavAudio`](/api/classes/wavaudio/)

Create a new WAV audio object

#### Parameters

• **sampleRate**: `number`

audio samplerate

• **channels**: `number`= `1`

number of audio channels

• **bitsPerSample**: `number`= `16`

number of bits per sample

#### Returns

[`WavAudio`](/api/classes/wavaudio/)

#### Overrides

`EncoderBase.constructor`

#### Source

[src/encoders/WavAudio.ts:40](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/WavAudio.ts#L40)

## Properties

### dataUrl

> **dataUrl**: `string` = `null`

#### Inherited from

`EncoderBase.dataUrl`

#### Source

[src/encoders/EncoderBase.ts:6](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/EncoderBase.ts#L6)

***

### mimeType

> **mimeType**: `"audio/wav"`

#### Overrides

`EncoderBase.mimeType`

#### Source

[src/encoders/WavAudio.ts:16](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/WavAudio.ts#L16)

***

### sampleRate

> **sampleRate**: `number`

Audio samplerate

#### Source

[src/encoders/WavAudio.ts:21](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/WavAudio.ts#L21)

***

### channels

> **channels**: `number`

Number of audio channels

#### Source

[src/encoders/WavAudio.ts:25](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/WavAudio.ts#L25)

***

### bitsPerSample

> **bitsPerSample**: `number`

Number of bits per sample

#### Source

[src/encoders/WavAudio.ts:29](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/WavAudio.ts#L29)

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

> `static` **fromFlipnote**(`note`): [`WavAudio`](/api/classes/wavaudio/)

Create a WAV audio file from a Flipnote's master audio track

#### Parameters

• **note**: `BaseParser`

#### Returns

[`WavAudio`](/api/classes/wavaudio/)

#### Source

[src/encoders/WavAudio.ts:84](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/WavAudio.ts#L84)

***

### fromFlipnoteTrack()

> `static` **fromFlipnoteTrack**(`flipnote`, `trackId`): [`WavAudio`](/api/classes/wavaudio/)

Create a WAV audio file from a given Flipnote audio track

#### Parameters

• **flipnote**: `BaseParser`

• **trackId**: [`FlipnoteAudioTrack`](/api/enumerations/flipnoteaudiotrack/)

#### Returns

[`WavAudio`](/api/classes/wavaudio/)

#### Source

[src/encoders/WavAudio.ts:97](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/WavAudio.ts#L97)

***

### writeSamples()

> **writeSamples**(`pcmData`): `void`

Add PCM audio frames to the WAV

#### Parameters

• **pcmData**: [`Int16Array ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int16Array )

signed int16 PCM audio samples

#### Returns

`void`

#### Source

[src/encoders/WavAudio.ts:109](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/WavAudio.ts#L109)

***

### getArrayBuffer()

> **getArrayBuffer**(): `ArrayBufferLike`

Returns the WAV audio data as an [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

#### Returns

`ArrayBufferLike`

#### Overrides

`EncoderBase.getArrayBuffer`

#### Source

[src/encoders/WavAudio.ts:123](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/encoders/WavAudio.ts#L123)
