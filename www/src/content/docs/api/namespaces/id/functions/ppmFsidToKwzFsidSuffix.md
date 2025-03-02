---
editUrl: false
next: false
prev: false
title: "ppmFsidToKwzFsidSuffix"
---

> **ppmFsidToKwzFsidSuffix**(`fsid`): `string`

Defined in: [src/parsers/flipnoteStudioId/common.ts:38](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/parsers/flipnoteStudioId/common.ts#L38)

Convert a PPM Flipnote Studio ID to the format used by KWZ Flipnote Studio IDs (as seen in Nintendo DSi Library Flipnotes).
Will return `null` if the conversion could not be made.

NOTE: KWZ Flipnote Studio IDs contain an extra two characters at the beginning. It is not possible to resolve these from a PPM Flipnote Studio ID.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `fsid` | `string` |

## Returns

`string`
