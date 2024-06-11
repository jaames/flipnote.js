---
editUrl: false
next: false
prev: false
title: "Player"
---

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

Use the [on](../../../../../../../api/classes/player/#on) method to register event listeners:

```js
 player.on('play', function() {
   // do something when the Flipnote starts playing...
 });
```

## Constructors

### new Player()

> **new Player**(`parent`, `width`, `height`, `parserSettings`): [`Player`](/api/classes/player/)

Create a new Player instance

#### Parameters

• **parent**: `string` \| [`Element ↗️`]( https://developer.mozilla.org/docs/Web/API/Element )

Element to mount the rendering canvas to

• **width**: `number`

Canvas width (pixels)

• **height**: `number`

Canvas height (pixels)

The ratio between `width` and `height` should be 3:4 for best results

• **parserSettings**: [`Partial ↗️`]( https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype )\<[`KwzParserSettings`](/api/type-aliases/kwzparsersettings/)\>= `{}`

#### Returns

[`Player`](/api/classes/player/)

#### Source

[src/player/Player.ts:171](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L171)

## Properties

### el

> **el**: [`Element ↗️`]( https://developer.mozilla.org/docs/Web/API/Element )

Root element

#### Source

[src/player/Player.ts:57](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L57)

***

### note

> **note**: `BaseParser`

Currently loaded Flipnote

#### Source

[src/player/Player.ts:61](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L61)

***

### parserSettings

> **parserSettings**: [`Partial ↗️`]( https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype )\<[`KwzParserSettings`](/api/type-aliases/kwzparsersettings/)\>

Flipnote parser settings

#### Source

[src/player/Player.ts:65](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L65)

***

### noteFormat

> **noteFormat**: [`FlipnoteFormat`](/api/enumerations/flipnoteformat/)

Format of the currently loaded Flipnote

#### Source

[src/player/Player.ts:69](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L69)

***

### meta

> **meta**: [`FlipnoteMeta`](/api/interfaces/flipnotemeta/)

Metadata for the currently loaded Flipnote

#### Source

[src/player/Player.ts:73](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L73)

***

### duration

> **duration**: `number` = `0`

Animation duration, in seconds

#### Source

[src/player/Player.ts:77](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L77)

***

### layerVisibility

> **layerVisibility**: `PlayerLayerVisibility`

Animation layer visibility

#### Source

[src/player/Player.ts:81](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L81)

***

### autoplay

> **autoplay**: `boolean` = `false`

Automatically begin playback after a Flipnote is loaded

#### Source

[src/player/Player.ts:85](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L85)

***

### supportedEvents

> **supportedEvents**: [`PlayerEvent`](/api/enumerations/playerevent/)[]

Array of events supported by this player

#### Source

[src/player/Player.ts:89](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L89)

## Lifecycle

### src

> `get` **src**(): `any`

The currently loaded Flipnote source, if there is one

:::caution[Deprecated]
This API is no longer supported and may be removed in a future release.
:::

> `set` **src**(`source`): `void`

#### Parameters

• **source**: `any`

#### Returns

`any`

#### Source

[src/player/Player.ts:189](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L189)

***

### load()

> **load**(`source`): [`Promise ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<`void`\>

Open a Flipnote from a source

#### Parameters

• **source**: `any`

#### Returns

[`Promise ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<`void`\>

#### Source

[src/player/Player.ts:347](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L347)

***

### reload()

> **reload**(): [`Promise ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<`void`\>

Reload the current Flipnote.

#### Returns

[`Promise ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<`void`\>

#### Source

[src/player/Player.ts:373](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L373)

***

### updateSettings()

> **updateSettings**(`settings`): [`Promise ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<`void`\>

Reload the current Flipnote, applying new parser settings.

#### Parameters

• **settings**: [`Partial ↗️`]( https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype )\<[`KwzParserSettings`](/api/type-aliases/kwzparsersettings/)\>

#### Returns

[`Promise ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<`void`\>

#### Source

[src/player/Player.ts:382](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L382)

***

### closeNote()

> **closeNote**(): `void`

Close the currently loaded Flipnote

#### Returns

`void`

#### Source

[src/player/Player.ts:391](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L391)

***

### openNote()

> **openNote**(`note`): `void`

Open a Flipnote into the player

#### Parameters

• **note**: `BaseParser`

#### Returns

`void`

#### Source

[src/player/Player.ts:413](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L413)

***

### destroy()

> **destroy**(): [`Promise ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<`void`\>

Destroy a Player instance

#### Returns

[`Promise ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<`void`\>

#### Source

[src/player/Player.ts:1179](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L1179)

## Playback Control

### paused

> `get` **paused**(): `boolean`

Indicates whether playback is currently paused

> `set` **paused**(`isPaused`): `void`

#### Parameters

• **isPaused**: `boolean`

#### Returns

`boolean`

#### Source

[src/player/Player.ts:200](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L200)

***

### currentFrame

> `get` **currentFrame**(): `number`

Current animation frame index.

> `set` **currentFrame**(`frameIndex`): `void`

#### Parameters

• **frameIndex**: `number`

#### Returns

`number`

#### Source

[src/player/Player.ts:214](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L214)

***

### currentTime

> `get` **currentTime**(): `number`

Current animation playback position, in seconds.

> `set` **currentTime**(`value`): `void`

#### Parameters

• **value**: `number`

#### Returns

`number`

#### Source

[src/player/Player.ts:225](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L225)

***

### progress

> `get` **progress**(): `number`

Current animation playback progress, as a percentage out of 100.

> `set` **progress**(`value`): `void`

#### Parameters

• **value**: `number`

#### Returns

`number`

#### Source

[src/player/Player.ts:236](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L236)

***

### loop

> `get` **loop**(): `boolean`

Indicates whether playback should loop once the end is reached

> `set` **loop**(`value`): `void`

#### Parameters

• **value**: `boolean`

#### Returns

`boolean`

#### Source

[src/player/Player.ts:271](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L271)

***

### framerate

> `get` **framerate**(): `number`

Animation frame rate, measured in frames per second.

#### Returns

`number`

#### Source

[src/player/Player.ts:283](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L283)

***

### setCurrentTime()

> **setCurrentTime**(`value`): `void`

Set the current playback time

#### Parameters

• **value**: `number`

#### Returns

`void`

#### Source

[src/player/Player.ts:478](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L478)

***

### getCurrentTime()

> **getCurrentTime**(): `number`

Get the current playback time

#### Returns

`number`

#### Source

[src/player/Player.ts:490](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L490)

***

### getTimeCounter()

> **getTimeCounter**(): `string`

Get the current time as a counter string, like `"0:00 / 1:00"`

#### Returns

`string`

#### Source

[src/player/Player.ts:498](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L498)

***

### getFrameCounter()

> **getFrameCounter**(): `string`

Get the current frame index as a counter string, like `"001 / 999"`

#### Returns

`string`

#### Source

[src/player/Player.ts:508](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L508)

***

### setProgress()

> **setProgress**(`value`): `void`

Set the current playback progress as a percentage (`0` to `100`)

#### Parameters

• **value**: `number`

#### Returns

`void`

#### Source

[src/player/Player.ts:518](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L518)

***

### getProgress()

> **getProgress**(): `number`

Get the current playback progress as a percentage (0 to 100)

#### Returns

`number`

#### Source

[src/player/Player.ts:528](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L528)

***

### play()

> **play**(): [`Promise ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<`void`\>

Begin animation playback starting at the current position

#### Returns

[`Promise ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<`void`\>

#### Source

[src/player/Player.ts:536](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L536)

***

### pause()

> **pause**(): `void`

Pause animation playback at the current position

#### Returns

`void`

#### Source

[src/player/Player.ts:558](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L558)

***

### togglePlay()

> **togglePlay**(): `void`

Resumes animation playback if paused, otherwise pauses

#### Returns

`void`

#### Source

[src/player/Player.ts:572](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L572)

***

### getPaused()

> **getPaused**(): `boolean`

Determines if playback is currently paused

#### Returns

`boolean`

#### Source

[src/player/Player.ts:583](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L583)

***

### getDuration()

> **getDuration**(): `number`

Get the duration of the Flipnote in seconds

#### Returns

`number`

#### Source

[src/player/Player.ts:591](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L591)

***

### getLoop()

> **getLoop**(): `boolean`

Determines if playback is looped

#### Returns

`boolean`

#### Source

[src/player/Player.ts:599](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L599)

***

### setLoop()

> **setLoop**(`loop`): `void`

Set the playback loop

#### Parameters

• **loop**: `boolean`

#### Returns

`void`

#### Source

[src/player/Player.ts:607](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L607)

***

### toggleLoop()

> **toggleLoop**(): `void`

Switch the playback loop between on and off

#### Returns

`void`

#### Source

[src/player/Player.ts:616](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L616)

***

### startSeek()

> **startSeek**(): `void`

Begins a seek operation

#### Returns

`void`

#### Source

[src/player/Player.ts:697](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L697)

***

### seek()

> **seek**(`position`): `void`

Seek the playback progress to a different position

#### Parameters

• **position**: `number`

animation playback position, range `0` to `1`

#### Returns

`void`

#### Source

[src/player/Player.ts:711](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L711)

***

### endSeek()

> **endSeek**(): `void`

Ends a seek operation

#### Returns

`void`

#### Source

[src/player/Player.ts:720](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L720)

## Frame Control

### frameCount

> `get` **frameCount**(): `number`

Animation frame count.

#### Returns

`number`

#### Source

[src/player/Player.ts:291](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L291)

***

### frameSpeed

> `get` **frameSpeed**(): `number`

Animation frame speed.

#### Returns

`number`

#### Source

[src/player/Player.ts:299](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L299)

***

### setCurrentFrame()

> **setCurrentFrame**(`newFrameValue`): `void`

Jump to a given animation frame

#### Parameters

• **newFrameValue**: `number`

#### Returns

`void`

#### Source

[src/player/Player.ts:624](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L624)

***

### nextFrame()

> **nextFrame**(): `void`

Jump to the next animation frame
If the animation loops, and is currently on its last frame, it will wrap to the first frame

#### Returns

`void`

#### Source

[src/player/Player.ts:646](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L646)

***

### prevFrame()

> **prevFrame**(): `void`

Jump to the next animation frame
If the animation loops, and is currently on its first frame, it will wrap to the last frame

#### Returns

`void`

#### Source

[src/player/Player.ts:659](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L659)

***

### lastFrame()

> **lastFrame**(): `void`

Jump to the last animation frame

#### Returns

`void`

#### Source

[src/player/Player.ts:671](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L671)

***

### firstFrame()

> **firstFrame**(): `void`

Jump to the first animation frame

#### Returns

`void`

#### Source

[src/player/Player.ts:680](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L680)

***

### thumbnailFrame()

> **thumbnailFrame**(): `void`

Jump to the thumbnail frame

#### Returns

`void`

#### Source

[src/player/Player.ts:689](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L689)

## Display Control

### renderer

> **renderer**: [`UniversalCanvas`](/api/classes/universalcanvas/)

Flipnote renderer.

#### Source

[src/player/Player.ts:53](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L53)

***

### drawFrame()

> **drawFrame**(`frameIndex`): `void`

Draws the specified animation frame to the canvas. Note that this doesn't update the playback time or anything, it simply decodes a given frame and displays it.

#### Parameters

• **frameIndex**: `number`

#### Returns

`void`

#### Source

[src/player/Player.ts:732](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L732)

***

### forceUpdate()

> **forceUpdate**(): `void`

Forces the current animation frame to be redrawn

#### Returns

`void`

#### Source

[src/player/Player.ts:740](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L740)

***

### resize()

> **resize**(`width`, `height`): `void`

Resize the playback canvas to a new size

#### Parameters

• **width**: `number`

new canvas width (pixels)

• **height**: `number`

new canvas height (pixels)

The ratio between `width` and `height` should be 3:4 for best results

#### Returns

`void`

#### Source

[src/player/Player.ts:753](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L753)

***

### setLayerVisibility()

> **setLayerVisibility**(`layer`, `value`): `void`

Sets whether an animation layer should be visible throughout the entire animation

#### Parameters

• **layer**: `number`

layer index, starting at 1

• **value**: `boolean`

`true` for visible, `false` for invisible

#### Returns

`void`

#### Source

[src/player/Player.ts:767](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L767)

***

### getLayerVisibility()

> **getLayerVisibility**(`layer`): `boolean`

Returns the visibility state for a given layer

#### Parameters

• **layer**: `number`

layer index, starting at 1

#### Returns

`boolean`

#### Source

[src/player/Player.ts:779](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L779)

***

### toggleLayerVisibility()

> **toggleLayerVisibility**(`layerIndex`): `void`

Toggles whether an animation layer should be visible throughout the entire animation

#### Parameters

• **layerIndex**: `number`

#### Returns

`void`

#### Source

[src/player/Player.ts:788](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L788)

## Audio Control

### volume

> `get` **volume**(): `number`

Audio volume, range `0` to `1`.

> `set` **volume**(`value`): `void`

#### Parameters

• **value**: `number`

#### Returns

`number`

#### Source

[src/player/Player.ts:247](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L247)

***

### muted

> `get` **muted**(): `boolean`

Audio mute state.

> `set` **muted**(`value`): `void`

#### Parameters

• **value**: `boolean`

#### Returns

`boolean`

#### Source

[src/player/Player.ts:259](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L259)

***

### toggleAudioEq()

> **toggleAudioEq**(): `void`

Toggle audio Sudomemo equalizer filter.

#### Returns

`void`

#### Source

[src/player/Player.ts:804](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L804)

***

### setAudioEq()

> **setAudioEq**(`state`): `void`

Turn audio Sudomemo equalizer filter on or off.

#### Parameters

• **state**: `boolean`

#### Returns

`void`

#### Source

[src/player/Player.ts:812](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L812)

***

### mute()

> **mute**(): `void`

Turn the audio off

#### Returns

`void`

#### Source

[src/player/Player.ts:828](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L828)

***

### unmute()

> **unmute**(): `void`

Turn the audio on

#### Returns

`void`

#### Source

[src/player/Player.ts:836](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L836)

***

### setMuted()

> **setMuted**(`isMute`): `void`

Turn the audio on or off

#### Parameters

• **isMute**: `boolean`

#### Returns

`void`

#### Source

[src/player/Player.ts:844](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L844)

***

### getMuted()

> **getMuted**(): `boolean`

Get the audio mute state

#### Returns

`boolean`

#### Source

[src/player/Player.ts:857](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L857)

***

### toggleMuted()

> **toggleMuted**(): `void`

Switch the audio between muted and unmuted

#### Returns

`void`

#### Source

[src/player/Player.ts:865](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L865)

***

### setVolume()

> **setVolume**(`volume`): `void`

Set the audio volume

#### Parameters

• **volume**: `number`

#### Returns

`void`

#### Source

[src/player/Player.ts:873](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L873)

***

### getVolume()

> **getVolume**(): `number`

Get the current audio volume

#### Returns

`number`

#### Source

[src/player/Player.ts:884](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L884)

## Event API

### on()

> **on**(`eventType`, `listener`): `void`

Add an event callback

#### Parameters

• **eventType**: [`PlayerEvent`](/api/enumerations/playerevent/) \| [`PlayerEvent`](/api/enumerations/playerevent/)[]

• **listener**: [`Function ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function )

#### Returns

`void`

#### Source

[src/player/Player.ts:1119](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L1119)

***

### off()

> **off**(`eventType`, `callback`): `void`

Remove an event callback

#### Parameters

• **eventType**: [`PlayerEvent`](/api/enumerations/playerevent/) \| [`PlayerEvent`](/api/enumerations/playerevent/)[]

• **callback**: [`Function ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function )

#### Returns

`void`

#### Source

[src/player/Player.ts:1134](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L1134)

***

### emit()

> **emit**(`eventType`, ...`args`): `void`

Emit an event - mostly used internally

#### Parameters

• **eventType**: [`PlayerEvent`](/api/enumerations/playerevent/)

• ...**args**: `any`

#### Returns

`void`

#### Source

[src/player/Player.ts:1149](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L1149)

***

### clearEvents()

> **clearEvents**(): `void`

Remove all registered event callbacks

#### Returns

`void`

#### Source

[src/player/Player.ts:1171](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L1171)

## Events

### onplay()

> **onplay**: () => `void`

Fired when animation playback begins or is resumed

#### Returns

`void`

#### Source

[src/player/Player.ts:963](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L963)

***

### onpause()

> **onpause**: () => `void`

Fired when animation playback is paused

#### Returns

`void`

#### Source

[src/player/Player.ts:969](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L969)

***

### onseeking()

> **onseeking**: () => `void`

Fired when a seek operation begins

#### Returns

`void`

#### Source

[src/player/Player.ts:987](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L987)

***

### onseeked()

> **onseeked**: () => `void`

Fired when a seek operation completes

#### Returns

`void`

#### Source

[src/player/Player.ts:993](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L993)

***

### onloop()

> **onloop**: () => `void`

Fired when playback has looped after reaching the end

#### Returns

`void`

#### Source

[src/player/Player.ts:1005](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L1005)

***

### onended()

> **onended**: () => `void`

Fired when playback has ended

#### Returns

`void`

#### Source

[src/player/Player.ts:1011](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L1011)

***

### onvolumechange()

> **onvolumechange**: (`volume`) => `void`

Fired when the player audio volume or muted state has changed

#### Parameters

• **volume**: `number`

#### Returns

`void`

#### Source

[src/player/Player.ts:1017](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L1017)

***

### onprogress()

> **onprogress**: (`progress`) => `void`

Fired when playback progress has changed

#### Parameters

• **progress**: `number`

#### Returns

`void`

#### Source

[src/player/Player.ts:1023](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L1023)

***

### ontimeupdate()

> **ontimeupdate**: (`time`) => `void`

Fired when the playback time has changed

#### Parameters

• **time**: `number`

#### Returns

`void`

#### Source

[src/player/Player.ts:1029](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L1029)

***

### onframeupdate()

> **onframeupdate**: (`frameIndex`) => `void`

Fired when the current frame index has changed

#### Parameters

• **frameIndex**: `number`

#### Returns

`void`

#### Source

[src/player/Player.ts:1035](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L1035)

***

### onframenext()

> **onframenext**: () => `void`

Fired when [nextFrame](../../../../../../../api/classes/player/#nextframe) has been called

#### Returns

`void`

#### Source

[src/player/Player.ts:1041](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L1041)

***

### onframeprev()

> **onframeprev**: () => `void`

Fired when [prevFrame](../../../../../../../api/classes/player/#prevframe) has been called

#### Returns

`void`

#### Source

[src/player/Player.ts:1047](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L1047)

***

### onframefirst()

> **onframefirst**: () => `void`

Fired when [firstFrame](../../../../../../../api/classes/player/#firstframe) has been called

#### Returns

`void`

#### Source

[src/player/Player.ts:1053](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L1053)

***

### onframelast()

> **onframelast**: () => `void`

Fired when [lastFrame](../../../../../../../api/classes/player/#lastframe) has been called

#### Returns

`void`

#### Source

[src/player/Player.ts:1059](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L1059)

***

### onready()

> **onready**: () => `void`

Fired when a Flipnote is ready for playback

#### Returns

`void`

#### Source

[src/player/Player.ts:1065](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L1065)

***

### onload()

> **onload**: () => `void`

Fired when a Flipnote has finished loading

#### Returns

`void`

#### Source

[src/player/Player.ts:1071](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L1071)

***

### onloadstart()

> **onloadstart**: () => `void`

Fired when a Flipnote has begun loading

#### Returns

`void`

#### Source

[src/player/Player.ts:1077](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L1077)

***

### onclose()

> **onclose**: () => `void`

Fired after the Flipnote has been closed with close

#### Returns

`void`

#### Source

[src/player/Player.ts:1101](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L1101)

***

### onerror()

> **onerror**: (`err`?) => `void`

Fired after a loading, parsing or playback error occurs

#### Parameters

• **err?**: [`Error ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error )

#### Returns

`void`

#### Source

[src/player/Player.ts:1107](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L1107)

***

### ondestroy()

> **ondestroy**: () => `void`

Fired just before the player has been destroyed, after calling [destroy](../../../../../../../api/classes/player/#destroy)

#### Returns

`void`

#### Source

[src/player/Player.ts:1113](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L1113)

## HTMLVideoElement compatibility

### oncanplay()

> **oncanplay**: () => `void`

Fired when the Flipnote has loaded enough to begin animation play

#### Returns

`void`

#### Source

[src/player/Player.ts:975](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L975)

***

### oncanplaythrough()

> **oncanplaythrough**: () => `void`

Fired when the Flipnote has loaded enough to play successfully

#### Returns

`void`

#### Source

[src/player/Player.ts:981](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L981)

***

### ondurationchange()

> **ondurationchange**: () => `void`

Fired when the animation duration has changed

#### Returns

`void`

#### Source

[src/player/Player.ts:999](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L999)

***

### onloadeddata()

> **onloadeddata**: () => `void`

Fired when the Flipnote data has been loaded; implementation of the `HTMLMediaElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event](loadeddata) event.

#### Returns

`void`

#### Source

[src/player/Player.ts:1083](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L1083)

***

### onloadedmetadata()

> **onloadedmetadata**: () => `void`

Fired when the Flipnote metadata has been loaded; implementation of the `HTMLMediaElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event](loadedmetadata) event.

#### Returns

`void`

#### Source

[src/player/Player.ts:1089](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L1089)

***

### onemptied()

> **onemptied**: () => `void`

Fired when the media has become empty; implementation of the `HTMLMediaElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event](emptied) event.

#### Returns

`void`

#### Source

[src/player/Player.ts:1095](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L1095)

***

### buffered

> `get` **buffered**(): [`TimeRanges ↗️`]( https://developer.mozilla.org/docs/Web/API/TimeRanges )

Implementation of the `HTMLMediaElement` [buffered](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/buffered) property.

#### Returns

[`TimeRanges ↗️`]( https://developer.mozilla.org/docs/Web/API/TimeRanges )

#### Source

[src/player/Player.ts:307](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L307)

***

### seekable

> `get` **seekable**(): [`TimeRanges ↗️`]( https://developer.mozilla.org/docs/Web/API/TimeRanges )

Implementation of the `HTMLMediaElement` [seekable](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seekable) property

#### Returns

[`TimeRanges ↗️`]( https://developer.mozilla.org/docs/Web/API/TimeRanges )

#### Source

[src/player/Player.ts:315](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L315)

***

### currentSrc

> `get` **currentSrc**(): `any`

Implementation of the `HTMLMediaElement` [currentSrc](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentSrc) property

#### Returns

`any`

#### Source

[src/player/Player.ts:323](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L323)

***

### videoWidth

> `get` **videoWidth**(): `number`

Implementation of the `HTMLVideoElement` [videoWidth](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/videoWidth) property

#### Returns

`number`

#### Source

[src/player/Player.ts:331](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L331)

***

### videoHeight

> `get` **videoHeight**(): `number`

Implementation of the `HTMLVideoElement` [videoHeight](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/videoHeight) property

#### Returns

`number`

#### Source

[src/player/Player.ts:339](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L339)

***

### seekToNextFrame()

> **seekToNextFrame**(): `void`

Implementation of the `HTMLVideoElement` [seekToNextFrame](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/seekToNextFrame) method

#### Returns

`void`

#### Source

[src/player/Player.ts:892](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L892)

***

### fastSeek()

> **fastSeek**(`time`): `void`

Implementation of the `HTMLMediaElement` [fastSeek](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/fastSeek) method

#### Parameters

• **time**: `number`

#### Returns

`void`

#### Source

[src/player/Player.ts:900](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L900)

***

### canPlayType()

> **canPlayType**(`mediaType`): `""` \| `"probably"` \| `"maybe"`

Implementation of the `HTMLVideoElement` [getVideoPlaybackQuality](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/getVideoPlaybackQuality) method

#### Parameters

• **mediaType**: `string`

#### Returns

`""` \| `"probably"` \| `"maybe"`

#### Source

[src/player/Player.ts:908](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L908)

***

### getVideoPlaybackQuality()

> **getVideoPlaybackQuality**(): [`VideoPlaybackQuality ↗️`]( https://developer.mozilla.org/docs/Web/API/VideoPlaybackQuality )

Implementation of the `HTMLVideoElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/getVideoPlaybackQuality](getVideoPlaybackQuality) method

#### Returns

[`VideoPlaybackQuality ↗️`]( https://developer.mozilla.org/docs/Web/API/VideoPlaybackQuality )

#### Source

[src/player/Player.ts:931](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L931)

***

### requestPictureInPicture()

> **requestPictureInPicture**(): `void`

Implementation of the `HTMLVideoElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestPictureInPicture](requestPictureInPicture) method. Not currently working, only a stub.

#### Returns

`void`

#### Source

[src/player/Player.ts:946](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L946)

***

### captureStream()

> **captureStream**(): `void`

Implementation of the `HTMLVideoElement` [https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/captureStream](captureStream) method. Not currently working, only a stub.

#### Returns

`void`

#### Source

[src/player/Player.ts:954](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/player/Player.ts#L954)
