import { isBrowser } from '../utils';

/** @internal */
const _AudioContext = (function() {
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

  /** Audio context, see {@link https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext | BaseAudioContext} */
  public ctx: BaseAudioContext;
  /** Audio sample rate */
  public sampleRate: number;
  /** Whether the audio is being run through an equalizer or not */
  public useEq: boolean = false
  /** Equalizer settings. Credit to {@link https://www.sudomemo.net/ | Sudomemo} */
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

  private _volume: number = 1;
  private buffer: AudioBuffer;
  private gainNode: GainNode;
  private source: AudioBufferSourceNode;

  constructor() {
    if (!isBrowser) {
      throw new Error('The WebAudio player is only available in browser environments');
    }
    this.ctx = new _AudioContext();
  }

  /** Sets the audio output volume */
  set volume(value: number) {
    this.setVolume(value);
  }

  get volume() {
    return this._volume;
  }

  /**
   * Set the audio buffer to play
   * @param inputBuffer 
   * @param sampleRate - For best results, this should be a multiple of 16364
   */
  setBuffer(inputBuffer: PcmAudioBuffer, sampleRate: number) {
    const numSamples = inputBuffer.length;
    const audioBuffer = this.ctx.createBuffer(1, numSamples, sampleRate);
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
    const { ctx, eqSettings } = this;
    let lastNode = inNode;
    eqSettings.forEach(([ frequency, gain ], index) => {
      let node = ctx.createBiquadFilter();
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
    const { ctx } = this;
    const source = ctx.createBufferSource();
    source.buffer = this.buffer;
    const gainNode = ctx.createGain();
    if (this.useEq) {
      const eq = this.connectEqNodesTo(source);
      eq.connect(gainNode);
    }
    else
      source.connect(gainNode);
    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    this.source = source;
    this.gainNode = gainNode;
    this.setVolume(this._volume);
  }

  /**
   * Sets the audio volume level
   * @param value - range is 0 to 1
   */
  setVolume(value: number) {
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
  playFrom(currentTime: number) {
    this.initNodes();
    this.source.start(0, currentTime);
  }

  /**
   * Stops the audio playback
   */
  stop() {
    this.source.stop(0);
  }
}