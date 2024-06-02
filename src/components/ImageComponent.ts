import {
  LitElement,
  html,
  css,
} from 'lit';

import {
  state,
  property,
  customElement,
} from 'lit/decorators.js';

import type {
  Flipnote
} from '../flipnote';

import {
  parseSource
} from '../parseSource';

import {
  GifImage
} from '../encoders';

/** 
 * Flipnote player icon component
 * 
 * @category Web Component
 * @internal
 */
@customElement('flipnote-image')
export class ImageComponent extends LitElement {

  static get styles() {
    return css`
      .Image {
        width: inherit;
        height: inherit;
        image-rendering: -moz-crisp-edges;
        image-rendering: -webkit-crisp-edges;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
        -ms-interpolation-mode: nearest-neighbor;
      }
    `;
  }

  gif: GifImage;
  note: Flipnote;
  private _src: string = '';
  private _frame: string = '0';

  @property()
  set src(src: any) {
    this.load(src);
  }

  get src() {
    return this._src;
  }

  @property()
  set frame(frame: string) {
    this._frame = frame;
    if (this.note)
      this.loadNote(this.note);
  }

  get frame() {
    return this._frame;
  }

  @property({ type: Boolean })
  cropped: boolean = false;

  @state()
  private gifUrl: string = '';

  @state()
  private imgTitle: string = '';

  /** @internal */
  render() {
    return html`<img class="Image" src=${ this.gifUrl } alt=${ this.imgTitle } title=${ this.imgTitle } />`;
  }

  private revokeUrl() {
    // if there was already an image, clean up its data URL
    if (this.gif && this.gif.dataUrl) {
      this.gif.revokeUrl();
      this.gifUrl = '';
    }
  }

  loadNote(note: Flipnote) {
    this.note = note;
    this.revokeUrl();
    const frame = this._frame;
    // full animated gif
    if (frame === 'all') {
      this.gif = GifImage.fromFlipnote(note);
      this.gifUrl = this.gif.getUrl();
    }
    // thumbnail frame
    else if (frame === 'thumb') {
      this.gif = GifImage.fromFlipnoteFrame(note, note.thumbFrameIndex);
      this.gifUrl = this.gif.getUrl();
    }
    // if frame is numeric string
    else if (!isNaN(+frame)) {
      const frameIndex = parseInt(frame);
      this.gif = GifImage.fromFlipnoteFrame(note, frameIndex);
      this.gifUrl = this.gif.getUrl();
    }
    if (this.gifUrl) {
      this.dispatchLoad();
      this.imgTitle = note.getTitle();
    }
    else {
      this.dispatchError('Invalid frame attribute');
    }
  }

  load(src: any) {
    this._src = src;
    this.note = undefined;
    const borderCrop = this.getAttribute('cropped') === 'true';
    parseSource(src, { borderCrop })
      .then(note => this.loadNote(note))
      .catch(err => this.dispatchError(err));
  }

  disconnectedCallback() {
    this.revokeUrl();
  }

  private dispatchLoad() {
    this.dispatchEvent(new Event('load'));
  }

  private dispatchError(err?: string) {
    this.dispatchEvent(new ErrorEvent('error', { error: err }));
    throw new Error(err);
  }
}