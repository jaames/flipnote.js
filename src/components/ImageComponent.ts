import { LitElement, html, css, customElement, property, internalProperty } from 'lit-element';
import { Flipnote, FlipnoteFormat } from '../Flipnote';
import { parseSource } from '../parseSource';
import { GifImage } from '../encoders';

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

  public gif: GifImage;
  public note: Flipnote;
  private _src: string = '';
  private _frame: string = '0';

  @property()
  public set src(src: any) {
    this.load(src);
  }

  public get src() {
    return this._src;
  }

  @property()
  public set frame(frame: string) {
    this._frame = frame;
    if (this.note)
      this.loadNote(this.note);
  }

  public get frame() {
    return this._frame;
  }

  @internalProperty()
  private gifUrl: string = '';

  @internalProperty()
  private imgTitle: string = '';

  /** @internal */
  public render() {
    return html`<img class="Image" src=${ this.gifUrl } alt=${ this.imgTitle } title=${ this.imgTitle } />`;
  }

  private revokeUrl() {
    // if there was already an image, clean up its data URL
    if (this.gif && this.gif.dataUrl) {
      this.gif.revokeUrl();
      this.gifUrl = '';
    }
  }

  public loadNote(note: Flipnote) {
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
      this.imgTitle = this.getTitle(note);
    }
    else {
      this.dispatchError('Invalid frame attribute');
    }
  }

  public load(src: any) {
    this._src = src;
    this.note = undefined;
    parseSource(src)
      .then(note => this.loadNote(note))
      .catch(err => this.dispatchError(err));
  }

  disconnectedCallback() {
    this.revokeUrl();
  }

  private getTitle(note: Flipnote) {
    if (note.isComment)
      return `Comment by ${ note.meta.current.username }`;

    if (note.isFolderIcon)
      return `Folder icon`;

    return `Flipnote by ${ note.meta.current.username }`;
  }

  private dispatchLoad() {
    this.dispatchEvent(new Event('load'));
  }

  private dispatchError(err?: string) {
    this.dispatchEvent(new ErrorEvent('error', { error: err }));
    throw new Error(err);
  }
}