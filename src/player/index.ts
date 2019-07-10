import { parseSource, Flipnote, FlipnoteMeta } from '../parser';
import { AudioTrack } from './audio';
import { WebglCanvas, FilterType, DisplayMode } from '../webgl/canvas';

interface PlayerEvents {
  [key: string]: Function[]
}

interface PlayerLayerVisibility {
  [key: number]: boolean;
}

/** flipnote player API, based on HTMLMediaElement (https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) */ 
export class Player {

  public canvas: WebglCanvas;
  public type: string;
  public note: Flipnote;
  public meta: FlipnoteMeta;
  public loop: boolean = false;
  public paused: boolean = true;
  public smoothRendering: boolean = false;
  public layerVisibility: PlayerLayerVisibility;
  
  private isOpen: boolean = false;
  private events: PlayerEvents = {};
  private audioTracks: AudioTrack[];
  private seFlags: number[][];
  private frame: number = 0;
  private playbackLoop: number = null;
  private hasPlaybackStarted: boolean = false;

  constructor(el: string | HTMLCanvasElement, width: number, height: number) {
    // if `el` is a string, use it to select an Element, else assume it's an element
    el = ('string' == typeof el) ? <HTMLCanvasElement>document.querySelector(el) : el;
    this.canvas = new WebglCanvas(el, width, height);
    // this.customPalette = null;
    this.audioTracks = [
      new AudioTrack('se1'),
      new AudioTrack('se2'),
      new AudioTrack('se3'),
      new AudioTrack('se4'),
      new AudioTrack('bgm'),
    ];
  }

  get currentFrame() {
    return this.frame;
  }

  set currentFrame(index) {
    this.setFrame(index);
  }

  get currentTime() {
    return this.isOpen ? this.currentFrame * (1 / this.framerate) : null;
  }

