---
editUrl: false
next: false
prev: false
title: "WebAudioPlayer"
---

Defined in: [src/webaudio/WebAudioPlayer.ts:22](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/webaudio/WebAudioPlayer.ts#L22)

Audio player built around the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API).

Capable of playing PCM streams, with volume adjustment and an optional equalizer. Only available in browser contexts.

## Constructors

### new WebAudioPlayer()

> **new WebAudioPlayer**(): [`WebAudioPlayer`](/api/classes/webaudioplayer/)

Defined in: [src/webaudio/WebAudioPlayer.ts:68](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/webaudio/WebAudioPlayer.ts#L68)

#### Returns

[`WebAudioPlayer`](/api/classes/webaudioplayer/)

## Accessors

### volume

#### Get Signature

> **get** **volume**(): `number`

Defined in: [src/webaudio/WebAudioPlayer.ts:79](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/webaudio/WebAudioPlayer.ts#L79)

##### Returns

`number`

#### Set Signature

> **set** **volume**(`value`): `void`

Defined in: [src/webaudio/WebAudioPlayer.ts:75](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/webaudio/WebAudioPlayer.ts#L75)

The audio output volume. Range is 0 to 1.

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `value` | `number` |

##### Returns

`void`

***

### loop

#### Get Signature

> **get** **loop**(): `boolean`

Defined in: [src/webaudio/WebAudioPlayer.ts:92](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/webaudio/WebAudioPlayer.ts#L92)

##### Returns

`boolean`

#### Set Signature

> **set** **loop**(`value`): `void`

Defined in: [src/webaudio/WebAudioPlayer.ts:86](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/webaudio/WebAudioPlayer.ts#L86)

Whether the audio should loop after it has ended

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `value` | `boolean` |

##### Returns

`void`

## Properties

### ctx

> **ctx**: [`AudioContext`](https://developer.mozilla.org/docs/Web/API/AudioContext)

Defined in: [src/webaudio/WebAudioPlayer.ts:27](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/webaudio/WebAudioPlayer.ts#L27)

Audio context, see [AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext).

***

### sampleRate

> **sampleRate**: `number`

Defined in: [src/webaudio/WebAudioPlayer.ts:31](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/webaudio/WebAudioPlayer.ts#L31)

Audio sample rate.

***

### useEq

> **useEq**: `boolean` = `false`

Defined in: [src/webaudio/WebAudioPlayer.ts:35](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/webaudio/WebAudioPlayer.ts#L35)

Whether the audio is being run through an equalizer or not.

***

### useAnalyser

> **useAnalyser**: `boolean` = `false`

Defined in: [src/webaudio/WebAudioPlayer.ts:39](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/webaudio/WebAudioPlayer.ts#L39)

Whether to connect the output to an audio analyser (see [analyser](../../../../../../api/classes/webaudioplayer/#analyser)).

***

### eqSettings

> **eqSettings**: \[`number`, `number`\][]

Defined in: [src/webaudio/WebAudioPlayer.ts:43](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/webaudio/WebAudioPlayer.ts#L43)

Default equalizer settings. Credit to [Sudomemo](https://www.sudomemo.net/) for these.

***

### analyser

> **analyser**: [`AnalyserNode`](https://developer.mozilla.org/docs/Web/API/AnalyserNode)

Defined in: [src/webaudio/WebAudioPlayer.ts:57](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/webaudio/WebAudioPlayer.ts#L57)

If enabled, provides audio analysis for visualization etc - https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API

## Methods

### setBuffer()

> **setBuffer**(`inputBuffer`, `sampleRate`): `void`

Defined in: [src/webaudio/WebAudioPlayer.ts:107](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/webaudio/WebAudioPlayer.ts#L107)

Set the audio buffer to play

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `inputBuffer` | [`PcmAudioBuffer`](/api/type-aliases/pcmaudiobuffer/) |  |
| `sampleRate` | `number` | For best results, this should be a multiple of 16364 |

#### Returns

`void`

***

### setAnalyserEnabled()

> **setAnalyserEnabled**(`on`): `void`

Defined in: [src/webaudio/WebAudioPlayer.ts:179](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/webaudio/WebAudioPlayer.ts#L179)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `on` | `boolean` |

#### Returns

`void`

***

### setVolume()

> **setVolume**(`value`): `void`

Defined in: [src/webaudio/WebAudioPlayer.ts:188](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/webaudio/WebAudioPlayer.ts#L188)

Sets the audio volume level

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `value` | `number` | range is 0 to 1 |

#### Returns

`void`

***

### playFrom()

> **playFrom**(`currentTime`): `void`

Defined in: [src/webaudio/WebAudioPlayer.ts:203](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/webaudio/WebAudioPlayer.ts#L203)

Begin playback from a specific point

Note that the WebAudioPlayer doesn't keep track of audio playback itself. We rely on the [Player](../../../../../../api/classes/player) API for that.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `currentTime` | `number` | initial playback position, in seconds |

#### Returns

`void`

***

### stop()

> **stop**(): `void`

Defined in: [src/webaudio/WebAudioPlayer.ts:214](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/webaudio/WebAudioPlayer.ts#L214)

Stops the audio playback

#### Returns

`void`

***

### getCurrentTime()

> **getCurrentTime**(): `number`

Defined in: [src/webaudio/WebAudioPlayer.ts:222](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/webaudio/WebAudioPlayer.ts#L222)

Get the current playback time, in seconds

#### Returns

`number`

***

### destroy()

> **destroy**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [src/webaudio/WebAudioPlayer.ts:229](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/webaudio/WebAudioPlayer.ts#L229)

Frees any resources used by this canvas instance

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>
