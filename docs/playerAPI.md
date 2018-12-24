## Constructor

**Arguments:**

* `{String | HTMLCanvasElement} canvas`

* `{Number} width`

* `{Number} height`

**See also:** The [Getting Started](https://github.com/jaames/flipnote.js/blob/master/docs/getStarted.md) guide.

## Properties

### currentFrame

Get/set the index of the current frame being shown. When set to a new value the player will automatically jump to that frame.

### currentTime

Get/set the current playback prosition in seconds, modelled after the [HTMLMediaElement property of the same name](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime). When set to a new value the player will automatically jump to that time.

### duration

Get the Flipnote duration in seconds.

### framerate

Get the Flipnote framerate as frames per second.

### loop

If set to `true`, the player will loop the Flipnote back to the start when it reaches the end.

### volume

Get/set the Flipnote audio volume. This should be a value between 0 and 1.

### mute

If set to `true`, audio will be muted.

### meta

An object containing details about the Flipnote, such as the author, timestamp, etc. TODO: document this

## Methods

### play

Begin Flipnote playback.

### pause

Pause Flipnote playback.

### on

Register an event callback. See [Events](#Events) for all event types.

**Arguments:**

* `{String} eventType`
* `{Function} callback`

**Example:**

```js
player.on("playback:start", function() {
  // do something...
})
```

### off

Remove an event callback that was registered with [`on`](#on)

**Arguments:**

* `{String} eventType`
* `{Function} callback`

### setFrame

Jump to a specified frame in the Flipnote.

**Arguments:**

* `{Number} index - zero-based frame index`

### nextFrame

Jump to the next frame in the Flipnote. If `loop` is `true` and the Flipnote is on its last frame, it will jump to the first frame.

### prevFrame

Jump to the previous frame in the Flipnote. If `loop` is `true` and the Flipnote is on its first frame, it will jump to the last frame.

### firstFrame

Jump to the first frame in the Flipnote.

### lastFrame

Jump to the last frame in the Flipnote.

### thumbnailFrame

Jump to the frame being used as the Flipnote's thumbnail.

### setSmoothRendering

Enable/disable frame smoothing.

**Arguments:**

* `{Boolean} isSmooth`

### setLayerVisibility

Enable/disable layer visibility.

**Arguments**

* `{Number} layer` - Layer (either 1, 2, or 3)
* `{Boolean} isVisible` - Set to `false` to hide layer

### resize

Resize the player canvas.

**Arguments:**

* `{Number} width` - New player width in pixels
* `{Number} height` - New player height in pixels

### getFrameImage

Render a specifc frame to an image -- returns an image data string.

**Arguments:**

* `{Number | String} index` - Zero-based frame index, or pass "thumb" to get the thumbnail frame
* `{String} type` - Image MIME type, default is `image/png`
* `{Number} encoderOptions` - Number between 0 and 1 indicating image quality if type is image/jpeg or image/webp

### forceUpdate

Force the player to refresh.

## Events

### load

Emitted when the player has finished loading a KWZ / PPM file.

### frame:update

Emitted whenever the current frame changes.

### playback:start

Emitted whenever playback begins.

### playback:stop

Emitted whenever playback is paused/stopped.

### playback:end

Emitted whenever the Flipnote playback has finished (and loop=false).

### playback:loop

Emitted whenever the Flipnote is about to enter another playback loop (and loop=true).
