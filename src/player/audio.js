export default class audioTrack {
  /**
  * Create a new audio player
  */
  constructor (id) {
    this.id = id;
    this.channelCount = 1;
    this.bitsPerSample = 16;
    this.sampleRate = 8192;
    this.playbackRate = 1;
    this.audio = document.createElement("audio");
    this.audio.preload = true;
    this.active = false;
  }

  /**
  * Set the audio track
  * @param {Int16Array} pcmData - mono-channel 16-bit PCM audio
  * @param {number} playbackRate - audio playback rate (1 = default)
  */
  set(pcmData, playbackRate) {
    // the HTML5 audio element supports PCM audio if it's in a WAV wrapper
    // to do this we write a WAV header and prepend it to the raw PCM data
    // WAV header reference: http://www.topherlee.com/software/pcm-tut-wavformat.html
    var header = new DataView(new ArrayBuffer(44));
    // "RIFF" indent
    header.setUint32(0, 1179011410, true);
    // filesize
    header.setUint32(4, header.byteLength + pcmData.byteLength, true);
    // "WAVE" indent
    header.setUint32(8, 1163280727, true);
    // "fmt " section header
    header.setUint32(12, 544501094, true);
    // fmt section length
    header.setUint32(16, 16, true);
    // specify audio format is pcm (type 1)
    header.setUint16(20, 1, true);
    // number of audio channels
    header.setUint16(22, this.channelCount, true);
    // audio sample rate
    header.setUint32(24, this.sampleRate * playbackRate, true);
    // byterate = (sampleRate * bitsPerSample * channelCount) / 8
    header.setUint32(28, ((this.sampleRate * playbackRate) * this.bitsPerSample * this.channelCount) / 8, true);
    // blockalign = (bitsPerSample * channels) / 8
    header.setUint16(32, (this.bitsPerSample * this.channelCount) / 8, true);
    // bits per sample
    header.setUint16(34, this.bitsPerSample, true);
    // "data" section header
    header.setUint32(36, 1635017060, true);
    // data section length
    header.setUint32(40, pcmData.byteLength, true);
    // create blob from joining the wav header and pcm data
    this.url = window.URL.createObjectURL(new Blob([header.buffer, pcmData.buffer], {type: "audio/wav"}));
    // use the blob url for the audio element
    this.audio.src = this.url;
    this.active = true;
    this.playbackRate = playbackRate;
  }

  /**
  * Clear the audio track
  */
  unset() {
    if (this.active) {
      window.URL.revokeObjectURL(this.url);
      this.audio.src = "";
      this.audio.load();
      this.active = false;
      this.playbackRate = 1;
    }
  }

  /**
  * Start audio playback
  * @param {number} offset - offset to begin playback at
  */
  start(offset) {
    if (this.active) {
      this.audio.currentTime = offset || 0;
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