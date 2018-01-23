export default class memoAudio {
  constructor (audioData) {
    var ctx = new AudioContext();
    var audioBuffer = ctx.createBuffer(1, audioData.length, 8192);
    var channel = audioBuffer.copyToChannel(audioData, 0);
    this.audioBuffer = audioBuffer;
    this.source = null;
    this.paused = true;
    this.ctx = ctx;
    this.playbackRate = 1;
  }

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

  stop() {
    if (this.source) this.source.stop();
    this.source = null;
    this.paused = true;
  }
}