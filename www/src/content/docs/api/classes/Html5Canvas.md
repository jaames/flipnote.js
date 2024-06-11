---
editUrl: false
next: false
prev: false
title: "Html5Canvas"
---

Flipnote renderer for the [HTML5 2D canvas API](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)

## Implements

- `CanvasInterface`

## Constructors

### new Html5Canvas()

> **new Html5Canvas**(`parent`, `width`, `height`, `options`): [`Html5Canvas`](/api/classes/html5canvas/)

#### Parameters

• **parent**: [`Element ↗️`]( https://developer.mozilla.org/docs/Web/API/Element )

• **width**: `number`

• **height**: `number`

• **options**: [`Partial ↗️`]( https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype )\<[`Html5CanvasOptions`](/api/interfaces/html5canvasoptions/)\>= `{}`

#### Returns

[`Html5Canvas`](/api/classes/html5canvas/)

#### Source

[src/renderers/Html5Canvas.ts:114](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/Html5Canvas.ts#L114)

## Properties

### defaultOptions

> `static` **defaultOptions**: [`Html5CanvasOptions`](/api/interfaces/html5canvasoptions/)

#### Source

[src/renderers/Html5Canvas.ts:35](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/Html5Canvas.ts#L35)

***

### note

> **note**: `BaseParser`

#### Implementation of

`CanvasInterface.note`

#### Source

[src/renderers/Html5Canvas.ts:53](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/Html5Canvas.ts#L53)

***

### canvas

> **canvas**: [`HTMLCanvasElement ↗️`]( https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement )

Canvas HTML element being used as a rendering surface

#### Source

[src/renderers/Html5Canvas.ts:57](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/Html5Canvas.ts#L57)

***

### ctx

> **ctx**: [`CanvasRenderingContext2D ↗️`]( https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D )

Rendering context

#### Source

[src/renderers/Html5Canvas.ts:61](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/Html5Canvas.ts#L61)

***

### width

> **width**: `number`

View width (CSS pixels)

#### Implementation of

`CanvasInterface.width`

#### Source

[src/renderers/Html5Canvas.ts:65](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/Html5Canvas.ts#L65)

***

### height

> **height**: `number`

View height (CSS pixels)

#### Implementation of

`CanvasInterface.height`

#### Source

[src/renderers/Html5Canvas.ts:69](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/Html5Canvas.ts#L69)

***

### dstWidth

> **dstWidth**: `number`

Backing canvas width (real pixels)
Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels

#### Implementation of

`CanvasInterface.dstWidth`

#### Source

[src/renderers/Html5Canvas.ts:74](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/Html5Canvas.ts#L74)

***

### dstHeight

> **dstHeight**: `number`

Backing canvas height (real pixels)
Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels

#### Implementation of

`CanvasInterface.dstHeight`

#### Source

[src/renderers/Html5Canvas.ts:79](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/Html5Canvas.ts#L79)

***

### srcWidth

> **srcWidth**: `number`

#### Implementation of

`CanvasInterface.srcWidth`

#### Source

[src/renderers/Html5Canvas.ts:83](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/Html5Canvas.ts#L83)

***

### srcHeight

> **srcHeight**: `number`

#### Implementation of

`CanvasInterface.srcHeight`

#### Source

[src/renderers/Html5Canvas.ts:87](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/Html5Canvas.ts#L87)

***

### frameIndex

> **frameIndex**: `number`

#### Implementation of

`CanvasInterface.frameIndex`

#### Source

[src/renderers/Html5Canvas.ts:91](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/Html5Canvas.ts#L91)

***

### supportedStereoscopeModes

> **supportedStereoscopeModes**: [`CanvasStereoscopicMode`](/api/enumerations/canvasstereoscopicmode/)[]

#### Implementation of

`CanvasInterface.supportedStereoscopeModes`

#### Source

[src/renderers/Html5Canvas.ts:95](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/Html5Canvas.ts#L95)

***

### stereoscopeMode

> **stereoscopeMode**: [`CanvasStereoscopicMode`](/api/enumerations/canvasstereoscopicmode/) = `CanvasStereoscopicMode.None`

#### Implementation of

`CanvasInterface.stereoscopeMode`

#### Source

[src/renderers/Html5Canvas.ts:101](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/Html5Canvas.ts#L101)

***

### stereoscopeStrength

> **stereoscopeStrength**: `number` = `0`

#### Implementation of

`CanvasInterface.stereoscopeStrength`

#### Source

[src/renderers/Html5Canvas.ts:105](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/Html5Canvas.ts#L105)

## Methods

### isSupported()

> `static` **isSupported**(): `boolean`

#### Returns

`boolean`

#### Source

[src/renderers/Html5Canvas.ts:40](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/Html5Canvas.ts#L40)

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

[src/renderers/Html5Canvas.ts:136](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/Html5Canvas.ts#L136)

***

### setNote()

> **setNote**(`note`): `void`

#### Parameters

• **note**: `BaseParser`

#### Returns

`void`

#### Implementation of

`CanvasInterface.setNote`

#### Source

[src/renderers/Html5Canvas.ts:154](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/Html5Canvas.ts#L154)

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

[src/renderers/Html5Canvas.ts:175](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/Html5Canvas.ts#L175)

***

### drawFrame()

> **drawFrame**(`frameIndex`): `void`

#### Parameters

• **frameIndex**: `number`

#### Returns

`void`

#### Implementation of

`CanvasInterface.drawFrame`

#### Source

[src/renderers/Html5Canvas.ts:188](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/Html5Canvas.ts#L188)

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

[src/renderers/Html5Canvas.ts:211](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/Html5Canvas.ts#L211)

***

### forceUpdate()

> **forceUpdate**(): `void`

#### Returns

`void`

#### Implementation of

`CanvasInterface.forceUpdate`

#### Source

[src/renderers/Html5Canvas.ts:219](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/Html5Canvas.ts#L219)

***

### getDataUrl()

> **getDataUrl**(`type`?, `quality`?): `string`

#### Parameters

• **type?**: `string`

• **quality?**: `any`

#### Returns

`string`

#### Implementation of

`CanvasInterface.getDataUrl`

#### Source

[src/renderers/Html5Canvas.ts:224](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/Html5Canvas.ts#L224)

***

### getBlob()

> **getBlob**(`type`?, `quality`?): [`Promise ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<[`Blob ↗️`]( https://developer.mozilla.org/docs/Web/API/Blob )\>

#### Parameters

• **type?**: `string`

• **quality?**: `any`

#### Returns

[`Promise ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<[`Blob ↗️`]( https://developer.mozilla.org/docs/Web/API/Blob )\>

#### Implementation of

`CanvasInterface.getBlob`

#### Source

[src/renderers/Html5Canvas.ts:228](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/Html5Canvas.ts#L228)

***

### destroy()

> **destroy**(): `void`

#### Returns

`void`

#### Implementation of

`CanvasInterface.destroy`

#### Source

[src/renderers/Html5Canvas.ts:232](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/Html5Canvas.ts#L232)
