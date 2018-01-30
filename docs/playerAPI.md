## Constructor

**Arguments:**

* `{String | HTMLCanvasElement} canvas`

* `{Number} width`

* `{Number} height`

**See also:** The [Getting Started](https://github.com/jaames/flipnote.js/blob/master/docs/getStarted.md) guide.

## Properties

### currentFrame

**Details:**

Index of the current frame being shown (starts at 0). This property can be set to a new value to jump the player to a different frame.

### currentTime

**Details:**

Current playback prosition in seconds, modelled after the [HTMLMediaElement property of the same name](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime). This property can be set to a new value to jump the player to a different time.

### loop

**Details:**

If `true`, the player will loop the Flipnote back to the start when it reaches the end.

### meta

**Details:**

An object containing details about the Flipnote, such as the author, timestamp, etc. TODO: document this

### duration

**Read-Only**

**Details:**

Duration of the Flipnote in seconds.

### frameCount

**Read-Only**

**Details:**

Total number of frames in the Flipnote.

### frameSpeed

**Read-Only**

**Details:**

Flipnote Studio speed setting, as shown in the app. Values are documented [here](http://flipnote.wikia.com/wiki/Flipnote_Speed).

### framerate

**Read-Only**

**Details:**

Flipnote framerate in frames-per-second.

## Methods

### play

**Details:**

Begin Flipnote playback.

### pause

**Details:**

Pause Flipnote playback.

### on

**Arguments:**

* `{String} eventType`
* `{Function} callback`

**Details:**

Register an event callback. TODO: document events

### off

**Arguments:**

* `{String} eventType`
* `{Function} callback`

**Details:**

Remove an event callback that was registered with [`on`](#on)

### setFrame

**Arguments:**

* `{Number} index - zero-based frame index`

**Details:**

Jump to a specified frame in the Flipnote.

### nextFrame

**Details:**

Jump to the next frame in the Flipnote. If `loop` is `true` and the Flipnote is on its last frame, it will jump to the first frame.

### prevFrame

**Details:**

Jump to the previous frame in the Flipnote. If `loop` is `true` and the Flipnote is on its first frame, it will jump to the last frame.

### firstFrame

**Details:**

Jump to the first frame in the Flipnote.

### lastFrame

**Details:**

Jump to the last frame in the Flipnote.

### thumbFrame

**Details:**

Jump to the frame being used as the Flipnote's thumbnail.

### resize

**Arguments:**

* `{Number} width - new player width in pixels`
* `{Number} height - new player height in pixels`

**Details:**

Resize the player canvas.