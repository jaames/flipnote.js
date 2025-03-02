---
editUrl: false
next: false
prev: false
title: "ppmFsidToKwzFsidSuffix"
---

> **ppmFsidToKwzFsidSuffix**(`fsid`): `string`

Defined in: [src/parsers/flipnoteStudioId/common.ts:38](https://github.com/jaames/flipnote.js/blob/70a96e94737c1e7105e9b3794d97b5baff2fd78b/src/parsers/flipnoteStudioId/common.ts#L38)

Convert a PPM Flipnote Studio ID to the format used by KWZ Flipnote Studio IDs (as seen in Nintendo DSi Library Flipnotes).
Will return `null` if the conversion could not be made.

NOTE: KWZ Flipnote Studio IDs contain an extra two characters at the beginning. It is not possible to resolve these from a PPM Flipnote Studio ID.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `fsid` | `string` |

## Returns

`string`
