---
editUrl: false
next: false
prev: false
title: "KwzParserSettings"
---

> **KwzParserSettings**: `object`

Defined in: [src/parsers/KwzParser.ts:196](https://github.com/jaames/flipnote.js/blob/8ec10f089e866d1297261b52ab6750bd899577ce/src/parsers/KwzParser.ts#L196)

KWZ parser options for enabling optimizations and other extra features

## Type declaration

### quickMeta

> **quickMeta**: `boolean`

Skip full metadata parsing for quickness

### dsiLibraryNote

> **dsiLibraryNote**: `boolean`

Apply special cases for DSi library notes

### borderCrop

> **borderCrop**: `boolean`

Automatically crop out the border around any frames

### guessInitialBgmState

> **guessInitialBgmState**: `boolean`

Nintendo messed up the initial adpcm state for a bunch of the PPM to KWZ conversions on DSi Library. They are effectively random.
By default flipnote.js will try to make a best guess, but you can disable this and provide your own state values

This is only enabled if `dsiLibraryNote` is also set to `true`

### initialBgmStepIndex

> **initialBgmStepIndex**: `number` \| `null`

Manually provide the initial adpcm step index for the BGM track.

This is only enabled if `dsiLibraryNote` is also set to `true`

### initialBgmPredictor

> **initialBgmPredictor**: `number` \| `null`

Manually provide the initial adpcm predictor for the BGM track.

This is only enabled if `dsiLibraryNote` is also set to `true`

### initialSeStepIndices

> **initialSeStepIndices**: `number`[] \| `null`

Manually provide an initial adpcm step index for each sound effect track.

This is only enabled if `dsiLibraryNote` is also set to `true`

### initialSePredictors

> **initialSePredictors**: `number`[] \| `null`

Manually provide an initial adpcm predictor for each sound effect track.

This is only enabled if `dsiLibraryNote` is also set to `true`.
