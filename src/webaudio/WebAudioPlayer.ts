import { isBrowser, assertBrowserEnv } from '../utils';

/** @internal */
const _AudioContext = (() => {
  if (isBrowser)
    return (window.AudioContext || (window as any).webkitAudioContext);
  return null;
})();

/** PCM audio buffer types. Supports s16_le, or float32_le with a range of -1.0 to 1.0 */
export type PcmAudioBuffer = Int16Array | Float32Array;

/**
 * Audio player built around the {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API | Web Audio API}
 * 
 * Capable of playing PCM streams, with volume adjustment and an optional equalizer. Only available in browser contexts
 */
export class WebAudioPlayer {

  /** Audio context, see {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioContext | AudioContext} */
  public ctx: AudioContext;
  /** Audio sample rate */
  public sampleRate: number;
  /** Whether the audio is being run through an equalizer or not */
  public useEq = false;
  /** Whether to connect the output to an audio analyser (see {@link analyser}) */
  public useAnalyser = false;
  /** Default equalizer settings. Credit to {@link https://www.sudomemo.net/ | Sudomemo} for these */
  public eqSettings: [number, number][] = [
    [31.25, 4.1],
    [62.5, 1.2],
    [125, 0],
    [250, -4.1],
    [500, -2.3],
    [1000, 0.5],
    [2000, 6.5],
    [8000, 5.1],
    [16000, 5.1]
  ];
  /** If enabled, provides audio analysis for visualisation etc - https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API */
  public analyser: AnalyserNode;

  private _volume = 1;
  private _loop = false;
  private nodeRefs: AudioNode[] = [];
  private buffer: AudioBuffer;
  private gainNode: GainNode;
  private source: AudioBufferSourceNode;

  constructor() {
    assertBrowserEnv();
  }

  /** The audio output volume. Range is 0 to 1 */
  set volume(value: number) {
    this.setVolume(value);
  }

  get volume() {
    return this._volume;
  }

  /** Whether the audio should loop after it has ended */
  set loop(value: boolean) {
    this._loop = value;
    if (this.source)
      this.source.loop = value;
  }

  get loop() {
    return this._loop;
  }

  private getCtx() {
    if (!this.ctx)
      this.ctx = new _AudioContext();
    return this.ctx;
  }

  /**
   * Set the audio buffer to play
   * @param inputBuffer 
   * @param sampleRate - For best results, this should be a multiple of 16364
   */
  setBuffer(inputBuffer: PcmAudioBuffer, sampleRate: number) {
    const ctx = this.getCtx();
    const numSamples = inputBuffer.length;
    const audioBuffer = ctx.createBuffer(1, numSamples, sampleRate);
    const channelData = audioBuffer.getChannelData(0);
    if (inputBuffer instanceof Float32Array)
      channelData.set(inputBuffer, 0);
    else if (inputBuffer instanceof Int16Array) {
      for (let i = 0; i < numSamples; i++) {
        channelData[i] = inputBuffer[i] / 32768;
      }
    }
    this.buffer = audioBuffer;
    this.sampleRate = sampleRate;
  }

  private connectEqNodesTo(inNode: AudioNode) {
    const ctx = this.getCtx();
    const eqSettings = this.eqSettings;
    let lastNode = inNode;
    eqSettings.forEach(([ frequency, gain ], index) => {
      const node = ctx.createBiquadFilter();
      this.nodeRefs.push(node);
      node.frequency.value = frequency;
      node.gain.value = gain;
      if (index === 0)
        node.type = 'lowshelf';
      else if (index === eqSettings.length - 1)
        node.type = 'highshelf';
      else
        node.type = 'peaking';
      lastNode.connect(node);
      lastNode = node;
    });
    return lastNode;
  }

  private initNodes() {
    const ctx = this.getCtx();
    this.nodeRefs = [];
    const source = ctx.createBufferSource();
    this.nodeRefs.push(source);
    source.buffer = this.buffer;

    const gainNode = ctx.createGain();
    this.nodeRefs.push(gainNode);

    if (this.useEq) {
      const eq = this.connectEqNodesTo(source);
      eq.connect(gainNode);
    }
    else {
      source.connect(gainNode);
    }

    if (this.useAnalyser) {
      const analyserNode = ctx.createAnalyser();
      this.nodeRefs.push(analyserNode);
      this.analyser = analyserNode;
      gainNode.connect(analyserNode);
      analyserNode.connect(ctx.destination);
    }
    else {
      this.analyser = undefined;
      gainNode.connect(ctx.destination);
    }

    this.source = source;
    this.gainNode = gainNode;
    this.setVolume(this._volume);
  }
  
  public setAnalyserEnabled(on: boolean) {
    this.useAnalyser = on;
    this.initNodes();
  }

  /**
   * Sets the audio volume level
   * @param value - range is 0 to 1
   */
  public setVolume(value: number) {
    this._volume = value;
    if (this.gainNode) {
      // human perception of loudness is logarithmic, rather than linear
      // https://www.dr-lex.be/info-stuff/volumecontrols.html
      this.gainNode.gain.value = Math.pow(value, 2);
    }
  }

  /**
   * Begin playback from a specific point
   * 
   * Note that the WebAudioPlayer doesn't keep track of audio playback itself. We rely on the {@link Player} API for that.
   * @param currentTime initial playback position, in seconds
   */
  public playFrom(currentTime: number) {
    this.initNodes();
    this.source.loop = this._loop;
    this.source.start(0, currentTime);
  }

  /**
   * Stops the audio playback
   */
  public stop() {
    if (this.source)
      this.source.stop(0);
  }

  /**
   * Frees any resources used by this canvas instance
   */
  public async destroy() {
    this.stop();
    const ctx = this.getCtx();
    this.nodeRefs.forEach(node => node.disconnect());
    this.nodeRefs = [];
    this.analyser = undefined;
    if (ctx.state !== 'closed' && typeof ctx.close === 'function')
      await ctx.close();
    this.buffer = null;
  }
}