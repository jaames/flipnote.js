import {
  parseSource,
  Flipnote,
  FlipnoteMeta,
} from '../parsers';

import {
  WavEncoder
} from '../encoders';

import {
  WebglCanvas,
  TextureType
} from '../webgl';

import { 
  WebAudioPlayer
} from '../webaudio';

interface PlayerEvents {
  [key: string]: Function[];
}

interface PlayerLayerVisibility {
  [key: number]: boolean;
}

interface PlayerState {
  noteType: 'PPM' | 'KWZ';
  isNoteOpen: boolean;
  hasPlaybackStarted: boolean;
  paused: boolean;
  frame: number,
  time: number,
  loop: boolean;
  volume: number;
  muted: boolean;
  layerVisibility: PlayerLayerVisibility;
  isSeeking: boolean;
  wasPlaying: boolean;
};

const saveData = (function () {
  var a = document.createElement("a");
  // document.body.appendChild(a);
  // a.style.display = "none";
  return function (blob: Blob, filename:string) {
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };
}());

/** flipnote player API, based on HTMLMediaElement (https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) */ 
export class Player {

  public canvas: WebglCanvas;
  public audio: WebAudioPlayer;
  public el: HTMLCanvasElement;
  public type: string;
  public note: Flipnote;
  public meta: FlipnoteMeta;
  public loop: boolean = false;
  public paused: boolean = true;
  public duration: number = 0;
  public layerVisibility: PlayerLayerVisibility;

  static defaultState: PlayerState = {
    noteType: null,
    isNoteOpen: false,
    paused: false,
    hasPlaybackStarted: false,
    frame: -1,
    time: -1,
    loop: false,
    volume: 1,
    muted: false,
    layerVisibility: {
      1: true,
      2: true,
      3: true
    },
    isSeeking: false,
    wasPlaying: false,
  };

  public state: PlayerState;
  
  private isOpen: boolean = false;
  private customPalette: {};
  private events: PlayerEvents = {};
  private _lastTick: number = -1;
  private _frame: number = -1;
  private _time: number = -1;
  private hasPlaybackStarted: boolean = false;
  private wasPlaying: boolean = false;
  private isSeeking: boolean = false;

  constructor(el: string | HTMLCanvasElement, width: number, height: number) {
    // if `el` is a string, use it to select an Element, else assume it's an element
    el = ('string' == typeof el) ? <HTMLCanvasElement>document.querySelector(el) : el;
    this.canvas = new WebglCanvas(el, width, height);
    this.audio = new WebAudioPlayer();
    this.el = this.canvas.el;
    this.customPalette = null;
    this.state = {...Player.defaultState};
  }

  saveWav() {
    const wav = WavEncoder.fromFlipnote(this.note);
    saveData(wav.getBlob(), 'audio.wav');
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
    return this.isOpen ? (this._time / this.duration) * 100 : 0;
  }

  set progress(value) {
    this.currentTime = this.duration * (value / 100);
  }

  get volume() {
    return this.audio.volume;
  }

  set volume(value) {
    this.audio.volume = value;
  }

  get muted() {
    // return this.audioTracks[3].audio.muted;
    return false;
  }

  set muted(value) {
    // for (let i = 0; i < this.audioTracks.length; i++) {
    //   this.audioTracks[i].audio.muted = value;
    // }
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

  private setState(newState: Partial<PlayerState>) {
    newState = {...this.state, ...newState};
    const oldState = this.state;
    this.emit('state:change');
  }

  public async open(source: any) {
    if (this.isOpen) this.close();
    return parseSource(source)
      .then((note: Flipnote) => this.load(note))
      .catch((err: any) => {
        this.emit('error', err);
        console.error('Error loading Flipnote:', err);
        throw 'Error loading Flipnote';
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
    this.hasPlaybackStarted = false;
    this.layerVisibility = {
      1: true,
      2: true,
      3: true
    };
    const sampleRate = this.audio.ctx.sampleRate;
    const pcm = note.getAudioMasterPcm(sampleRate);
    this.audio.setSamples(pcm, sampleRate);
    this.canvas.setInputSize(note.width, note.height);
    this.canvas.setLayerType(this.type === 'PPM' ? TextureType.Alpha : TextureType.LuminanceAlpha);
    this.setFrame(this.note.thumbFrameIndex);
    this._time = 0;
    this.emit('load');
  }

  private playAudio(): void {
    this.audio.playFrom(this.currentTime);
  }

  private stopAudio(): void {
    this.audio.stop();
  }

  toggleEq() {
    this.stopAudio();
    this.audio.useEq = !this.audio.useEq;
    this.playAudio();
  }

  private playbackLoop(timestamp: DOMHighResTimeStamp): void {
    if (this.paused) { // break loop if paused is set to true
      this.stopAudio();
      return null;
    }
    const time = timestamp / 1000;
    const progress = time - this._lastTick;
    if (progress > this.duration) {
      if (this.loop) {
        this.currentTime = 0;
        this.playAudio();
        this._lastTick = time;
        this.emit('playback:loop');
      } else {
        this.pause();
        this.emit('playback:end');
      }
    } else {
      this.currentTime = progress;
    }
    requestAnimationFrame(this.playbackLoop.bind(this));
  }

  public play(): void {
    (window as any).__activeFlipnotePlayer = this;
    if ((!this.isOpen) || (!this.paused))
      return null;
    if ((!this.hasPlaybackStarted) || ((!this.loop) && (this.currentFrame == this.frameCount - 1)))
      this._time = 0;
    this.paused = false;
    this.hasPlaybackStarted = true;
    this._lastTick = (performance.now() / 1000) - this.currentTime;
    this.playAudio();
    requestAnimationFrame(this.playbackLoop.bind(this));
    this.emit('playback:start');
  }

  public pause(): void {
    if ((!this.isOpen) || (this.paused)) return null;
    this.paused = true;
    this.stopAudio();
    this.emit('playback:stop');
  }

  public togglePlay(): void {
    if (this.paused) {
      this.play();
    } else {
      this.pause();
    }
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

  public resize(width: number, height: number): void {
    this.canvas.resize(width, height);
    this.forceUpdate();
  }

  public setLayerVisibility(layerIndex: number, value: boolean): void {
    this.layerVisibility[layerIndex] = value;
    this.forceUpdate();
  }

  public toggleLayerVisibility(layerIndex: number) : void {
    this.setLayerVisibility(layerIndex, !this.layerVisibility[layerIndex]);
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