  set currentTime(value) {
    if ((this.isOpen) && (value < this.duration) && (value > 0)) {
      this.setFrame(Math.round(value / (1 / this.framerate)));
    }
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

  get duration() {
    return this.isOpen ? this.frameCount * (1 / this.framerate) : null;
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
      .then((note) => {
        this.load(note);
      })
      .catch((err) => {
        console.error('Error loading Flipnote:', err);
      });
  }

  private load(note: Flipnote) {
    this.note = note;
    this.meta = note.meta;
    this.type = note.type;
    this.loop = note.meta.loop;
    this.paused = true;
    this.isOpen = true;
    this.audioTracks.forEach(track => {
      track.sampleRate = note.sampleRate;
    });
    // if (this.customPalette) {
    //   this.setPalette(this.customPalette);
    // }
    if (this.note.hasAudioTrack(1)) this.audioTracks[0].set(this.note.decodeAudio('se1'), 1);
    if (this.note.hasAudioTrack(2)) this.audioTracks[1].set(this.note.decodeAudio('se2'), 1);
    if (this.note.hasAudioTrack(3)) this.audioTracks[2].set(this.note.decodeAudio('se3'), 1);
    if (this.type === 'KWZ' && this.note.hasAudioTrack(4)) this.audioTracks[3].set(this.note.decodeAudio('se4'), 1);
    if (this.note.hasAudioTrack(0)) this.audioTracks[4].set(this.note.decodeAudio('bgm'), this.audiorate);
    this.seFlags = this.note.decodeSoundFlags();
    this.playbackLoop = null;
    this.hasPlaybackStarted = false;
    this.layerVisibility = {
      1: true,
      2: true,
      3: true
    };
    this.setMode(this.type === 'PPM' ? DisplayMode.PPM : DisplayMode.KWZ);
    this.setFrame(this.note.thumbFrameIndex);
    this.emit('load');
  }

  public close(): void {
    this.pause();
    this.note = null;
    this.isOpen = false;
    this.paused = true;
    this.loop = null;
    this.meta = null;
    this.frame = 0;
    for (let i = 0; i < this.audioTracks.length; i++) {
      this.audioTracks[i].unset();
    }
    // this._seFlags = null;
    this.hasPlaybackStarted = null;
    this.canvas.clear();
    // this._imgCanvas.clear();
  }

  public destroy(): void {
    this.close();
    this.canvas.destroy();
    // this._imgCanvas.destroy();
  }

  private playFrameSe(index: number) {
    var flags = this.seFlags[index];
    for (let i = 0; i < flags.length; i++) {
      if (flags[i] && this.audioTracks[i].isActive) this.audioTracks[i].start();
    }
  }

  private playBgm() {
    this.audioTracks[4].start(this.currentTime);
  }

  private stopAudio() {
    for (let i = 0; i < this.audioTracks.length; i++) {
      this.audioTracks[i].stop();
    }
  }

  public play(): void {
    if ((!this.isOpen) || (!this.paused)) return null;
    this.paused = false;
    if ((!this.hasPlaybackStarted) || ((!this.loop) && (this.currentFrame == this.frameCount - 1))) this.frame = 0;
    this.playBgm();
    this.playbackLoop = window.setInterval(() => {
      if (this.paused) clearInterval(this.playbackLoop);
      // if the end of the flipnote has been reached
      if (this.currentFrame >= this.frameCount -1) {
        this.stopAudio();
        if (this.loop) {
          this.firstFrame();
          this.playBgm();
          this.emit('playback:loop');
        } else {
          this.pause();
          this.emit('playback:end');
        }
      } else {
        this.playFrameSe(this.currentFrame);
        this.nextFrame();
      }
    }, 1000 / this.framerate);
    this.hasPlaybackStarted = true;
    this.emit('playback:start');
  }

  public pause(): void {
    if ((!this.isOpen) || (this.paused)) return null;
    // break the playback loop
    window.clearInterval(this.playbackLoop);
    this.paused = true;
    this.stopAudio();
    this.emit('playback:stop');
  }

  // getFrameImage(index, width, height, type, encoderOptions) {
  //   if (!this._isOpen) return null;
  //   var canvas = this._imgCanvas;
  //   if (canvas.width !== width || canvas.height !== height) canvas.resize(width, height);
  //   // clamp frame index
  //   index = (index == 'thumb') ? (this.note.thumbFrameIndex) : (Math.max(0, Math.min(index, this.frameCount - 1)));
  //   this.drawFrame(index, canvas);
  //   return canvas.toImage(type, encoderOptions);
  // }

  public setPalette(palette: any): void {
    // this.customPalette = palette;
    this.note.palette = palette;
    this.forceUpdate();
  }

  public setFrame(index: number): void {
    if ((!this.isOpen) || (index === this.currentFrame)) return null;
    // clamp frame index
    index = Math.max(0, Math.min(Math.floor(index), this.frameCount - 1));
    this.frame = index;
    this.drawFrame(index, this.canvas);
    this.emit('frame:update', this.currentFrame);
  }

 public drawFrame(frameIndex: number, canvas: WebglCanvas): void {
    let colors = this.note.getFramePalette(frameIndex);
    let layerBuffers = this.note.decodeFrame(frameIndex);
    canvas.setPaperColor(colors[0]);
    canvas.clear();
    if (this.note.type === 'PPM') {
      if (this.layerVisibility[2]) canvas.drawLayer(layerBuffers[1], 256, 192, colors[2], [0,0,0,0]);
      if (this.layerVisibility[1]) canvas.drawLayer(layerBuffers[0], 256, 192, colors[1], [0,0,0,0]);
    } else if (this.note.type === 'KWZ') {
      // loop through each layer
      this.note.getLayerOrder(frameIndex).forEach(layerIndex => {
        // only draw layer if it's visible
        if (this.layerVisibility[layerIndex + 1]) {
          canvas.drawLayer(layerBuffers[layerIndex], 320, 240, colors[layerIndex * 2 + 1], colors[layerIndex * 2 + 2]);
        }
      });
    }
  }

  public thumbnailFrame(): void {
    this.currentFrame = this.note.thumbFrameIndex;
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

  public resize(width: number, height: number): void {
    this.canvas.resize(width, height);
    this.forceUpdate();
  }

  public setLayerVisibility(index: number, value: boolean): void {
    this.layerVisibility[index] = value;
    this.forceUpdate();
  }

  public setSmoothRendering(value: boolean): void {
    this.canvas.setFilter(value ? FilterType.Linear : FilterType.Nearest);
    this.forceUpdate();
    this.smoothRendering = value;
  }

  private setMode(mode: DisplayMode): void {
    this.canvas.setMode(mode);
    // this._imgCanvas.setMode(mode);
  }

  public forceUpdate(): void {
    if (this.isOpen) {
      this.drawFrame(this.currentFrame, this.canvas);
    }
  }

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

}