import { parseSource, Flipnote, FlipnoteMeta, FlipnoteAudioTrack } from '../parsers/index';
import { AudioTrack } from './audio';
import { WebglCanvas, TextureType } from '../webgl/index';

interface PlayerEvents {
  [key: string]: Function[]
}

interface PlayerLayerVisibility {
  [key: number]: boolean;
}

/** flipnote player API, based on HTMLMediaElement (https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) */ 
export class Player {

  public canvas: WebglCanvas;
  public el: HTMLCanvasElement;
  public type: string;
  public note: Flipnote;
  public meta: FlipnoteMeta;
  public loop: boolean = false;
  public paused: boolean = true;
  public duration: number = 0;
  public layerVisibility: PlayerLayerVisibility;
  
  private isOpen: boolean = false;
  private customPalette: {};
  private events: PlayerEvents = {};
  private audioTracks: AudioTrack[];
  private seFlags: number[][];
  private _frame: number = -1;
  private _time: number = 0;
  private hasPlaybackStarted: boolean = false;
  private wasPlaying: boolean = false;
  private isSeeking: boolean = false;

  constructor(el: string | HTMLCanvasElement, width: number, height: number) {
    // if `el` is a string, use it to select an Element, else assume it's an element
    el = ('string' == typeof el) ? <HTMLCanvasElement>document.querySelector(el) : el;
    this.canvas = new WebglCanvas(el, width, height);
    this.el = this.canvas.el;
    this.customPalette = null;
    this.audioTracks = [
      new AudioTrack('se1'),
      new AudioTrack('se2'),
      new AudioTrack('se3'),
      new AudioTrack('se4'),
      new AudioTrack('bgm'),
    ];
  }

  get currentFrame() {
    return this._frame;
  }

  set currentFrame(frameIndex) {
    this.setFrame(frameIndex);
  }

  get currentTime() {
    return this.isOpen ? this._time : null;
  }

  set currentTime(value) {
    if ((this.isOpen) && (value <= this.duration) && (value >= 0)) {
      this.setFrame(Math.round(value / (1 / this.framerate)));
      this._time = value;
      this.emit('progress', this.progress);
    }
  }

  get progress() {
    return this.isOpen ? (this.currentTime / this.duration) * 100 : 0;
  }

  set progress(value) {
    this.currentTime = this.duration * (value / 100);
  }

  get volume() {
    return this.audioTracks[3].audio.volume;
  }

  set volume(value) {
    for (let i = 0; i < this.audioTracks.length; i++) {
      this.audioTracks[i].audio.volume = value;
    }
  }

  get muted() {
    return this.audioTracks[3].audio.muted;
  }

  set muted(value) {
    for (let i = 0; i < this.audioTracks.length; i++) {
      this.audioTracks[i].audio.muted = value;
    }
  }

  get framerate() {
    return this.note.framerate;
  }

  get frameCount() {
    return this.note.frameCount;
  }

  get frameSpeed() {
    return this.note.frameSpeed;
  }

  get audiorate() {
    return (1 / this.note.bgmrate) / (1 / this.note.framerate);
  }

  public async open(source: any) {
    if (this.isOpen) this.close();
    return parseSource(source)
      .then((note: Flipnote) => {
        this.load(note);
      })
      .catch((err: any) => {
        this.emit('error', err);
        console.error('Error loading Flipnote:', err);
      });
  }

  public close(): void {
    this.pause();
    this.note = null;
    this.isOpen = false;
    this.paused = true;
    this.loop = null;
    this.meta = null;
    this._frame = null;
    this._time = null;
    this.duration = null;
    this.loop = null;
    for (let i = 0; i < this.audioTracks.length; i++) {
      this.audioTracks[i].unset();
    }
    this.seFlags = null;
    this.hasPlaybackStarted = null;
    this.canvas.clear();
  }

  public load(note: Flipnote): void {
    this.note = note;
    this.meta = note.meta;
    this.type = note.type;
    this.loop = note.meta.loop;
    this.duration = (this.note.frameCount) * (1 / this.note.framerate);
    this.paused = true;
    this.isOpen = true;
    this.audioTracks.forEach(track => {
      track.sampleRate = note.sampleRate;
    });
    // if (this.customPalette) {
    //   this.setPalette(this.customPalette);
    // }
    const tracks = [FlipnoteAudioTrack.SE1, FlipnoteAudioTrack.SE2, FlipnoteAudioTrack.SE3, FlipnoteAudioTrack.SE4, FlipnoteAudioTrack.BGM];
    tracks.forEach((trackId, trackIndex) => {
      const trackRate = trackId === FlipnoteAudioTrack.BGM ? this.audiorate : 1;
      if (this.note.hasAudioTrack(trackId))
        this.audioTracks[trackIndex].set(this.note.decodeAudio(trackId), trackRate);
    })
    this.seFlags = this.note.decodeSoundFlags();
    this.hasPlaybackStarted = false;
    this.layerVisibility = {
      1: true,
      2: true,
      3: true
    };
    this.canvas.setInputSize(note.width, note.height);
    this.canvas.setLayerType(this.type === 'PPM' ? TextureType.Alpha : TextureType.LuminanceAlpha);
    this.setFrame(this.note.thumbFrameIndex);
    this._time = 0;
    this.emit('load');
  }

