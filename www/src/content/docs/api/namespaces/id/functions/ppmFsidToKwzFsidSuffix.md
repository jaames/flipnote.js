---
editUrl: false
next: false
prev: false
title: "ppmFsidToKwzFsidSuffix"
---

> **ppmFsidToKwzFsidSuffix**(`fsid`): `string`

Convert a PPM Flipnote Studio ID to the format used by KWZ Flipnote Studio IDs (as seen in Nintendo DSi Library Flipnotes).
Will return `null` if the conversion could not be made.

NOTE: KWZ Flipnote Studio IDs contain an extra two characters at the beginning. It is not possible to resolve these from a PPM Flipnote Studio ID.

## Parameters

• **fsid**: `string`

## Returns

`string`

## Source

[src/parsers/flipnoteStudioId/common.ts:38](https://github.com/jaames/flipnote.js/blob/afe27e228e29d19d2dff33dfb324ba35dc913507/src/parsers/flipnoteStudioId/common.ts#L38)
