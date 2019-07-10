import { WavEncoder } from '../encoders/wav';

export class AudioTrack {

  public id: string;
  public audio: HTMLAudioElement;
  public playbackRate: number = 1;
  public sampleRate: number;
  public length: number;
  public isActive: boolean;

  private channelCount: number;
  private bitsPerSample: number;
  private url: string;

  constructor (id: string) {
    this.id = id;
    this.channelCount = 1;
    this.bitsPerSample = 16;
    this.sampleRate = 0;
    this.audio = document.createElement('audio');
    this.audio.preload = 'auto';
    this.isActive = false;
  }

  public set(pcmData: Int16Array, playbackRate: number): void {
    // the HTML5 audio element supports PCM audio if it's in a WAV wrapper
    let wav = new WavEncoder(this.sampleRate * playbackRate, this.channelCount, this.bitsPerSample);
    wav.writeFrames(pcmData);
    this.url = window.URL.createObjectURL(wav.getBlob());
    // use the blob url for the audio element
    this.audio.src = this.url;
    this.isActive = true;
    this.playbackRate = playbackRate;
    this.length = pcmData.length;
  }

  get duration() {
    return this.audio.duration;
  }

  public unset(): void {
    if (this.isActive) {
      window.URL.revokeObjectURL(this.url);
      this.audio.src = '';
      this.audio.load();
      this.isActive = false;
      this.playbackRate = 1;
      this.length = null;
    }
  }

  public start(offset = 0): void {
    if (this.isActive) {
      this.audio.currentTime = offset;
      this.audio.play();
    }
  }

  public stop(): void {
    if (this.isActive) {
      this.audio.pause();
    }
  }
}