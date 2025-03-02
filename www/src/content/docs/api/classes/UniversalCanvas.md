---
editUrl: false
next: false
prev: false
title: "UniversalCanvas"
---

Defined in: [src/renderers/UniversalCanvas.ts:23](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/UniversalCanvas.ts#L23)

## Implements

- `CanvasInterface`

## Constructors

### new UniversalCanvas()

> **new UniversalCanvas**(`parent`, `width`, `height`, `options`): [`UniversalCanvas`](/api/classes/universalcanvas/)

Defined in: [src/renderers/UniversalCanvas.ts:92](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/UniversalCanvas.ts#L92)

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `parent` | [`Element`](https://developer.mozilla.org/docs/Web/API/Element) | `undefined` |
| `width` | `number` | `640` |
| `height` | `number` | `480` |
| `options` | [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`UniversalCanvasOptions`](/api/type-aliases/universalcanvasoptions/)\> | `{}` |

#### Returns

[`UniversalCanvas`](/api/classes/universalcanvas/)

## Properties

### renderer

> **renderer**: `CanvasInterface`

Defined in: [src/renderers/UniversalCanvas.ts:28](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/UniversalCanvas.ts#L28)

***

### note

> **note**: `BaseParser`

Defined in: [src/renderers/UniversalCanvas.ts:32](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/UniversalCanvas.ts#L32)

#### Implementation of

`CanvasInterface.note`

***

### width

> **width**: `number`

Defined in: [src/renderers/UniversalCanvas.ts:36](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/UniversalCanvas.ts#L36)

View width (CSS pixels)

#### Implementation of

`CanvasInterface.width`

***

### height

> **height**: `number`

Defined in: [src/renderers/UniversalCanvas.ts:40](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/UniversalCanvas.ts#L40)

View height (CSS pixels)

#### Implementation of

`CanvasInterface.height`

***

### dstWidth

> **dstWidth**: `number`

Defined in: [src/renderers/UniversalCanvas.ts:45](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/UniversalCanvas.ts#L45)

Backing canvas width (real pixels)
Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels

#### Implementation of

`CanvasInterface.dstWidth`

***

### dstHeight

> **dstHeight**: `number`

Defined in: [src/renderers/UniversalCanvas.ts:50](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/UniversalCanvas.ts#L50)

Backing canvas height (real pixels)
Note that this factors in device pixel ratio, so it may not reflect the size of the canvas in CSS pixels

#### Implementation of

`CanvasInterface.dstHeight`

***

### srcWidth

> **srcWidth**: `number`

Defined in: [src/renderers/UniversalCanvas.ts:54](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/UniversalCanvas.ts#L54)

#### Implementation of

`CanvasInterface.srcWidth`

***

### srcHeight

> **srcHeight**: `number`

Defined in: [src/renderers/UniversalCanvas.ts:58](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/UniversalCanvas.ts#L58)

#### Implementation of

`CanvasInterface.srcHeight`

***

### frameIndex

> **frameIndex**: `number`

Defined in: [src/renderers/UniversalCanvas.ts:62](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/UniversalCanvas.ts#L62)

#### Implementation of

`CanvasInterface.frameIndex`

***

### isReady

> **isReady**: `boolean` = `false`

Defined in: [src/renderers/UniversalCanvas.ts:66](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/UniversalCanvas.ts#L66)

***

### isHtml5

> **isHtml5**: `boolean` = `false`

Defined in: [src/renderers/UniversalCanvas.ts:70](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/UniversalCanvas.ts#L70)

***

### supportedStereoscopeModes

> **supportedStereoscopeModes**: [`CanvasStereoscopicMode`](/api/enumerations/canvasstereoscopicmode/)[] = `[]`

Defined in: [src/renderers/UniversalCanvas.ts:74](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/UniversalCanvas.ts#L74)

#### Implementation of

`CanvasInterface.supportedStereoscopeModes`

***

### stereoscopeMode

> **stereoscopeMode**: [`CanvasStereoscopicMode`](/api/enumerations/canvasstereoscopicmode/) = `CanvasStereoscopicMode.None`

Defined in: [src/renderers/UniversalCanvas.ts:78](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/UniversalCanvas.ts#L78)

#### Implementation of

`CanvasInterface.stereoscopeMode`

***

### stereoscopeStrength

> **stereoscopeStrength**: `number` = `1`

Defined in: [src/renderers/UniversalCanvas.ts:82](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/UniversalCanvas.ts#L82)

#### Implementation of

`CanvasInterface.stereoscopeStrength`

## Methods

### fallbackIfPossible()

> **fallbackIfPossible**(): `void`

Defined in: [src/renderers/UniversalCanvas.ts:133](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/UniversalCanvas.ts#L133)

#### Returns

`void`

***

### switchToHtml5()

> **switchToHtml5**(): `void`

Defined in: [src/renderers/UniversalCanvas.ts:142](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/UniversalCanvas.ts#L142)

#### Returns

`void`

***

### setCanvasSize()

> **setCanvasSize**(`width`, `height`): `void`

Defined in: [src/renderers/UniversalCanvas.ts:146](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/UniversalCanvas.ts#L146)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `width` | `number` |
| `height` | `number` |

#### Returns

`void`

#### Implementation of

`CanvasInterface.setCanvasSize`

***

### setNote()

> **setNote**(`note`): `void`

Defined in: [src/renderers/UniversalCanvas.ts:155](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/UniversalCanvas.ts#L155)

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

Defined in: [src/renderers/UniversalCanvas.ts:163](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/UniversalCanvas.ts#L163)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `color`? | \[`number`, `number`, `number`, `number`\] |

#### Returns

`void`

#### Implementation of

`CanvasInterface.clear`

***

### drawFrame()

> **drawFrame**(`frameIndex`): `void`

Defined in: [src/renderers/UniversalCanvas.ts:167](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/UniversalCanvas.ts#L167)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `frameIndex` | `number` |

#### Returns

`void`

#### Implementation of

`CanvasInterface.drawFrame`

***

### forceUpdate()

> **forceUpdate**(): `void`

Defined in: [src/renderers/UniversalCanvas.ts:172](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/UniversalCanvas.ts#L172)

#### Returns

`void`

#### Implementation of

`CanvasInterface.forceUpdate`

***

### requestStereoScopeMode()

> **requestStereoScopeMode**(`mode`): `void`

Defined in: [src/renderers/UniversalCanvas.ts:176](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/UniversalCanvas.ts#L176)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `mode` | [`CanvasStereoscopicMode`](/api/enumerations/canvasstereoscopicmode/) |

#### Returns

`void`

#### Implementation of

`CanvasInterface.requestStereoScopeMode`

***

### getDataUrl()

> **getDataUrl**(`type`?, `quality`?): `string`

Defined in: [src/renderers/UniversalCanvas.ts:181](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/UniversalCanvas.ts#L181)

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

Defined in: [src/renderers/UniversalCanvas.ts:185](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/UniversalCanvas.ts#L185)

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

Defined in: [src/renderers/UniversalCanvas.ts:189](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/renderers/UniversalCanvas.ts#L189)

#### Returns

`void`

#### Implementation of

`CanvasInterface.destroy`
