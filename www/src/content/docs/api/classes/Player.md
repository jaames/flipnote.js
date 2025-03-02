---
editUrl: false
next: false
prev: false
title: "Player"
---

Defined in: [src/player/Player.ts:47](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L47)

Flipnote Player API (exported as `flipnote.Player`) - provides a [MediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement)-like interface for loading Flipnotes and playing them. 
This is intended for cases where you want to implement your own player UI, if you just want a pre-built player with some nice UI controls, check out the [Web Components](/web-components/) page instead!

### Create a new player

You'll need an element in your page's HTML to act as a wrapper for the player:

```html
 <div id="player-wrapper"></div>
```

Then you can create a new `Player` instance by passing a CSS selector that matches the wrapper element, plus the desired width and height.

```js
 const player = new flipnote.Player('#player-wrapper', 320, 240);
```

### Load a Flipnote

Load a Flipnote from a valid FlipnoteSource:

```js
player.load('./path/to/flipnote.ppm');
```

### Listen to events

Use the [on](../../../../../../api/classes/player/#on) method to register event listeners:

```js
 player.on('play', function() {
   // do something when the Flipnote starts playing...
 });
```

## Constructors

### new Player()

> **new Player**(`parent`, `width`, `height`, `parserSettings`): [`Player`](/api/classes/player/)

Defined in: [src/player/Player.ts:171](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L171)

Create a new Player instance

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `parent` | `string` \| [`Element`](https://developer.mozilla.org/docs/Web/API/Element) | Element to mount the rendering canvas to |
| `width` | `number` | Canvas width (pixels) |
| `height` | `number` | Canvas height (pixels) The ratio between `width` and `height` should be 3:4 for best results |
| `parserSettings` | [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype) | - |

#### Returns

[`Player`](/api/classes/player/)

## Properties

### el

> **el**: [`Element`](https://developer.mozilla.org/docs/Web/API/Element)

Defined in: [src/player/Player.ts:57](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L57)

Root element

***

### note

> **note**: `BaseParser`

Defined in: [src/player/Player.ts:61](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L61)

Currently loaded Flipnote

***

### parserSettings

> **parserSettings**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)

Defined in: [src/player/Player.ts:65](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L65)

Flipnote parser settings

***

### noteFormat

> **noteFormat**: [`FlipnoteFormat`](/api/enumerations/flipnoteformat/)

Defined in: [src/player/Player.ts:69](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L69)

Format of the currently loaded Flipnote

***

### meta

> **meta**: [`FlipnoteMeta`](/api/interfaces/flipnotemeta/)

Defined in: [src/player/Player.ts:73](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L73)

Metadata for the currently loaded Flipnote

***

### duration

> **duration**: `number` = `0`

Defined in: [src/player/Player.ts:77](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L77)

Animation duration, in seconds

***

### layerVisibility

> **layerVisibility**: `PlayerLayerVisibility`

Defined in: [src/player/Player.ts:81](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L81)

Animation layer visibility

***

### autoplay

> **autoplay**: `boolean` = `false`

Defined in: [src/player/Player.ts:85](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L85)

Automatically begin playback after a Flipnote is loaded

***

### supportedEvents

> **supportedEvents**: [`PlayerEvent`](/api/enumerations/playerevent/)[]

Defined in: [src/player/Player.ts:89](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L89)

Array of events supported by this player

## Lifecycle

### src

#### Get Signature

> **get** **src**(): `any`

Defined in: [src/player/Player.ts:189](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L189)

The currently loaded Flipnote source, if there is one

:::caution[Deprecated]
This API is no longer supported and may be removed in a future release.
:::

##### Returns

`any`

#### Set Signature

> **set** **src**(`source`): `void`

Defined in: [src/player/Player.ts:192](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L192)

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `source` | `any` |

##### Returns

`void`

***

### load()

> **load**(`source`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [src/player/Player.ts:347](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L347)

Open a Flipnote from a source

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `source` | `any` |

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

***

### reload()

> **reload**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [src/player/Player.ts:373](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L373)

Reload the current Flipnote.

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

***

### updateSettings()

> **updateSettings**(`settings`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [src/player/Player.ts:382](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L382)

Reload the current Flipnote, applying new parser settings.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `settings` | [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype) |

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

***

### closeNote()

> **closeNote**(): `void`

Defined in: [src/player/Player.ts:391](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L391)

Close the currently loaded Flipnote

#### Returns

`void`

***

### openNote()

> **openNote**(`note`): `void`

Defined in: [src/player/Player.ts:413](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L413)

Open a Flipnote into the player

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `note` | `BaseParser` |

#### Returns

`void`

***

### destroy()

> **destroy**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [src/player/Player.ts:1177](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L1177)

Destroy a Player instance

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

## Playback Control

### paused

#### Get Signature

> **get** **paused**(): `boolean`

Defined in: [src/player/Player.ts:200](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L200)

Indicates whether playback is currently paused

##### Returns

`boolean`

#### Set Signature

> **set** **paused**(`isPaused`): `void`

Defined in: [src/player/Player.ts:203](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L203)

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `isPaused` | `boolean` |

##### Returns

`void`

***

### currentFrame

#### Get Signature

> **get** **currentFrame**(): `number`

Defined in: [src/player/Player.ts:214](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L214)

Current animation frame index.

##### Returns

`number`

#### Set Signature

> **set** **currentFrame**(`frameIndex`): `void`

Defined in: [src/player/Player.ts:217](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L217)

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `frameIndex` | `number` |

##### Returns

`void`

***

### currentTime

#### Get Signature

> **get** **currentTime**(): `number`

Defined in: [src/player/Player.ts:225](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L225)

Current animation playback position, in seconds.

##### Returns

`number`

#### Set Signature

> **set** **currentTime**(`value`): `void`

Defined in: [src/player/Player.ts:228](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L228)

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `value` | `number` |

##### Returns

`void`

***

### progress

#### Get Signature

> **get** **progress**(): `number`

Defined in: [src/player/Player.ts:236](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L236)

Current animation playback progress, as a percentage out of 100.

##### Returns

`number`

#### Set Signature

> **set** **progress**(`value`): `void`

Defined in: [src/player/Player.ts:239](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L239)

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

Defined in: [src/player/Player.ts:271](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L271)

Indicates whether playback should loop once the end is reached

##### Returns

`boolean`

#### Set Signature

> **set** **loop**(`value`): `void`

Defined in: [src/player/Player.ts:275](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L275)

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `value` | `boolean` |

##### Returns

`void`

***

### framerate

#### Get Signature

> **get** **framerate**(): `number`

Defined in: [src/player/Player.ts:283](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L283)

Animation frame rate, measured in frames per second.

##### Returns

`number`

***

### setCurrentTime()

> **setCurrentTime**(`value`): `void`

Defined in: [src/player/Player.ts:478](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L478)

Set the current playback time

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

***

### getCurrentTime()

> **getCurrentTime**(): `number`

Defined in: [src/player/Player.ts:490](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L490)

Get the current playback time

#### Returns

`number`

***

### getTimeCounter()

> **getTimeCounter**(): `string`

Defined in: [src/player/Player.ts:498](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L498)

Get the current time as a counter string, like `"0:00 / 1:00"`

#### Returns

`string`

***

### getFrameCounter()

> **getFrameCounter**(): `string`

Defined in: [src/player/Player.ts:508](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L508)

Get the current frame index as a counter string, like `"001 / 999"`

#### Returns

`string`

***

### setProgress()

> **setProgress**(`value`): `void`

Defined in: [src/player/Player.ts:518](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L518)

Set the current playback progress as a percentage (`0` to `100`)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

***

### getProgress()

> **getProgress**(): `number`

Defined in: [src/player/Player.ts:528](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L528)

Get the current playback progress as a percentage (0 to 100)

#### Returns

`number`

***

### play()

> **play**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [src/player/Player.ts:536](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L536)

Begin animation playback starting at the current position

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

***

### pause()

> **pause**(): `void`

Defined in: [src/player/Player.ts:558](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L558)

Pause animation playback at the current position

#### Returns

`void`

***

### togglePlay()

> **togglePlay**(): `void`

Defined in: [src/player/Player.ts:572](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L572)

Resumes animation playback if paused, otherwise pauses

#### Returns

`void`

***

### getPaused()

> **getPaused**(): `boolean`

Defined in: [src/player/Player.ts:583](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L583)

Determines if playback is currently paused

#### Returns

`boolean`

***

### getDuration()

> **getDuration**(): `number`

Defined in: [src/player/Player.ts:591](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L591)

Get the duration of the Flipnote in seconds

#### Returns

`number`

***

### getLoop()

> **getLoop**(): `boolean`

Defined in: [src/player/Player.ts:599](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L599)

Determines if playback is looped

#### Returns

`boolean`

***

### setLoop()

> **setLoop**(`loop`): `void`

Defined in: [src/player/Player.ts:607](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L607)

Set the playback loop

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `loop` | `boolean` |

#### Returns

`void`

***

### toggleLoop()

> **toggleLoop**(): `void`

Defined in: [src/player/Player.ts:616](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L616)

Switch the playback loop between on and off

#### Returns

`void`

***

### startSeek()

> **startSeek**(): `void`

Defined in: [src/player/Player.ts:697](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L697)

Begins a seek operation

#### Returns

`void`

***

### seek()

> **seek**(`position`): `void`

Defined in: [src/player/Player.ts:711](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L711)

Seek the playback progress to a different position

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `position` | `number` | animation playback position, range `0` to `1` |

#### Returns

`void`

***

### endSeek()

> **endSeek**(): `void`

Defined in: [src/player/Player.ts:720](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L720)

Ends a seek operation

#### Returns

`void`

## Frame Control

### frameCount

#### Get Signature

> **get** **frameCount**(): `number`

Defined in: [src/player/Player.ts:291](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L291)

Animation frame count.

##### Returns

`number`

***

### frameSpeed

#### Get Signature

> **get** **frameSpeed**(): `number`

Defined in: [src/player/Player.ts:299](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L299)

Animation frame speed.

##### Returns

`number`

***

### setCurrentFrame()

> **setCurrentFrame**(`newFrameValue`): `void`

Defined in: [src/player/Player.ts:624](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L624)

Jump to a given animation frame

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `newFrameValue` | `number` |

#### Returns

`void`

***

### nextFrame()

> **nextFrame**(): `void`

Defined in: [src/player/Player.ts:646](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L646)

Jump to the next animation frame
If the animation loops, and is currently on its last frame, it will wrap to the first frame

#### Returns

`void`

***

### prevFrame()

> **prevFrame**(): `void`

Defined in: [src/player/Player.ts:659](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L659)

Jump to the next animation frame
If the animation loops, and is currently on its first frame, it will wrap to the last frame

#### Returns

`void`

***

### lastFrame()

> **lastFrame**(): `void`

Defined in: [src/player/Player.ts:671](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L671)

Jump to the last animation frame

#### Returns

`void`

***

### firstFrame()

> **firstFrame**(): `void`

Defined in: [src/player/Player.ts:680](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L680)

Jump to the first animation frame

#### Returns

`void`

***

### thumbnailFrame()

> **thumbnailFrame**(): `void`

Defined in: [src/player/Player.ts:689](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L689)

Jump to the thumbnail frame

#### Returns

`void`

## Display Control

### renderer

> **renderer**: [`UniversalCanvas`](/api/classes/universalcanvas/)

Defined in: [src/player/Player.ts:53](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L53)

Flipnote renderer.

***

### drawFrame()

> **drawFrame**(`frameIndex`): `void`

Defined in: [src/player/Player.ts:732](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L732)

Draws the specified animation frame to the canvas. Note that this doesn't update the playback time or anything, it simply decodes a given frame and displays it.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `frameIndex` | `number` |  |

#### Returns

`void`

***

### forceUpdate()

> **forceUpdate**(): `void`

Defined in: [src/player/Player.ts:740](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L740)

Forces the current animation frame to be redrawn

#### Returns

`void`

***

### resize()

> **resize**(`width`, `height`): `void`

Defined in: [src/player/Player.ts:753](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L753)

Resize the playback canvas to a new size

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `width` | `number` | new canvas width (pixels) |
| `height` | `number` | new canvas height (pixels) The ratio between `width` and `height` should be 3:4 for best results |

#### Returns

`void`

***

### setLayerVisibility()

> **setLayerVisibility**(`layer`, `value`): `void`

Defined in: [src/player/Player.ts:767](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L767)

Sets whether an animation layer should be visible throughout the entire animation

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `layer` | `number` | layer index, starting at 1 |
| `value` | `boolean` | `true` for visible, `false` for invisible |

#### Returns

`void`

***

### getLayerVisibility()

> **getLayerVisibility**(`layer`): `boolean`

Defined in: [src/player/Player.ts:779](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L779)

Returns the visibility state for a given layer

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `layer` | `number` | layer index, starting at 1 |

#### Returns

`boolean`

***

### toggleLayerVisibility()

> **toggleLayerVisibility**(`layerIndex`): `void`

Defined in: [src/player/Player.ts:788](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L788)

Toggles whether an animation layer should be visible throughout the entire animation

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `layerIndex` | `number` |

#### Returns

`void`

## Audio Control

### volume

#### Get Signature

> **get** **volume**(): `number`

Defined in: [src/player/Player.ts:247](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L247)

Audio volume, range `0` to `1`.

##### Returns

`number`

#### Set Signature

> **set** **volume**(`value`): `void`

Defined in: [src/player/Player.ts:251](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L251)

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `value` | `number` |

##### Returns

`void`

***

### muted

#### Get Signature

> **get** **muted**(): `boolean`

Defined in: [src/player/Player.ts:259](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L259)

Audio mute state.

##### Returns

`boolean`

#### Set Signature

> **set** **muted**(`value`): `void`

Defined in: [src/player/Player.ts:263](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L263)

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `value` | `boolean` |

##### Returns

`void`

***

### toggleAudioEq()

> **toggleAudioEq**(): `void`

Defined in: [src/player/Player.ts:804](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L804)

Toggle audio Sudomemo equalizer filter.

#### Returns

`void`

***

### setAudioEq()

> **setAudioEq**(`state`): `void`

Defined in: [src/player/Player.ts:812](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L812)

Turn audio Sudomemo equalizer filter on or off.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `state` | `boolean` |

#### Returns

`void`

***

### mute()

> **mute**(): `void`

Defined in: [src/player/Player.ts:828](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L828)

Turn the audio off

#### Returns

`void`

***

### unmute()

> **unmute**(): `void`

Defined in: [src/player/Player.ts:836](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L836)

Turn the audio on

#### Returns

`void`

***

### setMuted()

> **setMuted**(`isMute`): `void`

Defined in: [src/player/Player.ts:844](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L844)

Turn the audio on or off

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `isMute` | `boolean` |

#### Returns

`void`

***

### getMuted()

> **getMuted**(): `boolean`

Defined in: [src/player/Player.ts:857](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L857)

Get the audio mute state

#### Returns

`boolean`

***

### toggleMuted()

> **toggleMuted**(): `void`

Defined in: [src/player/Player.ts:865](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L865)

Switch the audio between muted and unmuted

#### Returns

`void`

***

### setVolume()

> **setVolume**(`volume`): `void`

Defined in: [src/player/Player.ts:873](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L873)

Set the audio volume

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `volume` | `number` |

#### Returns

`void`

***

### getVolume()

> **getVolume**(): `number`

Defined in: [src/player/Player.ts:884](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L884)

Get the current audio volume

#### Returns

`number`

## Event API

### on()

> **on**(`eventType`, `listener`): `void`

Defined in: [src/player/Player.ts:1117](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L1117)

Add an event callback

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `eventType` | [`PlayerEvent`](/api/enumerations/playerevent/) \| [`PlayerEvent`](/api/enumerations/playerevent/)[] |
| `listener` | [`Function`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) |

#### Returns

`void`

***

### off()

> **off**(`eventType`, `callback`): `void`

Defined in: [src/player/Player.ts:1132](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L1132)

Remove an event callback

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `eventType` | [`PlayerEvent`](/api/enumerations/playerevent/) \| [`PlayerEvent`](/api/enumerations/playerevent/)[] |
| `callback` | [`Function`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) |

#### Returns

`void`

***

### emit()

> **emit**(`eventType`, ...`args`): `void`

Defined in: [src/player/Player.ts:1147](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L1147)

Emit an event - mostly used internally

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `eventType` | [`PlayerEvent`](/api/enumerations/playerevent/) |
| ...`args` | `any` |

#### Returns

`void`

***

### clearEvents()

> **clearEvents**(): `void`

Defined in: [src/player/Player.ts:1169](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L1169)

Remove all registered event callbacks

#### Returns

`void`

## Events

### onplay()

> **onplay**: () => `void`

Defined in: [src/player/Player.ts:961](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L961)

Fired when animation playback begins or is resumed

#### Returns

`void`

***

### onpause()

> **onpause**: () => `void`

Defined in: [src/player/Player.ts:967](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L967)

Fired when animation playback is paused

#### Returns

`void`

***

### onseeking()

> **onseeking**: () => `void`

Defined in: [src/player/Player.ts:985](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L985)

Fired when a seek operation begins

#### Returns

`void`

***

### onseeked()

> **onseeked**: () => `void`

Defined in: [src/player/Player.ts:991](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L991)

Fired when a seek operation completes

#### Returns

`void`

***

### onloop()

> **onloop**: () => `void`

Defined in: [src/player/Player.ts:1003](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L1003)

Fired when playback has looped after reaching the end

#### Returns

`void`

***

### onended()

> **onended**: () => `void`

Defined in: [src/player/Player.ts:1009](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L1009)

Fired when playback has ended

#### Returns

`void`

***

### onvolumechange()

> **onvolumechange**: (`volume`) => `void`

Defined in: [src/player/Player.ts:1015](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L1015)

Fired when the player audio volume or muted state has changed

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `volume` | `number` |

#### Returns

`void`

***

### onprogress()

> **onprogress**: (`progress`) => `void`

Defined in: [src/player/Player.ts:1021](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L1021)

Fired when playback progress has changed

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `progress` | `number` |

#### Returns

`void`

***

### ontimeupdate()

> **ontimeupdate**: (`time`) => `void`

Defined in: [src/player/Player.ts:1027](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L1027)

Fired when the playback time has changed

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `time` | `number` |

#### Returns

`void`

***

### onframeupdate()

> **onframeupdate**: (`frameIndex`) => `void`

Defined in: [src/player/Player.ts:1033](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L1033)

Fired when the current frame index has changed

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `frameIndex` | `number` |

#### Returns

`void`

***

### onframenext()

> **onframenext**: () => `void`

Defined in: [src/player/Player.ts:1039](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L1039)

Fired when [nextFrame](../../../../../../api/classes/player/#nextframe) has been called

#### Returns

`void`

***

### onframeprev()

> **onframeprev**: () => `void`

Defined in: [src/player/Player.ts:1045](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L1045)

Fired when [prevFrame](../../../../../../api/classes/player/#prevframe) has been called

#### Returns

`void`

***

### onframefirst()

> **onframefirst**: () => `void`

Defined in: [src/player/Player.ts:1051](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L1051)

Fired when [firstFrame](../../../../../../api/classes/player/#firstframe) has been called

#### Returns

`void`

***

### onframelast()

> **onframelast**: () => `void`

Defined in: [src/player/Player.ts:1057](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L1057)

Fired when [lastFrame](../../../../../../api/classes/player/#lastframe) has been called

#### Returns

`void`

***

### onready()

> **onready**: () => `void`

Defined in: [src/player/Player.ts:1063](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L1063)

Fired when a Flipnote is ready for playback

#### Returns

`void`

***

### onload()

> **onload**: () => `void`

Defined in: [src/player/Player.ts:1069](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L1069)

Fired when a Flipnote has finished loading

#### Returns

`void`

***

### onloadstart()

> **onloadstart**: () => `void`

Defined in: [src/player/Player.ts:1075](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L1075)

Fired when a Flipnote has begun loading

#### Returns

`void`

***

### onclose()

> **onclose**: () => `void`

Defined in: [src/player/Player.ts:1099](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L1099)

Fired after the Flipnote has been closed with close

#### Returns

`void`

***

### onerror()

> **onerror**: (`err`?) => `void`

Defined in: [src/player/Player.ts:1105](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L1105)

Fired after a loading, parsing or playback error occurs

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `err`? | [`Error`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error) |

#### Returns

`void`

***

### ondestroy()

> **ondestroy**: () => `void`

Defined in: [src/player/Player.ts:1111](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L1111)

Fired just before the player has been destroyed, after calling [destroy](../../../../../../api/classes/player/#destroy)

#### Returns

`void`

## HTMLVideoElement compatibility

### oncanplay()

> **oncanplay**: () => `void`

Defined in: [src/player/Player.ts:973](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L973)

Fired when the Flipnote has loaded enough to begin animation play

#### Returns

`void`

***

### oncanplaythrough()

> **oncanplaythrough**: () => `void`

Defined in: [src/player/Player.ts:979](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L979)

Fired when the Flipnote has loaded enough to play successfully

#### Returns

`void`

***

### ondurationchange()

> **ondurationchange**: () => `void`

Defined in: [src/player/Player.ts:997](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L997)

Fired when the animation duration has changed

#### Returns

`void`

***

### onloadeddata()

> **onloadeddata**: () => `void`

Defined in: [src/player/Player.ts:1081](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L1081)

Fired when the Flipnote data has been loaded; implementation of the `HTMLMediaElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event](loadeddata) event.

#### Returns

`void`

***

### onloadedmetadata()

> **onloadedmetadata**: () => `void`

Defined in: [src/player/Player.ts:1087](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L1087)

Fired when the Flipnote metadata has been loaded; implementation of the `HTMLMediaElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event](loadedmetadata) event.

#### Returns

`void`

***

### onemptied()

> **onemptied**: () => `void`

Defined in: [src/player/Player.ts:1093](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L1093)

Fired when the media has become empty; implementation of the `HTMLMediaElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event](emptied) event.

#### Returns

`void`

***

### buffered

#### Get Signature

> **get** **buffered**(): [`TimeRanges`](https://developer.mozilla.org/docs/Web/API/TimeRanges)

Defined in: [src/player/Player.ts:307](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L307)

Implementation of the `HTMLMediaElement` [buffered](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/buffered) property.

##### Returns

[`TimeRanges`](https://developer.mozilla.org/docs/Web/API/TimeRanges)

***

### seekable

#### Get Signature

> **get** **seekable**(): [`TimeRanges`](https://developer.mozilla.org/docs/Web/API/TimeRanges)

Defined in: [src/player/Player.ts:315](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L315)

Implementation of the `HTMLMediaElement` [seekable](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seekable) property

##### Returns

[`TimeRanges`](https://developer.mozilla.org/docs/Web/API/TimeRanges)

***

### currentSrc

#### Get Signature

> **get** **currentSrc**(): `any`

Defined in: [src/player/Player.ts:323](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L323)

Implementation of the `HTMLMediaElement` [currentSrc](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentSrc) property

##### Returns

`any`

***

### videoWidth

#### Get Signature

> **get** **videoWidth**(): `number`

Defined in: [src/player/Player.ts:331](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L331)

Implementation of the `HTMLVideoElement` [videoWidth](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/videoWidth) property

##### Returns

`number`

***

### videoHeight

#### Get Signature

> **get** **videoHeight**(): `number`

Defined in: [src/player/Player.ts:339](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L339)

Implementation of the `HTMLVideoElement` [videoHeight](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/videoHeight) property

##### Returns

`number`

***

### seekToNextFrame()

> **seekToNextFrame**(): `void`

Defined in: [src/player/Player.ts:892](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L892)

Implementation of the `HTMLVideoElement` [seekToNextFrame](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/seekToNextFrame) method

#### Returns

`void`

***

### fastSeek()

> **fastSeek**(`time`): `void`

Defined in: [src/player/Player.ts:900](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L900)

Implementation of the `HTMLMediaElement` [fastSeek](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/fastSeek) method

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `time` | `number` |

#### Returns

`void`

***

### canPlayType()

> **canPlayType**(`mediaType`): `""` \| `"probably"` \| `"maybe"`

Defined in: [src/player/Player.ts:908](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L908)

Implementation of the `HTMLVideoElement` [getVideoPlaybackQuality](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/getVideoPlaybackQuality) method

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `mediaType` | `string` |

#### Returns

`""` \| `"probably"` \| `"maybe"`

***

### getVideoPlaybackQuality()

> **getVideoPlaybackQuality**(): [`VideoPlaybackQuality`](https://developer.mozilla.org/docs/Web/API/VideoPlaybackQuality)

Defined in: [src/player/Player.ts:929](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L929)

Implementation of the `HTMLVideoElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/getVideoPlaybackQuality](getVideoPlaybackQuality) method

#### Returns

[`VideoPlaybackQuality`](https://developer.mozilla.org/docs/Web/API/VideoPlaybackQuality)

***

### requestPictureInPicture()

> **requestPictureInPicture**(): `void`

Defined in: [src/player/Player.ts:944](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L944)

Implementation of the `HTMLVideoElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestPictureInPicture](requestPictureInPicture) method. Not currently working, only a stub.

#### Returns

`void`

***

### captureStream()

> **captureStream**(): `void`

Defined in: [src/player/Player.ts:952](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/player/Player.ts#L952)

Implementation of the `HTMLVideoElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/captureStream](captureStream) method. Not currently working, only a stub.

#### Returns

`void`
