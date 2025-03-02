---
editUrl: false
next: false
prev: false
title: "FlipnoteVersion"
---

Defined in: [src/parsers/types.ts:58](https://github.com/jaames/flipnote.js/blob/fa9305c29e8ec1c9100d20a6b44d2fa614eb1888/src/parsers/types.ts#L58)

Flipnote version info - provides details about a particular Flipnote version and its author

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="filename"></a> `filename` | `string` | Flipnote unique filename |
| <a id="username"></a> `username` | `string` | Author's username |
| <a id="fsid"></a> `fsid` | `string` | Author's unique Flipnote Studio ID, formatted in the same way that it would appear on the app's settings screen |
| <a id="region"></a> `region` | [`FlipnoteRegion`](/api/enumerations/flipnoteregion/) | Author's region |
| <a id="isdsifilename"></a> `isDsiFilename?` | `boolean` | KWZ only - sometimes DSi library notes incorrectly use the PPM filename format instead |
