# ugomemo.js
Real-time, browser-based playback of Flipnote Studio's .ppm animation format, powered by JavaScript and WebGL.

### Features

* Full support for Flipnote playback, with both frames and audio
* Flipnote metadata parsing
* Player API based on the HTML Video and Audio APIs
* 17KB minified, 5KB minified + gzipped

### Demo

For now, there's an old [work-in-progress video on my twitter account](https://twitter.com/rakujira/status/950364766031306753) (any glitchyness shown has been fixed since). I'm currently working on implementing this project into a Flipnote player web app to further demonstrate it, so please bear with me! 

### Documentation

* [Getting Started](https://github.com/jaames/ugomemo.js/blob/master/docs/getStarted.md)
* [Player API](https://github.com/jaames/ugomemo.js/blob/master/docs/playerAPI.md)

<!-- ### How does it work? -->

<!-- #### The Flipnote format (`.ppm`)

The .ppm format is an entirely custom format created by Nintendo for use within Flipnote Studio.

PPM animations have 2 layers per frame, each layer is a monochrome bitmap image where each pixel is represented in data by a single bit. Layers can use one of three colors; red, blue, or black/white, the latter being the inverse of the background color. As such, there can only ever be 3 colors per frame at most.  

To save space, layers are compressed in a variety of different ways. The [PPM Format Docs](https://github.com/pbsds/hatena-server/wiki/PPM-format) cover frame compression in detail, but the general idea was to avoid storing data for chunks of pixels that have the same value.

PPMs can have up to four audio tracks; a one-minute background track and 3 short "sound effects" that can be assigned to any frame. As with frame data, Nintendo wanted to use as little space as possible for storing audio so they decided to use ADCPM, which is really tiny and efficient audio format that uses only 4 bits per sample.

#### The decoder -->

### Credits

* Ugomemo.js is written and maintained by [James Daniel](https://github.com/jaames).
* PPM format reverse-engineering & documentaion: [bricklife](http://ugomemo.g.hatena.ne.jp/bricklife/20090307/1236391313), [mirai-iro](http://mirai-iro.hatenablog.jp/entry/20090116/ugomemo_ppm), [harimau_tigris](http://ugomemo.g.hatena.ne.jp/harimau_tigris), [steven](http://www.dsibrew.org/wiki/User:Steven), [yellows8](http://www.dsibrew.org/wiki/User:Yellows8).
* Identifying the PPM sound codec: Midmad from Hatena Haiku (no longer active), WDLMaster from the [HCS forum](https://hcs64.com/mboard/forum.php).
* [PBSDS](https://github.com/pbsds) for creating [Hatena Tools](https://github.com/pbsds/Hatenatools), and for giving me some notes regarding areas where the documentation fell short. 
* [JSA](https://github.com/thejsa) for performing packet captures of [Flipnote Hatena](http://flipnote.hatena.com/thankyou) before it shut down, without them reverse-engineering the app in general would have been a *pain*.
* [Austin Burk](https://sudomemo.net) for helping to debug my Python3 PPM parser (which I ported to JS for use in this project).
* [Nintendo](https://www.nintendo.com/) for creating the [Flipnote Studio](https://www.nintendo.co.uk/Games/Nintendo-DSiWare/Flipnote-Studio-263126.html) application and the PPM format it uses.
* [Hatena](http://www.hatena.ne.jp/) for creating [Flipnote Hatena](http://flipnote.hatena.com/thankyou), the now-defunct online service for sharing Flipnote Studio creations.