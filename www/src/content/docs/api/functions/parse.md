---
editUrl: false
next: false
prev: false
title: "parse"
---

> **parse**(`source`, `parserConfig`?): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`BaseParser`\>

Defined in: [src/parseSource.ts:21](https://github.com/jaames/flipnote.js/blob/fa9305c29e8ec1c9100d20a6b44d2fa614eb1888/src/parseSource.ts#L21)

Load a Flipnote from a given source, returning a promise with a parser object. 
It will auto-detect the Flipnote format and return either a [PpmParser](../../../../../../api/classes/ppmparser) or [KwzParser](../../../../../../api/classes/kwzparser) accordingly.

## Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `source` | `any` | Source to load a Flipnote from. This will attempt to use one of the registered [loaders](../../../../../../api/namespaces/loaders/readme) to load the Flipnote. Depending on the operating environment, the default loader set supports the following sources: - A string representing a web URL. - An [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). - A [File](https://developer.mozilla.org/en-US/docs/Web/API/File) object (Browser only). - A [Buffer](https://nodejs.org/api/buffer.html) object (NodeJS only). |
| `parserConfig`? | [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`KwzParserSettings`](/api/type-aliases/kwzparsersettings/)\>\> | Config settings to pass to the parser, see [FlipnoteParserSettings](../../../../../../api/type-aliases/flipnoteparsersettings). |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`BaseParser`\>
