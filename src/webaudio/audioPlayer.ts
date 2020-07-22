const _AudioContext = (window.AudioContext || (window as any).webkitAudioContext);

export type PcmAudioBuffer = Int16Array | Float32Array;

export class WebAudioPlayer {

  public ctx: BaseAudioContext;
  public sampleRate: number;

  protected buffer: AudioBuffer;
  protected source: AudioBufferSourceNode;

  constructor(sampleData: PcmAudioBuffer, sampleRate: number) {
    this.ctx = new _AudioContext();
    this.setSamples(sampleData, sampleRate);
  }

  setSamples(sampleData: PcmAudioBuffer, sampleRate: number) {
    const numSamples = sampleData.length;
    const audioBuffer = this.ctx.createBuffer(1, numSamples, sampleRate);
    const channelData = audioBuffer.getChannelData(0);
    if (sampleData instanceof Float32Array) {
      channelData.set(sampleData, 0);
    }
    else if (sampleData instanceof Int16Array) {
      for (let i = 0; i < numSamples; i++) {
        channelData[i] = sampleData[i] / 32767;
      }
    }
    this.buffer = audioBuffer;
    this.sampleRate = sampleRate;
  }

  stop() {
    this.source.stop(0);
  }

  playFrom(currentTime: number) {
    const source = this.ctx.createBufferSource();
    source.buffer = this.buffer;
    source.connect(this.ctx.destination, 0, 0);
    this.source = source;
    this.source.start(0, currentTime);
  }

}