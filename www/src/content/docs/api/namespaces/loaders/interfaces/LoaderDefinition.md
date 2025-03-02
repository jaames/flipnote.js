---
editUrl: false
next: false
prev: false
title: "LoaderDefinition"
---

Defined in: [src/loaders/types.ts:5](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/loaders/types.ts#L5)

Loader interface.
The goal of a loader is to be able to tell when it can handle a particular source type, and then resolve an ArrayBuffer for that source.

## Type Parameters

| Type Parameter |
| :------ |
| `T` |

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="name"></a> `name` | `string` | Unique loader name |
| <a id="matches"></a> `matches` | (`source`: `any`) => `boolean` | Is this loader able to process the input source type? |
| <a id="load"></a> `load` | (`source`: `T`) => [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`ArrayBufferLike`\> | Try loading the source (can be async) and return an ArrayBuffer |
