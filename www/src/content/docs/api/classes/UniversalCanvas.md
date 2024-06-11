---
editUrl: false
next: false
prev: false
title: "UniversalCanvas"
---

## Implements

- `CanvasInterface`

## Constructors

### new UniversalCanvas()

> **new UniversalCanvas**(`parent`, `width`, `height`, `options`): [`UniversalCanvas`](/api/classes/universalcanvas/)

#### Parameters

• **parent**: [`Element ↗️`]( https://developer.mozilla.org/docs/Web/API/Element )

• **width**: `number`= `640`

• **height**: `number`= `480`

• **options**: [`Partial ↗️`]( https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype )\<[`UniversalCanvasOptions`](/api/type-aliases/universalcanvasoptions/)\>= `{}`

#### Returns

[`UniversalCanvas`](/api/classes/universalcanvas/)

#### Source

[src/renderers/UniversalCanvas.ts:92](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/UniversalCanvas.ts#L92)

## Properties

### renderer

> **renderer**: `CanvasInterface`

#### Source

[src/renderers/UniversalCanvas.ts:28](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/UniversalCanvas.ts#L28)

***

### note

> **note**: `BaseParser`

#### Implementation of

`CanvasInterface.note`

#### Source

[src/renderers/UniversalCanvas.ts:32](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/UniversalCanvas.ts#L32)

***

### width

> **width**: `number`

View width (CSS pixels)

#### Implementation of

`CanvasInterface.width`

#### Source

[src/renderers/UniversalCanvas.ts:36](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/UniversalCanvas.ts#L36)

***

### height

> **height**: `number`

View height (CSS pixels)

#### Implementation of

`CanvasInterface.height`

#### Source

[src/renderers/UniversalCanvas.ts:40](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/UniversalCanvas.ts#L40)

***

### dstWidth

> **dstWidth**: `number`

Backing canvas width (real pixels)
Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels

#### Implementation of

`CanvasInterface.dstWidth`

#### Source

[src/renderers/UniversalCanvas.ts:45](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/UniversalCanvas.ts#L45)

***

### dstHeight

> **dstHeight**: `number`

Backing canvas height (real pixels)
Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels

#### Implementation of

`CanvasInterface.dstHeight`

#### Source

[src/renderers/UniversalCanvas.ts:50](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/UniversalCanvas.ts#L50)

***

### srcWidth

> **srcWidth**: `number`

#### Implementation of

`CanvasInterface.srcWidth`

#### Source

[src/renderers/UniversalCanvas.ts:54](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/UniversalCanvas.ts#L54)

***

### srcHeight

> **srcHeight**: `number`

#### Implementation of

`CanvasInterface.srcHeight`

#### Source

[src/renderers/UniversalCanvas.ts:58](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/UniversalCanvas.ts#L58)

***

### frameIndex

> **frameIndex**: `number`

#### Implementation of

`CanvasInterface.frameIndex`

#### Source

[src/renderers/UniversalCanvas.ts:62](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/UniversalCanvas.ts#L62)

***

### isReady

> **isReady**: `boolean` = `false`

#### Source

[src/renderers/UniversalCanvas.ts:66](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/UniversalCanvas.ts#L66)

***

### isHtml5

> **isHtml5**: `boolean` = `false`

#### Source

[src/renderers/UniversalCanvas.ts:70](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/UniversalCanvas.ts#L70)

***

### supportedStereoscopeModes

> **supportedStereoscopeModes**: [`CanvasStereoscopicMode`](/api/enumerations/canvasstereoscopicmode/)[] = `[]`

#### Implementation of

`CanvasInterface.supportedStereoscopeModes`

#### Source

[src/renderers/UniversalCanvas.ts:74](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/UniversalCanvas.ts#L74)

***

### stereoscopeMode

> **stereoscopeMode**: [`CanvasStereoscopicMode`](/api/enumerations/canvasstereoscopicmode/) = `CanvasStereoscopicMode.None`

#### Implementation of

`CanvasInterface.stereoscopeMode`

#### Source

[src/renderers/UniversalCanvas.ts:78](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/UniversalCanvas.ts#L78)

***

### stereoscopeStrength

> **stereoscopeStrength**: `number` = `1`

#### Implementation of

`CanvasInterface.stereoscopeStrength`

#### Source

[src/renderers/UniversalCanvas.ts:82](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/UniversalCanvas.ts#L82)

## Methods

### fallbackIfPossible()

> **fallbackIfPossible**(): `void`

#### Returns

`void`

#### Source

[src/renderers/UniversalCanvas.ts:133](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/UniversalCanvas.ts#L133)

***

### switchToHtml5()

> **switchToHtml5**(): `void`

#### Returns

`void`

#### Source

[src/renderers/UniversalCanvas.ts:142](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/UniversalCanvas.ts#L142)

***

### setCanvasSize()

> **setCanvasSize**(`width`, `height`): `void`

#### Parameters

• **width**: `number`

• **height**: `number`

#### Returns

`void`

#### Implementation of

`CanvasInterface.setCanvasSize`

#### Source

[src/renderers/UniversalCanvas.ts:146](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/UniversalCanvas.ts#L146)

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

[src/renderers/UniversalCanvas.ts:155](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/UniversalCanvas.ts#L155)

***

### clear()

> **clear**(`color`?): `void`

#### Parameters

• **color?**: [`number`, `number`, `number`, `number`]

#### Returns

`void`

#### Implementation of

`CanvasInterface.clear`

#### Source

[src/renderers/UniversalCanvas.ts:163](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/UniversalCanvas.ts#L163)

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

[src/renderers/UniversalCanvas.ts:167](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/UniversalCanvas.ts#L167)

***

### forceUpdate()

> **forceUpdate**(): `void`

#### Returns

`void`

#### Implementation of

`CanvasInterface.forceUpdate`

#### Source

[src/renderers/UniversalCanvas.ts:172](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/UniversalCanvas.ts#L172)

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

[src/renderers/UniversalCanvas.ts:176](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/UniversalCanvas.ts#L176)

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

[src/renderers/UniversalCanvas.ts:181](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/UniversalCanvas.ts#L181)

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

[src/renderers/UniversalCanvas.ts:185](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/UniversalCanvas.ts#L185)

***

### destroy()

> **destroy**(): `void`

#### Returns

`void`

#### Implementation of

`CanvasInterface.destroy`

#### Source

[src/renderers/UniversalCanvas.ts:189](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/renderers/UniversalCanvas.ts#L189)
