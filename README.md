# flipnote.js

Enables browser-based playback of the proprietary animation formats used by [Flipnote Studio](https://en.wikipedia.org/wiki/Flipnote_Studio) and [Flipnote Studio 3D](https://en.wikipedia.org/wiki/Flipnote_Studio_3D), powered by [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API).

I hope that maybe in the long term it will serve some use in archiving Flipnote animations, epecially given that the online services for both applications have been closed down.

### Features

* Full playback support for Flipnote Studio files (`.ppm`) with full accuracy for both frames and audio
* Partial support for Flipnote Studio 3D files (`.kwz`) -- frames work perfectly but audio isn't done yet
* Dynamic upscaling/downscaling
* Metadata parsing
* Player API based on the HTML5 Video and Audio APIs

### Demo

Check out [Flipnote Player](https://github.com/jaames/flipnote-player) for a live demo. :)

### Authors

* **[James Daniel](https://github.com/jaames)**

### License

This project is licensed under the MIT License - see the LICENSE.md file for details.

### Building

Install dependencies:
```
npm install
```

Build:
```
npm run build
```

Run development server:
```
npm start
```

### Acknowledgments

* KWZ reverse-engineeing: [Kinnay](https://github.com/Kinnay), [MrNbaYoh](https://github.com/MrNbaYoh), [Shutterbug](https://github.com/shutterbug2000).
* PPM format reverse-engineering & documentaion: [bricklife](http://ugomemo.g.hatena.ne.jp/bricklife/20090307/1236391313), [mirai-iro](http://mirai-iro.hatenablog.jp/entry/20090116/ugomemo_ppm), [harimau_tigris](http://ugomemo.g.hatena.ne.jp/harimau_tigris), [steven](http://www.dsibrew.org/wiki/User:Steven), [yellows8](http://www.dsibrew.org/wiki/User:Yellows8) and [PBSDS](https://github.com/pbsds).
* Identifying the PPM sound codec: Midmad from Hatena Haiku (no longer active) and WDLMaster from the [HCS forum](https://hcs64.com/mboard/forum.php).
* [PBSDS](https://github.com/pbsds) for creating [Hatena Tools](https://github.com/pbsds/Hatenatools), and for giving me some notes regarding areas where the documentation fell short. 
* Stichting Mathematisch Centrum for writing this [ADPCM to PCM converter in C](http://www.cs.columbia.edu/~gskc/Code/AdvancedInternetServices/SoundNoiseRatio/dvi_adpcm.c) which I semi-ported to JS to handle audio.
* [Austin Burk](https://sudomemo.net) and [JoshuaDoes](https://github.com/joshuadoes) for helping to debug my Python3 PPM parser (which I used as a reference for the JS decoder).
* [JSA](https://github.com/thejsa) for performing packet captures of [Flipnote Hatena](http://flipnote.hatena.com/thankyou) before it shut down, without them reverse-engineering the app in general would have been a *huge* pain.
* [Nintendo](https://www.nintendo.com/) for creating the Flipnote Studio application.
* [Hatena](http://www.hatena.ne.jp/) for creating Flipnote Hatena, the now-defunct online service for sharing Flipnote Studio creations.
