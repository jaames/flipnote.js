---
editUrl: false
next: false
prev: false
title: "Html5Canvas"
---

Defined in: [src/renderers/Html5Canvas.ts:33](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/Html5Canvas.ts#L33)

Flipnote renderer for the [HTML5 2D canvas API](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)

## Implements

- `CanvasInterface`

## Constructors

### new Html5Canvas()

> **new Html5Canvas**(`parent`, `width`, `height`, `options`): [`Html5Canvas`](/api/classes/html5canvas/)

Defined in: [src/renderers/Html5Canvas.ts:114](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/Html5Canvas.ts#L114)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `parent` | [`Element`](https://developer.mozilla.org/docs/Web/API/Element) |
| `width` | `number` |
| `height` | `number` |
| `options` | [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`Html5CanvasOptions`](/api/interfaces/html5canvasoptions/)\> |

#### Returns

[`Html5Canvas`](/api/classes/html5canvas/)

## Properties

### defaultOptions

> `static` **defaultOptions**: [`Html5CanvasOptions`](/api/interfaces/html5canvasoptions/)

Defined in: [src/renderers/Html5Canvas.ts:35](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/Html5Canvas.ts#L35)

***

### note

> **note**: `BaseParser`

Defined in: [src/renderers/Html5Canvas.ts:53](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/Html5Canvas.ts#L53)

#### Implementation of

`CanvasInterface.note`

***

### canvas

> **canvas**: [`HTMLCanvasElement`](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement)

Defined in: [src/renderers/Html5Canvas.ts:57](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/Html5Canvas.ts#L57)

Canvas HTML element being used as a rendering surface

***

### ctx

> **ctx**: [`CanvasRenderingContext2D`](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D)

Defined in: [src/renderers/Html5Canvas.ts:61](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/Html5Canvas.ts#L61)

Rendering context

***

### width

> **width**: `number`

Defined in: [src/renderers/Html5Canvas.ts:65](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/Html5Canvas.ts#L65)

View width (CSS pixels)

#### Implementation of

`CanvasInterface.width`

***

### height

> **height**: `number`

Defined in: [src/renderers/Html5Canvas.ts:69](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/Html5Canvas.ts#L69)

View height (CSS pixels)

#### Implementation of

`CanvasInterface.height`

***

### dstWidth

> **dstWidth**: `number`

Defined in: [src/renderers/Html5Canvas.ts:74](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/Html5Canvas.ts#L74)

Backing canvas width (real pixels)
Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels

#### Implementation of

`CanvasInterface.dstWidth`

***

### dstHeight

> **dstHeight**: `number`

Defined in: [src/renderers/Html5Canvas.ts:79](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/Html5Canvas.ts#L79)

Backing canvas height (real pixels)
Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels

#### Implementation of

`CanvasInterface.dstHeight`

***

### srcWidth

> **srcWidth**: `number`

Defined in: [src/renderers/Html5Canvas.ts:83](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/Html5Canvas.ts#L83)

#### Implementation of

`CanvasInterface.srcWidth`

***

### srcHeight

> **srcHeight**: `number`

Defined in: [src/renderers/Html5Canvas.ts:87](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/Html5Canvas.ts#L87)

#### Implementation of

`CanvasInterface.srcHeight`

***

### frameIndex

> **frameIndex**: `number`

Defined in: [src/renderers/Html5Canvas.ts:91](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/Html5Canvas.ts#L91)

#### Implementation of

`CanvasInterface.frameIndex`

***

### supportedStereoscopeModes

> **supportedStereoscopeModes**: [`CanvasStereoscopicMode`](/api/enumerations/canvasstereoscopicmode/)[]

Defined in: [src/renderers/Html5Canvas.ts:95](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/Html5Canvas.ts#L95)

#### Implementation of

`CanvasInterface.supportedStereoscopeModes`

***

### stereoscopeMode

> **stereoscopeMode**: [`CanvasStereoscopicMode`](/api/enumerations/canvasstereoscopicmode/) = `CanvasStereoscopicMode.None`

Defined in: [src/renderers/Html5Canvas.ts:101](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/Html5Canvas.ts#L101)

#### Implementation of

`CanvasInterface.stereoscopeMode`

***

### stereoscopeStrength

> **stereoscopeStrength**: `number` = `0`

Defined in: [src/renderers/Html5Canvas.ts:105](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/Html5Canvas.ts#L105)

#### Implementation of

`CanvasInterface.stereoscopeStrength`

## Methods

### isSupported()

> `static` **isSupported**(): `boolean`

Defined in: [src/renderers/Html5Canvas.ts:40](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/Html5Canvas.ts#L40)

#### Returns

`boolean`

***

### setCanvasSize()

> **setCanvasSize**(`width`, `height`): `void`

Defined in: [src/renderers/Html5Canvas.ts:136](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/Html5Canvas.ts#L136)

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

Defined in: [src/renderers/Html5Canvas.ts:154](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/Html5Canvas.ts#L154)

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

Defined in: [src/renderers/Html5Canvas.ts:175](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/Html5Canvas.ts#L175)

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

Defined in: [src/renderers/Html5Canvas.ts:188](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/Html5Canvas.ts#L188)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `frameIndex` | `number` |

#### Returns

`void`

#### Implementation of

`CanvasInterface.drawFrame`

***

### requestStereoScopeMode()

> **requestStereoScopeMode**(`mode`): `void`

Defined in: [src/renderers/Html5Canvas.ts:211](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/Html5Canvas.ts#L211)

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

Defined in: [src/renderers/Html5Canvas.ts:219](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/Html5Canvas.ts#L219)

#### Returns

`void`

#### Implementation of

`CanvasInterface.forceUpdate`

***

### getDataUrl()

> **getDataUrl**(`type`?, `quality`?): `string`

Defined in: [src/renderers/Html5Canvas.ts:224](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/Html5Canvas.ts#L224)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `type`? | `string` |
| `quality`? | `any` |

#### Returns

`string`

#### Implementation of

`CanvasInterface.getDataUrl`

***

### getBlob()

> **getBlob**(`type`?, `quality`?): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Blob`](https://developer.mozilla.org/docs/Web/API/Blob)\>

Defined in: [src/renderers/Html5Canvas.ts:228](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/Html5Canvas.ts#L228)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `type`? | `string` |
| `quality`? | `any` |

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Blob`](https://developer.mozilla.org/docs/Web/API/Blob)\>

#### Implementation of

`CanvasInterface.getBlob`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/renderers/Html5Canvas.ts:232](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/Html5Canvas.ts#L232)

#### Returns

`void`

#### Implementation of

`CanvasInterface.destroy`
