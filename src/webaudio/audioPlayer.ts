const _AudioContext = (window.AudioContext || (window as any).webkitAudioContext);

export type PcmAudioBuffer = Int16Array | Float32Array;

export class WebAudioPlayer {

  public ctx: BaseAudioContext;
  public sampleRate: number;
  public useEq: boolean = false;
  // Thanks to Sudomemo for the default settings
  public eqSettings: [number, number][] = [
    [31.25,4.1],
    [62.5,1.2],
    [125,0],
    [250,-4.1],
    [500,-2.3],
    [1000,0.5],
    [2000,6.5],
    [8000,5.1],
    [16000,5.1]
  ];

  private _volume: number = 1;
  private buffer: AudioBuffer;
  private gainNode: GainNode;
  private source: AudioBufferSourceNode;

  constructor() {
    this.ctx = new _AudioContext();
  }

  set volume(value: number) {
    this.setVolume(value);
  }

  get volume() {
    return this._volume;
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

  private connectEqNodesTo(inNode: AudioNode) {
    const { ctx, eqSettings } = this;
    let lastNode = inNode;
    eqSettings.forEach(([ frequency, gain ], index) => {
      let node = ctx.createBiquadFilter();
      if (index === 0)
        node.type = 'lowshelf';
      else if (index === eqSettings.length - 1)
        node.type = 'highshelf';
      else
        node.type = 'peaking';
      node.frequency.value = frequency;
      node.gain.value = gain;
      lastNode.connect(node);
      lastNode = node;
    });
    return lastNode;
  }

  private initNodes() {
    const { ctx } = this;
    const source = ctx.createBufferSource();
    source.buffer = this.buffer;
    const gainNode = ctx.createGain();
    if (this.useEq) {
      const eq = this.connectEqNodesTo(source);
      eq.connect(gainNode);
    } else {
      source.connect(gainNode); 
    }
    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    this.source = source;
    this.gainNode = gainNode;
    this.setVolume(this._volume);
  }

  setVolume(value: number) {
    this._volume = value;
    if (this.gainNode) {
      // human perception of loudness is logarithmic, rather than linear
      // https://www.dr-lex.be/info-stuff/volumecontrols.html
      this.gainNode.gain.value = Math.pow(value, 2);
    }
  }

  stop() {
    this.source.stop(0);
  }

  playFrom(currentTime: number) {
    this.initNodes();
    this.source.start(0, currentTime);
  }

}