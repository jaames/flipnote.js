import wavEncoder from "encoders/wav";

export default class audioTrack {
  /**
  * Create a new audio player
  */
  constructor (id, type) {
    this.id = id;
    this.channelCount = 1;
    this.bitsPerSample = 16;
    this.sampleRate = 0;
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
    let wav = new wavEncoder(this.sampleRate * playbackRate, this.channelCount, this.bitsPerSample);
    wav.writeFrames(pcmData);
    this.url = window.URL.createObjectURL(wav.getBlob());
    // use the blob url for the audio element
    this.audio.src = this.url;
    this.active = true;
    this.playbackRate = playbackRate;
    this.length = pcmData.length;
  }

  get duration() {
    return this.audio.duration;
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
      this.length = null;
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