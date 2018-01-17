export default class memoAudio {
  constructor (audioData) {
    var ctx = new AudioContext();
    var audioBuffer = ctx.createBuffer(1, audioData.length, 8192);
    var channel = audioBuffer.copyToChannel(audioData, 0);
    var source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    this.source = source;
  }

  set playbackRate(value) {
    this.source.playbackRate.value = value;
  }

  get playbackRate() {
    return this.source.playbackRate.value;
  }

  play(position) {
    this.source.start(position);
  }

  plause() {
    this.source.stop();
  }
}