  public play(): void {
    if ((!this.isOpen) || (!this.paused)) return null;

    if ((!this.hasPlaybackStarted) || ((!this.loop) && (this.currentFrame == this.frameCount - 1))) {
      this._time = 0
    }

    this.paused = false;
    this.playBgm();

    let start = (performance.now() / 1000) - this.currentTime;

    const loop = (timestamp: DOMHighResTimeStamp): void => {
      if (this.paused) { // break loop if paused is set to true
        this.stopAudio();
        return null;
      }
      const time = timestamp / 1000;
      const progress = time - start;
      if (progress > this.duration) {
        if (this.loop) {
          this.currentTime = 0;
          this.playBgm();
          start = time;
          this.emit('playback:loop');
        } else {
          this.pause();
          this.emit('playback:end');
        }
      } else {
        this.currentTime = progress;
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    this.hasPlaybackStarted = true;
    this.emit('playback:start');
  }

  public pause(): void {
    if ((!this.isOpen) || (this.paused)) return null;
    this.paused = true;
    this.stopAudio();
    this.emit('playback:stop');
  }

  public setFrame(frameIndex: number): void {
    if ((this.isOpen) && (frameIndex !== this.currentFrame)) {
      // clamp frame index
      frameIndex = Math.max(0, Math.min(Math.floor(frameIndex), this.frameCount - 1));
      this.drawFrame(frameIndex);
      this._frame = frameIndex;
      if (this.paused) {
        this._time = frameIndex * (1 / this.framerate);
        this.emit('progress', this.progress);
      } else {
        this.playFrameSe(frameIndex);
      }
      this.emit('frame:update', this.currentFrame);
    }
  }

  public nextFrame(): void {
    if ((this.loop) && (this.currentFrame >= this.frameCount -1)) {
      this.currentFrame = 0;
    } else {
      this.currentFrame += 1;
    }
  }

  public prevFrame(): void {
    if ((this.loop) && (this.currentFrame <= 0)) {
      this.currentFrame = this.frameCount - 1;
    } else {
      this.currentFrame -= 1;
    }
  }

  public lastFrame(): void {
    this.currentFrame = this.frameCount - 1;
  }

  public firstFrame(): void {
    this.currentFrame = 0;
  }

  public thumbnailFrame(): void {
    this.currentFrame = this.note.thumbFrameIndex;
  }

  public startSeek(): void {
    if (!this.isSeeking) {
      this.wasPlaying = !this.paused;
      this.pause();
      this.isSeeking = true;
    }
  }

  public seek(progress: number): void {
    if (this.isSeeking) {
      this.progress = progress;
    }
  }

  public endSeek(): void {
    if ((this.isSeeking) && (this.wasPlaying === true)) {
      this.play();
    }
    this.wasPlaying = false;
    this.isSeeking = false;
  }

  public drawFrame(frameIndex: number): void {
    const width = this.note.width;
    const height = this.note.height;
    const colors = this.note.getFramePalette(frameIndex);
    const layerBuffers = this.note.decodeFrame(frameIndex);
    this.canvas.setPaperColor(colors[0]);
    this.canvas.clear();
    if (this.note.type === 'PPM') {
      if (this.layerVisibility[2]) {
        this.canvas.drawLayer(layerBuffers[1], width, height, colors[2], [0,0,0,0]);
      }
      if (this.layerVisibility[1]) {
        this.canvas.drawLayer(layerBuffers[0], width, height, colors[1], [0,0,0,0]);
      }
    } else if (this.note.type === 'KWZ') {
      // loop through each layer
      this.note.getLayerOrder(frameIndex).forEach((layerIndex: number) => {
        // only draw layer if it's visible
        if (this.layerVisibility[layerIndex + 1]) {
          this.canvas.drawLayer(layerBuffers[layerIndex], width, height, colors[layerIndex * 2 + 1], colors[layerIndex * 2 + 2]);
        }
      });
    }
  }

  public forceUpdate(): void {
    if (this.isOpen) {
      this.drawFrame(this.currentFrame);
    }
  }

  private playFrameSe(frameIndex: number): void {
    var flags = this.seFlags[frameIndex];
    for (let i = 0; i < flags.length; i++) {
      if (flags[i] && this.audioTracks[i].isActive) this.audioTracks[i].start();
    }
  }

  private playBgm(): void {
    this.audioTracks[4].start(this.currentTime);
  }

  private stopAudio(): void {
    for (let i = 0; i < this.audioTracks.length; i++) {
      this.audioTracks[i].stop();
    }
  }

  public resize(width: number, height: number): void {
    this.canvas.resize(width, height);
    this.forceUpdate();
  }

  public setLayerVisibility(layerIndex: number, value: boolean): void {
    this.layerVisibility[layerIndex] = value;
    this.forceUpdate();
  }

  // public setPalette(palette: any): void {
  //   this.customPalette = palette;
  //   this.note.palette = palette;
  //   this.forceUpdate();
  // }

  public on(eventType: string, callback: Function): void {
    const events = this.events;
    (events[eventType] || (events[eventType] = [])).push(callback);
  }

  public off(eventType: string, callback: Function): void {
    const callbackList = this.events[eventType];
    if (callbackList) callbackList.splice(callbackList.indexOf(callback), 1);
  }

  public emit(eventType: string, ...args: any): void {
    var callbackList = this.events[eventType] || [];
    for (var i = 0; i < callbackList.length; i++) {
      callbackList[i].apply(null, args); 
    }
  }

  public clearEvents(): void {
    this.events = {};
  }

  public destroy(): void {
    this.close();
    this.canvas.destroy();
  }

}