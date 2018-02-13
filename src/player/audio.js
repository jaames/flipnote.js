// Wrapper around JavaScript's audio API since it's a bit of a pain to deal with
export default class audioTrack {
  /**
  * Create a new audio player
  * @param {Float32Array} audioData - mono-channel floating 32-bit PCM audio
  */
  constructor (audioData, duration, playbackRate) {
    playbackRate = playbackRate || 1;
    var ctx = new AudioContext();
    var audioBuffer = ctx.createBuffer(1, duration * playbackRate * 8192, 8192);
    audioBuffer.copyToChannel(audioData, 0);
    this.audioBuffer = audioBuffer;
    this.source = null;
    this.paused = true;
    this.ctx = ctx;
    this.playbackRate = 1;
  }

  /**
  * Start audio playback
  * @param {number} offset - offset to begin playback at
  */
  start(offset) {
    this.source = this.ctx.createBufferSource();
    this.source.buffer = this.audioBuffer;
    this.source.connect(this.ctx.destination);
    this.source.onended = e => {
      this.paused = true;
    };
    this.source.playbackRate.value = this.playbackRate;
    this.source.start(0, offset);
    this.paused = false;
  }

  /**
  * Stop audio playback
  */
  stop() {
    if (this.source) this.source.stop();
    this.source = null;
    this.paused = true;
  }

  /**
  * Destroy audio track
  */
  destroy() {
    this.stop();
    this.ctx.close();
  }
}