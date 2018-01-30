# flipnote.js

[Flipnote Studio](http://flipnotestudio.nintendo.com/) is a DSiWare application released for the Nintendo DSi console in 2008. It lets users create simple flipbook-style animations ("Flipnotes") with the console's touchscreen or camera. Until 2013, Flipnotes could be shared online on a service called [Flipnote Hatena](flipnote.hatena.com).

This project's goal is to allow for entirely browser-based parsing and playback of Flipnote Studio's animation format, `.ppm`. It started mostly as a way to challenge myself to learn [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API), with no real purpose in mind other than making something of a tribute to an app that I spent a *lot* of my early teens playing with. 

I hope that maybe in the long term it will serve some use in archiving Flipnote animations, epecially given that now there's no legitimate way to get Flipnote Studio unless you have a DSi with it already installed.

### Features

* Full browser-based Flipnote (PPM) playback, with perfect accuracy for both frames and audio
* Metadata parsing
* Player API based on the HTML5 Video and Audio APIs
* 17KB minified, 5KB minified + gzipped

### Demo

For now, there's an old [work-in-progress video on my twitter account](https://twitter.com/rakujira/status/950364766031306753) (any glitchyness shown has been fixed since). I'm currently working on implementing this project into a Flipnote player web app to further demonstrate it, so please bear with me! 

### Documentation

* [Getting Started](https://github.com/jaames/flipnote.js/blob/master/docs/getStarted.md)
* [Player API](https://github.com/jaames/flipnote.js/blob/master/docs/playerAPI.md)

### How does it work?

#### The Flipnote format (`.ppm`)

The PPM format is an entirely custom-made by Nintendo for use within Flipnote Studio. Its purpose is to store Flipnotes created within the app, which comprise of animation frames, audio, and metadata (author name, timestamp, etc).

PPM animations have 2 layers per frame, each layer is a monochrome bitmap image where each pixel is represented in data by a single bit. Layers can use one of three colors; red, blue, or black/white, the latter being the inverse of the background color. As such, there is a maximum of 3 colors per frame.  

To save space (the Nintendo DSi doesn't have much internal memory) layers are compressed in a variety of different ways. The [PPM Format Docs](https://github.com/pbsds/hatena-server/wiki/PPM-format) cover frame compression in more detail, but the general idea was to avoid storing data for chunks of pixels that have the same value. That said, all the PPM documentation I've come across so far seems to omit noting that there are difference-based frames, where both layers need to be merged with the previous frame to produce a complete image, this is done by XORing each pixel in each layer. Sometimes a bitflag indicates that the previous frame also needs to be translated before it is merged. In such a case, two additional 8-bit signed integers after the flag byte provide the x and y values.

PPMs can also have up to four audio tracks; a one minute long background track and 3 short "sound effects" that can be assigned to any frame. Nintendo went with [ADCPM](https://en.wikipedia.org/wiki/Adaptive_differential_pulse-code_modulation) for storing audio data because, again, they wanted to use as little space as possible.

#### The decoder

Frame decoding ([source](https://github.com/jaames/flipnote.js/blob/master/src/decoder/index.js#L296)) is easy enough to implement, besides the frame merging method mentioned above it's documented pretty well. One thing I really wanted to avoid predecoding frames, though, as it could cause JavaScript execution to lock up for a while and memory usage wouldn't be too great. 

The general process looks like this:
 
* Decompress each layer into an array where each item = one pixel of the layer
* If necessary, merge with the previous frame by XORing the current layers with the ones from the previous frame
* Merge layers together and feed the result into a [HTML canvas element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement) to produce the final image

Flipnote Studio has 8 framerate presets, the fastest being 30 frames per second. Hitting that benchmark is necessary for providing accurate real-time playback so it was important to avoid peformance bottlenecks wherever possible. As such, the frame decoder employs a couple of tricks:

* Each layer is decompressed and stored into an [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) buffer, these provide numerous benefits besides just being more memory-efficient than standard arrays.
* Rather than creating new layer buffers every time a frame is decoded, 4 layer buffers (2 for current frame layers, 2 for previous frame layers) are reused. 
* Since we're using Uint8Array buffers, the [`set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/set) method can be used to copy one buffer to another, and the [`fill`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/fill) method can be used to quickly clear a buffer or set groups of pixels to the same value.
* Layers have to be merged by looping through each pixel and XORing against it the previous layer. It's slightly more efficient to loop through both layers' pixels in one go.
* Merging the layers together and pushing the result to a canvas with [`putImageData`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/putImageData) was proving to be a major bottleneck, so after some wrangling I ended up trying [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) instead. Layers are already Uint8Arrays so we can bind them to WebGL texture buffers easily, and for our drawing surface we can use a quad that fills the whole canvas. Then a [fragment shader](https://github.com/jaames/flipnote.js/blob/master/src/webgl/fragmentShader.glsl.js) takes both layer textures and combines them on the GPU.

Audio was a little tricky. In my Python PPM decoder I was just able to rely on the [audioop module](https://docs.python.org/3.6/library/audioop.html#audioop.adpcm2lin) to decode ADPCM, but JavaScript doesn't have any out-of-the-box way to process ADPCM like that. The [AudioBuffer](https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer) API does support PCM audio though, so providing full support for Flipnote audio was just a matter of semi-porting an ADPCM to PCM converter from C to JavaScript. You can see the final audio decoder [here](https://github.com/jaames/flipnote.js/blob/master/src/decoder/adpcm.js).

### Authors

* **[James Daniel](https://github.com/jaames)**

### License

This project is licensed under the MIT License - see the LICENSE.md file for details.

### Acknowledgments

* PPM format reverse-engineering & documentaion: [bricklife](http://ugomemo.g.hatena.ne.jp/bricklife/20090307/1236391313), [mirai-iro](http://mirai-iro.hatenablog.jp/entry/20090116/ugomemo_ppm), [harimau_tigris](http://ugomemo.g.hatena.ne.jp/harimau_tigris), [steven](http://www.dsibrew.org/wiki/User:Steven), [yellows8](http://www.dsibrew.org/wiki/User:Yellows8) and [PBSDS](https://github.com/pbsds).
* Identifying the PPM sound codec: Midmad from Hatena Haiku (no longer active) and WDLMaster from the [HCS forum](https://hcs64.com/mboard/forum.php).
* [PBSDS](https://github.com/pbsds) for creating [Hatena Tools](https://github.com/pbsds/Hatenatools), and for giving me some notes regarding areas where the documentation fell short. 
* Stichting Mathematisch Centrum for writing this [ADPCM to PCM converter in C](http://www.cs.columbia.edu/~gskc/Code/AdvancedInternetServices/SoundNoiseRatio/dvi_adpcm.c) which I semi-ported to JS to handle audio.
* [Austin Burk](https://sudomemo.net) and [JoshuaDoes](https://github.com/joshuadoes) for helping to debug my Python3 PPM parser (which I used as a reference for the JS decoder).
* [JSA](https://github.com/thejsa) for performing packet captures of [Flipnote Hatena](http://flipnote.hatena.com/thankyou) before it shut down, without them reverse-engineering the app in general would have been a *huge* pain.
* [Nintendo](https://www.nintendo.com/) for creating the Flipnote Studio application.
* [Hatena](http://www.hatena.ne.jp/) for creating Flipnote Hatena, the now-defunct online service for sharing Flipnote Studio creations.
