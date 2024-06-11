---
editUrl: false
next: false
prev: false
title: "LoaderDefinition"
---

Loader interface.
The goal of a loader is to be able to tell when it can handle a particular source type, and then resolve an ArrayBuffer for that source.

## Type parameters

• **T**

## Properties

### name

> **name**: `string`

Unique loader name

#### Source

[src/loaders/types.ts:9](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/loaders/types.ts#L9)

***

### matches()

> **matches**: (`source`) => `boolean`

Is this loader able to process the input source type?

#### Parameters

• **source**: `any`

#### Returns

`boolean`

#### Source

[src/loaders/types.ts:13](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/loaders/types.ts#L13)

***

### load()

> **load**: (`source`) => [`Promise ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<[`ArrayBuffer ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer )\>

Try loading the source (can be async) and return an ArrayBuffer

#### Parameters

• **source**: `T`

#### Returns

[`Promise ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<[`ArrayBuffer ↗️`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer )\>

#### Source

[src/loaders/types.ts:17](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/loaders/types.ts#L17)
