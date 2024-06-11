---
editUrl: false
next: false
prev: false
title: "WebglCanvas"
---

Flipnote renderer for the [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) API.

Only available in browser contexts.

## Implements

- `CanvasInterface`

## Constructors

### new WebglCanvas()

> **new WebglCanvas**(`parent`, `width`, `height`, `options`): [`WebglCanvas`](/api/classes/webglcanvas/)

Creates a new WebGlCanvas instance

#### Parameters

• **parent**: [`Element ↗️`]( https://developer.mozilla.org/docs/Web/API/Element )

• **width**: `number`= `640`

Canvas width in CSS pixels

• **height**: `number`= `480`

Canvas height in CSS pixels

The ratio between `width` and `height` should be 3:4 for best results

• **options**: [`Partial ↗️`]( https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype )\<[`WebglCanvasOptions`](/api/interfaces/webglcanvasoptions/)\>= `{}`

#### Returns

[`WebglCanvas`](/api/classes/webglcanvas/)

#### Source

[src/renderers/WebGlCanvas.ts:184](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/WebGlCanvas.ts#L184)

## Properties

### defaultOptions

> `static` **defaultOptions**: [`WebglCanvasOptions`](/api/interfaces/webglcanvasoptions/)

#### Source

[src/renderers/WebGlCanvas.ts:69](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/WebGlCanvas.ts#L69)

***

### note

> **note**: `BaseParser`

Flipnote parser object for the Flipnote being played.

#### Implementation of

`CanvasInterface.note`

#### Source

[src/renderers/WebGlCanvas.ts:92](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/WebGlCanvas.ts#L92)

***

### canvas

> **canvas**: [`HTMLCanvasElement ↗️`]( https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement )

Canvas HTML element being used as a rendering surface.

#### Source

[src/renderers/WebGlCanvas.ts:96](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/WebGlCanvas.ts#L96)

***

### gl

> **gl**: [`WebGLRenderingContext ↗️`]( https://developer.mozilla.org/docs/Web/API/WebGLRenderingContext )

Rendering context - see [https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext)

#### Source

[src/renderers/WebGlCanvas.ts:100](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/WebGlCanvas.ts#L100)

***

### width

> **width**: `number`

View width (CSS pixels)

#### Implementation of

`CanvasInterface.width`

#### Source

[src/renderers/WebGlCanvas.ts:104](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/WebGlCanvas.ts#L104)

***

### height

> **height**: `number`

View height (CSS pixels)

#### Implementation of

`CanvasInterface.height`

#### Source

[src/renderers/WebGlCanvas.ts:108](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/WebGlCanvas.ts#L108)

***

### srcWidth

> **srcWidth**: `number`

Flipnote width (pixels).

#### Implementation of

`CanvasInterface.srcWidth`

#### Source

[src/renderers/WebGlCanvas.ts:112](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/WebGlCanvas.ts#L112)

***

### srcHeight

> **srcHeight**: `number`

Flipnote height (pixels).

#### Implementation of

`CanvasInterface.srcHeight`

#### Source

[src/renderers/WebGlCanvas.ts:116](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/WebGlCanvas.ts#L116)

***

### dstWidth

> **dstWidth**: `number`

Backing canvas width (real pixels)
Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels

#### Implementation of

`CanvasInterface.dstWidth`

#### Source

[src/renderers/WebGlCanvas.ts:121](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/WebGlCanvas.ts#L121)

***

### dstHeight

> **dstHeight**: `number`

Backing canvas height (real pixels)
Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels

#### Implementation of

`CanvasInterface.dstHeight`

#### Source

[src/renderers/WebGlCanvas.ts:126](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/WebGlCanvas.ts#L126)

***

### frameIndex

> **frameIndex**: `number`

#### Implementation of

`CanvasInterface.frameIndex`

#### Source

[src/renderers/WebGlCanvas.ts:130](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/WebGlCanvas.ts#L130)

***

### supportedStereoscopeModes

> **supportedStereoscopeModes**: [`CanvasStereoscopicMode`](/api/enumerations/canvasstereoscopicmode/)[]

#### Implementation of

`CanvasInterface.supportedStereoscopeModes`

#### Source

[src/renderers/WebGlCanvas.ts:134](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/WebGlCanvas.ts#L134)

***

### stereoscopeMode

> **stereoscopeMode**: [`CanvasStereoscopicMode`](/api/enumerations/canvasstereoscopicmode/) = `CanvasStereoscopicMode.None`

#### Implementation of

`CanvasInterface.stereoscopeMode`

#### Source

[src/renderers/WebGlCanvas.ts:142](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/WebGlCanvas.ts#L142)

***

### stereoscopeStrength

> **stereoscopeStrength**: `number` = `0`

#### Implementation of

`CanvasInterface.stereoscopeStrength`

#### Source

[src/renderers/WebGlCanvas.ts:146](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/WebGlCanvas.ts#L146)

## Methods

### isSupported()

> `static` **isSupported**(): `boolean`

#### Returns

`boolean`

#### Source

[src/renderers/WebGlCanvas.ts:75](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/WebGlCanvas.ts#L75)

***

### setCanvasSize()

> **setCanvasSize**(`width`, `height`): `void`

Resize the canvas surface

#### Parameters

• **width**: `number`

New canvas width, in CSS pixels

• **height**: `number`

New canvas height, in CSS pixels

The ratio between `width` and `height` should be 3:4 for best results

#### Returns

`void`

#### Implementation of

`CanvasInterface.setCanvasSize`

#### Source

[src/renderers/WebGlCanvas.ts:208](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/WebGlCanvas.ts#L208)

***

### setNote()

> **setNote**(`note`): `void`

Sets the note to use for this player

#### Parameters

• **note**: `BaseParser`

#### Returns

`void`

#### Implementation of

`CanvasInterface.setNote`

#### Source

[src/renderers/WebGlCanvas.ts:226](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/WebGlCanvas.ts#L226)

***

### clear()

> **clear**(`color`?): `void`

Clear the canvas

#### Parameters

• **color?**: [`number`, `number`, `number`, `number`]

optional RGBA color to use as a background color

#### Returns

`void`

#### Implementation of

`CanvasInterface.clear`

#### Source

[src/renderers/WebGlCanvas.ts:246](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/WebGlCanvas.ts#L246)

***

### drawFrame()

> **drawFrame**(`frameIndex`): `void`

Draw a frame from the currently loaded Flipnote

#### Parameters

• **frameIndex**: `number`

#### Returns

`void`

#### Implementation of

`CanvasInterface.drawFrame`

#### Source

[src/renderers/WebGlCanvas.ts:259](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/WebGlCanvas.ts#L259)

***

### requestStereoScopeMode()

> **requestStereoScopeMode**(`mode`): `void`

#### Parameters

• **mode**: [`CanvasStereoscopicMode`](/api/enumerations/canvasstereoscopicmode/)

#### Returns

`void`

#### Implementation of

`CanvasInterface.requestStereoScopeMode`

#### Source

[src/renderers/WebGlCanvas.ts:283](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/WebGlCanvas.ts#L283)

***

### forceUpdate()

> **forceUpdate**(): `void`

#### Returns

`void`

#### Implementation of

`CanvasInterface.forceUpdate`

#### Source

[src/renderers/WebGlCanvas.ts:291](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/WebGlCanvas.ts#L291)

***

### isErrorState()

> **isErrorState**(): `boolean`

Returns true if the webGL context has returned an error

#### Returns

`boolean`

#### Source

[src/renderers/WebGlCanvas.ts:299](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/WebGlCanvas.ts#L299)

***

### getDataUrl()

> **getDataUrl**(`type`?, `quality`?): `string`

Get the contents of the canvas as a data URL.

#### Parameters

• **type?**: `string`

image mime type (`image/jpeg`, `image/png`, etc)

• **quality?**: `any`

image quality where supported, between 0 and 1

#### Returns

`string`

#### Implementation of

`CanvasInterface.getDataUrl`

#### Source

[src/renderers/WebGlCanvas.ts:310](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/WebGlCanvas.ts#L310)

***

### getBlob()

> **getBlob**(`type`?, `quality`?): [`Promise ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<[`Blob ↗️`]( https://developer.mozilla.org/docs/Web/API/Blob )\>

Get the contents of the canvas as a blob.

#### Parameters

• **type?**: `string`

image mime type (`image/jpeg`, `image/png`, etc)

• **quality?**: `any`

image quality where supported, between 0 and 1

#### Returns

[`Promise ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<[`Blob ↗️`]( https://developer.mozilla.org/docs/Web/API/Blob )\>

#### Implementation of

`CanvasInterface.getBlob`

#### Source

[src/renderers/WebGlCanvas.ts:320](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/WebGlCanvas.ts#L320)

***

### destroy()

> **destroy**(): `void`

Frees any resources used by this canvas instance

#### Returns

`void`

#### Implementation of

`CanvasInterface.destroy`

#### Source

[src/renderers/WebGlCanvas.ts:327](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/WebGlCanvas.ts#L327)
