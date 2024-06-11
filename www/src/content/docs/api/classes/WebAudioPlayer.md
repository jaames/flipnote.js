---
editUrl: false
next: false
prev: false
title: "WebAudioPlayer"
---

Audio player built around the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API).

Capable of playing PCM streams, with volume adjustment and an optional equalizer. Only available in browser contexts.

## Constructors

### new WebAudioPlayer()

> **new WebAudioPlayer**(): [`WebAudioPlayer`](/api/classes/webaudioplayer/)

#### Returns

[`WebAudioPlayer`](/api/classes/webaudioplayer/)

#### Source

[src/webaudio/WebAudioPlayer.ts:68](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/webaudio/WebAudioPlayer.ts#L68)

## Accessors

### volume

> `get` **volume**(): `number`

> `set` **volume**(`value`): `void`

The audio output volume. Range is 0 to 1.

#### Parameters

• **value**: `number`

#### Returns

`number`

#### Source

[src/webaudio/WebAudioPlayer.ts:79](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/webaudio/WebAudioPlayer.ts#L79)

***

### loop

> `get` **loop**(): `boolean`

> `set` **loop**(`value`): `void`

Whether the audio should loop after it has ended

#### Parameters

• **value**: `boolean`

#### Returns

`boolean`

#### Source

[src/webaudio/WebAudioPlayer.ts:92](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/webaudio/WebAudioPlayer.ts#L92)

## Properties

### ctx

> **ctx**: [`AudioContext ↗️`]( https://developer.mozilla.org/docs/Web/API/AudioContext )

Audio context, see [AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext).

#### Source

[src/webaudio/WebAudioPlayer.ts:27](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/webaudio/WebAudioPlayer.ts#L27)

***

### sampleRate

> **sampleRate**: `number`

Audio sample rate.

#### Source

[src/webaudio/WebAudioPlayer.ts:31](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/webaudio/WebAudioPlayer.ts#L31)

***

### useEq

> **useEq**: `boolean` = `false`

Whether the audio is being run through an equalizer or not.

#### Source

[src/webaudio/WebAudioPlayer.ts:35](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/webaudio/WebAudioPlayer.ts#L35)

***

### useAnalyser

> **useAnalyser**: `boolean` = `false`

Whether to connect the output to an audio analyser (see [analyser](../../../../../../../api/classes/webaudioplayer/#analyser)).

#### Source

[src/webaudio/WebAudioPlayer.ts:39](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/webaudio/WebAudioPlayer.ts#L39)

***

### eqSettings

> **eqSettings**: [`number`, `number`][]

Default equalizer settings. Credit to [Sudomemo](https://www.sudomemo.net/) for these.

#### Source

[src/webaudio/WebAudioPlayer.ts:43](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/webaudio/WebAudioPlayer.ts#L43)

***

### analyser

> **analyser**: [`AnalyserNode ↗️`]( https://developer.mozilla.org/docs/Web/API/AnalyserNode )

If enabled, provides audio analysis for visualization etc - https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API

#### Source

[src/webaudio/WebAudioPlayer.ts:57](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/webaudio/WebAudioPlayer.ts#L57)

## Methods

### setBuffer()

> **setBuffer**(`inputBuffer`, `sampleRate`): `void`

Set the audio buffer to play

#### Parameters

• **inputBuffer**: [`PcmAudioBuffer`](/api/type-aliases/pcmaudiobuffer/)

• **sampleRate**: `number`

For best results, this should be a multiple of 16364

#### Returns

`void`

#### Source

[src/webaudio/WebAudioPlayer.ts:107](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/webaudio/WebAudioPlayer.ts#L107)

***

### setAnalyserEnabled()

> **setAnalyserEnabled**(`on`): `void`

#### Parameters

• **on**: `boolean`

#### Returns

`void`

#### Source

[src/webaudio/WebAudioPlayer.ts:179](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/webaudio/WebAudioPlayer.ts#L179)

***

### setVolume()

> **setVolume**(`value`): `void`

Sets the audio volume level

#### Parameters

• **value**: `number`

range is 0 to 1

#### Returns

`void`

#### Source

[src/webaudio/WebAudioPlayer.ts:188](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/webaudio/WebAudioPlayer.ts#L188)

***

### playFrom()

> **playFrom**(`currentTime`): `void`

Begin playback from a specific point

Note that the WebAudioPlayer doesn't keep track of audio playback itself. We rely on the [Player](../../../../../../../api/classes/player) API for that.

#### Parameters

• **currentTime**: `number`

initial playback position, in seconds

#### Returns

`void`

#### Source

[src/webaudio/WebAudioPlayer.ts:203](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/webaudio/WebAudioPlayer.ts#L203)

***

### stop()

> **stop**(): `void`

Stops the audio playback

#### Returns

`void`

#### Source

[src/webaudio/WebAudioPlayer.ts:214](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/webaudio/WebAudioPlayer.ts#L214)

***

### getCurrentTime()

> **getCurrentTime**(): `number`

Get the current playback time, in seconds

#### Returns

`number`

#### Source

[src/webaudio/WebAudioPlayer.ts:222](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/webaudio/WebAudioPlayer.ts#L222)

***

### destroy()

> **destroy**(): [`Promise ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<`void`\>

Frees any resources used by this canvas instance

#### Returns

[`Promise ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<`void`\>

#### Source

[src/webaudio/WebAudioPlayer.ts:229](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/webaudio/WebAudioPlayer.ts#L229)
