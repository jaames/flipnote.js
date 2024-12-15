---
title: Acknowledgements
---

Flipnote.js was written by **James**, who went slightly insane in the process and started writing in third person. You can find his ramblings on [Bluesky](https://bsky.app/profile/jaames.co.uk) and his code on [GitHub](https://github.com/jaames).

### Special Thanks

This wouldn't have been possible without the many rad people who have contributed to Flipnote Studio and its ensuing reverse-engineering scene over the years:

- **[Bricklife](http://ugomemo.g.hatena.ne.jp/bricklife/20090307/1236391313)**, **[mirai-iro](http://mirai-iro.hatenablog.jp/entry/20090116/ugomemo_ppm)** and **[harimau_tigris](http://ugomemo.g.hatena.ne.jp/harimau_tigris)** - for early Flipnote Studio and PPM format reverse-engineering.
- **Midmad** from Hatena Haiku and **WDLMaster** from hcs64.com - for early PPM audio reverse-engineering.
- **[steven](http://www.dsibrew.org/wiki/User:Steven)** and **[yellows8](http://www.dsibrew.org/wiki/User:Yellows8)** - for the early [PPM format documentaion](https://www.dsibrew.org/wiki/Flipnote_Files/PPM) on DSiBrew.
- **[PBSDS](https://github.com/pbsds)** - for further PPM reverse-engineering, and for writing [Hatenatools](https://github.com/pbsds/Hatenatools).
- **[MrNbaYoh](https://github.com/MrNbaYoh)** - for helping with early KWZ reverse-engineering.
- **[Shutterbug](https://github.com/shutterbug2000)** - for helping with various PPM and KWZ reverse-engineering bits.
- **[Kinnay](https://github.com/Kinnay)** - for figuring out KWZ tile decompression.
- **[Khang](https://github.com/khang06)** - for helping with early KWZ audio reverse-engineering.
- **[Simon](https://github.com/simontime)** - for finishing both PPM and KWZ audio reverse-engineering.
- **[Meemo](https://github.com/meemo)** - for coming up with the tricks used to clean up DSi Library KWZ audio.
- **[Austin](https://twitter.com/AustinSudomemo)** from **[Sudomemo](https://www.sudomemo.net/)** - for providing copius sample Flipnotes and other helpful data, and for allowing me to use his Flipnote audio equalizer setup.
- **[Tycho "Sudodad" Aussie](https://github.com/tychoaussie)** - for scientific assistance with signal processing algorithms.
- **[Lauren Kelly](https://github.com/thejsa)** - for performing packet captures of Flipnote Hatena before it shut down, without them reverse-engineering the app in general would have been a huge pain.
- **[Stary](https://github.com/Stary2001)**, **[Joshua](https://github.com/JoshuaDoes)** - for various tips and tricks and entertainment.
- **[Jaames](https://github.com/jaames)** - general reverse-engineering and tooling for both apps.
- **[Everyone from the Kaeru Team dev Discord](https://kaeru.world/)** - for helping out with miscellaneous bits and for putting up with my nonsensical ramblings about weird proprietary animation formats.

- **[Nintendo](https://www.nintendo.com/)** - for creating Flipnote Studio.
- **[Hatena](http://www.hatena.ne.jp/)** - for creating Flipnote Hatena, the now-defunct online service for sharing Flipnote Studio creations.

* It's not mandatory, but if you use this library in your own projects, please consider adding this list of credits somewhere!

### References

- **[PPM Format Documentation](https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format)**.
- **[KWZ Format Documentation](https://github.com/Flipnote-Collective/flipnote-studio-3d-docs/wiki/KWZ-Format)**.
- **[FFmpeg](https://ffmpeg.org/)** - for their [ADPCM implementation](https://github.com/FFmpeg/FFmpeg/blob/master/libavcodec/adpcm.c), which was loosely referenced when implementing audio.
- **[Libretro](https://www.libretro.com/)** - for their [pixel art shaders](https://github.com/libretro/glsl-shaders), used as reference for the sharp-bilinear post-processing implementation.