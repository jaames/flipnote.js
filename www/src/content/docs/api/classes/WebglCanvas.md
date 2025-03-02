---
editUrl: false
next: false
prev: false
title: "WebglCanvas"
---

Defined in: [src/renderers/WebGlCanvas.ts:67](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/renderers/WebGlCanvas.ts#L67)

Flipnote renderer for the [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) API.

Only available in browser contexts.

## Implements

- `CanvasInterface`

## Constructors

### new WebglCanvas()

> **new WebglCanvas**(`parent`, `width`, `height`, `options`): [`WebglCanvas`](/api/classes/webglcanvas/)

Defined in: [src/renderers/WebGlCanvas.ts:184](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/renderers/WebGlCanvas.ts#L184)

Creates a new WebGlCanvas instance

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `parent` | [`Element`](https://developer.mozilla.org/docs/Web/API/Element) | `undefined` | - |
| `width` | `number` | `640` | Canvas width in CSS pixels |
| `height` | `number` | `480` | Canvas height in CSS pixels The ratio between `width` and `height` should be 3:4 for best results |
| `options` | [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`WebglCanvasOptions`](/api/interfaces/webglcanvasoptions/)\> | `{}` | - |

#### Returns

[`WebglCanvas`](/api/classes/webglcanvas/)

## Properties

### defaultOptions

> `static` **defaultOptions**: [`WebglCanvasOptions`](/api/interfaces/webglcanvasoptions/)

Defined in: [src/renderers/WebGlCanvas.ts:69](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/renderers/WebGlCanvas.ts#L69)

***

### note

> **note**: `BaseParser`

Defined in: [src/renderers/WebGlCanvas.ts:92](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/renderers/WebGlCanvas.ts#L92)

Flipnote parser object for the Flipnote being played.

#### Implementation of

`CanvasInterface.note`

***

### canvas

> **canvas**: [`HTMLCanvasElement`](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement)

Defined in: [src/renderers/WebGlCanvas.ts:96](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/renderers/WebGlCanvas.ts#L96)

Canvas HTML element being used as a rendering surface.

***

### gl

> **gl**: [`WebGLRenderingContext`](https://developer.mozilla.org/docs/Web/API/WebGLRenderingContext)

Defined in: [src/renderers/WebGlCanvas.ts:100](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/renderers/WebGlCanvas.ts#L100)

Rendering context - see [https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext)

***

### width

> **width**: `number`

Defined in: [src/renderers/WebGlCanvas.ts:104](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/renderers/WebGlCanvas.ts#L104)

View width (CSS pixels)

#### Implementation of

`CanvasInterface.width`

***

### height

> **height**: `number`

Defined in: [src/renderers/WebGlCanvas.ts:108](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/renderers/WebGlCanvas.ts#L108)

View height (CSS pixels)

#### Implementation of

`CanvasInterface.height`

***

### srcWidth

> **srcWidth**: `number`

Defined in: [src/renderers/WebGlCanvas.ts:112](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/renderers/WebGlCanvas.ts#L112)

Flipnote width (pixels).

#### Implementation of

`CanvasInterface.srcWidth`

***

### srcHeight

> **srcHeight**: `number`

Defined in: [src/renderers/WebGlCanvas.ts:116](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/renderers/WebGlCanvas.ts#L116)

Flipnote height (pixels).

#### Implementation of

`CanvasInterface.srcHeight`

***

### dstWidth

> **dstWidth**: `number`

Defined in: [src/renderers/WebGlCanvas.ts:121](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/renderers/WebGlCanvas.ts#L121)

Backing canvas width (real pixels)
Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels

#### Implementation of

`CanvasInterface.dstWidth`

***

### dstHeight

> **dstHeight**: `number`

Defined in: [src/renderers/WebGlCanvas.ts:126](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/renderers/WebGlCanvas.ts#L126)

Backing canvas height (real pixels)
Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels

#### Implementation of

`CanvasInterface.dstHeight`

***

### frameIndex

> **frameIndex**: `number`

Defined in: [src/renderers/WebGlCanvas.ts:130](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/renderers/WebGlCanvas.ts#L130)

#### Implementation of

`CanvasInterface.frameIndex`

***

### supportedStereoscopeModes

> **supportedStereoscopeModes**: [`CanvasStereoscopicMode`](/api/enumerations/canvasstereoscopicmode/)[]

Defined in: [src/renderers/WebGlCanvas.ts:134](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/renderers/WebGlCanvas.ts#L134)

#### Implementation of

`CanvasInterface.supportedStereoscopeModes`

***

### stereoscopeMode

> **stereoscopeMode**: [`CanvasStereoscopicMode`](/api/enumerations/canvasstereoscopicmode/) = `CanvasStereoscopicMode.None`

Defined in: [src/renderers/WebGlCanvas.ts:142](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/renderers/WebGlCanvas.ts#L142)

#### Implementation of

`CanvasInterface.stereoscopeMode`

***

### stereoscopeStrength

> **stereoscopeStrength**: `number` = `0`

Defined in: [src/renderers/WebGlCanvas.ts:146](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/renderers/WebGlCanvas.ts#L146)

#### Implementation of

`CanvasInterface.stereoscopeStrength`

## Methods

### isSupported()

> `static` **isSupported**(): `boolean`

Defined in: [src/renderers/WebGlCanvas.ts:75](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/renderers/WebGlCanvas.ts#L75)

#### Returns

`boolean`

***

### setCanvasSize()

> **setCanvasSize**(`width`, `height`): `void`

Defined in: [src/renderers/WebGlCanvas.ts:208](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/renderers/WebGlCanvas.ts#L208)

Resize the canvas surface

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `width` | `number` | New canvas width, in CSS pixels |
| `height` | `number` | New canvas height, in CSS pixels The ratio between `width` and `height` should be 3:4 for best results |

#### Returns

`void`

#### Implementation of

`CanvasInterface.setCanvasSize`

***

### setNote()

> **setNote**(`note`): `void`

Defined in: [src/renderers/WebGlCanvas.ts:226](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/renderers/WebGlCanvas.ts#L226)

Sets the note to use for this player

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `note` | `BaseParser` |

#### Returns

`void`

#### Implementation of

`CanvasInterface.setNote`

***

### clear()

> **clear**(`color`?): `void`

Defined in: [src/renderers/WebGlCanvas.ts:246](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/renderers/WebGlCanvas.ts#L246)

Clear the canvas

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `color`? | \[`number`, `number`, `number`, `number`\] | optional RGBA color to use as a background color |

#### Returns

`void`

#### Implementation of

`CanvasInterface.clear`

***

### drawFrame()

> **drawFrame**(`frameIndex`): `void`

Defined in: [src/renderers/WebGlCanvas.ts:259](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/renderers/WebGlCanvas.ts#L259)

Draw a frame from the currently loaded Flipnote

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `frameIndex` | `number` |  |

#### Returns

`void`

#### Implementation of

`CanvasInterface.drawFrame`

***

### requestStereoScopeMode()

> **requestStereoScopeMode**(`mode`): `void`

Defined in: [src/renderers/WebGlCanvas.ts:283](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/renderers/WebGlCanvas.ts#L283)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `mode` | [`CanvasStereoscopicMode`](/api/enumerations/canvasstereoscopicmode/) |

#### Returns

`void`

#### Implementation of

`CanvasInterface.requestStereoScopeMode`

***

### forceUpdate()

> **forceUpdate**(): `void`

Defined in: [src/renderers/WebGlCanvas.ts:291](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/renderers/WebGlCanvas.ts#L291)

#### Returns

`void`

#### Implementation of

`CanvasInterface.forceUpdate`

***

### isErrorState()

> **isErrorState**(): `boolean`

Defined in: [src/renderers/WebGlCanvas.ts:299](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/renderers/WebGlCanvas.ts#L299)

Returns true if the webGL context has returned an error

#### Returns

`boolean`

***

### getDataUrl()

> **getDataUrl**(`type`?, `quality`?): `string`

Defined in: [src/renderers/WebGlCanvas.ts:310](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/renderers/WebGlCanvas.ts#L310)

Get the contents of the canvas as a data URL.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `type`? | `string` | image mime type (`image/jpeg`, `image/png`, etc) |
| `quality`? | `any` | image quality where supported, between 0 and 1 |

#### Returns

`string`

#### Implementation of

`CanvasInterface.getDataUrl`

***

### getBlob()

> **getBlob**(`type`?, `quality`?): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Blob`](https://developer.mozilla.org/docs/Web/API/Blob)\>

Defined in: [src/renderers/WebGlCanvas.ts:320](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/renderers/WebGlCanvas.ts#L320)

Get the contents of the canvas as a blob.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `type`? | `string` | image mime type (`image/jpeg`, `image/png`, etc) |
| `quality`? | `any` | image quality where supported, between 0 and 1 |

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Blob`](https://developer.mozilla.org/docs/Web/API/Blob)\>

#### Implementation of

`CanvasInterface.getBlob`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/renderers/WebGlCanvas.ts:327](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/renderers/WebGlCanvas.ts#L327)

Frees any resources used by this canvas instance

#### Returns

`void`

#### Implementation of

`CanvasInterface.destroy`
