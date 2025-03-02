---
editUrl: false
next: false
prev: false
title: "ppmFsidToKwzFsidSuffix"
---

> **ppmFsidToKwzFsidSuffix**(`fsid`): `string`

Defined in: [src/parsers/flipnoteStudioId/common.ts:41](https://github.com/jaames/flipnote.js/blob/a8a7e56268fb7f3a0039ade6ddc69a607deedd27/src/parsers/flipnoteStudioId/common.ts#L41)

Convert a PPM Flipnote Studio ID to the format used by KWZ Flipnote Studio IDs (as seen in Nintendo DSi Library Flipnotes).
Will return `null` if the conversion could not be made.

:::tip
KWZ Flipnote Studio IDs contain an extra two characters at the beginning. 
It is not possible to resolve these from a PPM Flipnote Studio ID.
:::

## Parameters

| Parameter | Type |
| :------ | :------ |
| `fsid` | `string` |

## Returns

`string`
