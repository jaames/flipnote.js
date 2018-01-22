export default class memoAudio {
  constructor (audioData) {
    var ctx = new AudioContext();
    var audioBuffer = ctx.createBuffer(1, audioData.length, 8192);
    var channel = audioBuffer.copyToChannel(audioData, 0);
    var source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    this.ctx = ctx;
    this.source = source;
  }

  set loop(value) {
    this.source.loop = value;
  }

  get loop() {
    return this.source.loop;
  }

  set playbackRate(value) {
    this.source.playbackRate.value = value;
  }

  get playbackRate() {
    return this.source.playbackRate.value;
  }

  get currentTime() {
    return this.ctx.currentTime;
  }

  play(offset) {
    this.source.start(0, offset);
  }

  plause() {
    this.source.stop();
  }
}