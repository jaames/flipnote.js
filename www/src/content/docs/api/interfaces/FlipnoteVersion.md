---
editUrl: false
next: false
prev: false
title: "FlipnoteVersion"
---

Defined in: [src/parsers/types.ts:58](https://github.com/jaames/flipnote.js/blob/24e772733243f115c3848537efabe6ee9020ad63/src/parsers/types.ts#L58)

Flipnote version info - provides details about a particular Flipnote version and its author

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="filename"></a> `filename` | `string` | Flipnote unique filename |
| <a id="username"></a> `username` | `string` | Author's username |
| <a id="fsid"></a> `fsid` | `string` | Author's unique Flipnote Studio ID, formatted in the same way that it would appear on the app's settings screen |
| <a id="region"></a> `region` | [`FlipnoteRegion`](/api/enumerations/flipnoteregion/) | Author's region |
| <a id="isdsifilename"></a> `isDsiFilename?` | `boolean` | KWZ only - sometimes DSi library notes incorrectly use the PPM filename format instead |
