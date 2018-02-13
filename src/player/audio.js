export default class audioTrack {
  /**
  * Create a new audio player
  */
  constructor () {
    this.channelCount = 1;
    this.bitsPerSample = 16;
    this.sampleRate = 8192;
    this.audio = document.createElement("audio");
    this.active = false;
  }

  /**
  * Create a new audio player
  * @param {Int16Array} audioData - mono-channel 16-bit PCM audio
  */
  set(pcmData, playbackRate) {
    // wav header reference
    // http://www.topherlee.com/software/pcm-tut-wavformat.html
    var headerBuffer = new ArrayBuffer(44);
    var data = new DataView(headerBuffer);
    // "RIFF" indent
    data.setUint32(0, 1179011410, true);
    // filesize
    data.setUint32(4, headerBuffer.byteLength + pcmData.byteLength, true);
    // "WAVE" indent
    data.setUint32(8, 1163280727, true);
    // "fmt " section header
    data.setUint32(12, 544501094, true);
    // fmt section length
    data.setUint32(16, 16, true);
    // specify audio format is pcm (type 1)
    data.setUint16(20, 1, true);
    // number of audio channels
    data.setUint16(22, this.channelCount, true);
    // audio sample rate
    data.setUint32(24, this.sampleRate * playbackRate, true);
    // byterate = (sampleRate * bitsPerSample * channelCount) / 8
    data.setUint32(28, ((this.sampleRate * playbackRate) * this.bitsPerSample * this.channelCount) / 8, true);
    // blockalign = (bitsPerSample * channels) / 8
    data.setUint16(32, (this.bitsPerSample * this.channelCount) / 8, true);
    // bits per sample
    data.setUint16(34, this.bitsPerSample, true);
    // "data" section header
    data.setUint32(36, 1635017060, true);
    // data section length
    data.setUint32(40, pcmData.byteLength, true);
    this.url = window.URL.createObjectURL(new Blob([headerBuffer, pcmData.buffer], {type: "audio/wav"}));
    this.audio.src = this.url;
    this.active = true;
  }

  unset() {
    if (this.active) {
      window.URL.revokeObjectURL(this.url);
      this.audio.src = "";
      this.active = false;
    }
  }

  /**
  * Start audio playback
  * @param {number} offset - offset to begin playback at
  */
  start(offset) {
    if (this.active) {
      this.audio.currentTime = offset;
      this.audio.play();
    }
  }

  /**
  * Stop audio playback
  */
  stop() {
    if (this.active) {
      this.audio.pause();
    }
  }
}