# ugomemo.js
Real-time, browser-based playback of Flipnote Studio's .ppm animation format, powered by JavaScript and WebGL.

### Features

* Full support for Flipnote playback, with both frames and audio
* Flipnote metadata parsing
* Player API based on the HTML Video and Audio APIs
* 17KB minified, 5KB minified + gzipped

### Demo

For now, there's an old [work-in-progress video on my twitter account](https://twitter.com/rakujira/status/950364766031306753) (any glitchyness shown has been fixed since). I'm currently working on implementing this project into a Flipnote player web app to further demonstrate it, so please bear with me! 

<!-- ### How does it work? -->

<!-- #### The Flipnote format (`.ppm`)

The .ppm format is an entirely custom format created by Nintendo for use within Flipnote Studio.

PPM animations have 2 layers per frame, each layer is a monochrome bitmap image where each pixel is represented in data by a single bit. Layers can use one of three colors; red, blue, or black/white, the latter being the inverse of the background color. As such, there can only ever be 3 colors per frame at most.  

To save space, layers are compressed in a variety of different ways. The [PPM Format Docs](https://github.com/pbsds/hatena-server/wiki/PPM-format) cover frame compression in detail, but the general idea was to avoid storing data for chunks of pixels that have the same value.

PPMs can have up to four audio tracks; a one-minute background track and 3 short "sound effects" that can be assigned to any frame. As with frame data, Nintendo wanted to use as little space as possible for storing audio so they decided to use ADCPM, which is really tiny and efficient audio format that uses only 4 bits per sample.

#### The decode -->