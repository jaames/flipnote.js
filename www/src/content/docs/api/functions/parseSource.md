---
editUrl: false
next: false
prev: false
title: "parseSource"
---

> **parseSource**(`source`, `parserConfig`?): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`BaseParser`\>

Defined in: [src/parseSource.ts:39](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parseSource.ts#L39)

:::caution[Deprecated]
Use [parse](/api/functions/parse/) instead.
:::

## Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `source` | `any` | Source to load a Flipnote from. This will attempt to use one of the registered [loaders](../../../../../../api/namespaces/loaders/readme) to load the Flipnote. Depending on the operating environment, the default loader set supports the following sources: - A string representing a web URL. - An [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). - A [File](https://developer.mozilla.org/en-US/docs/Web/API/File) object (Browser only). - A [Buffer](https://nodejs.org/api/buffer.html) object (NodeJS only). |
| `parserConfig`? | [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`KwzParserSettings`](/api/type-aliases/kwzparsersettings/)\>\> | Config settings to pass to the parser, see [FlipnoteParserSettings](../../../../../../api/type-aliases/flipnoteparsersettings). |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`BaseParser`\>
