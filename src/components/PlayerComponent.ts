/// <reference types="resize-observer-browser" /> 

import { 
  LitElement,
  html,
  css,
  query,
  customElement,
  PropertyValues,
  property,
  internalProperty,
} from 'lit-element';

import { Player, PlayerEvent } from '../player';
import { PlayerMixin } from './PlayerMixin';
import { nextPaint } from '../utils';

import { SliderComponent } from './SliderComponent';
import { IconComponent } from './IconComponent';

/**
 * @category Web Component
 * @internal
 */
@customElement('flipnote-player')
export class PlayerComponent extends PlayerMixin(LitElement) {

  static get styles() {
    return css`

      :host { 
        display: inline-block; 
      }

      .Player {
        display: inline-block;
        position: relative;
        font-family: var(--flipnote-player-font-family, sans-serif);
        /* width: 100%; */
        /* user-select: none; */
      }

      .CanvasArea {
        position: relative;
      }

      .PlayerCanvas {
        position: relative;
        display: block;
      }

      .Overlay {
        position: absolute;
        top: 0;
        left: 0;
        background: #ebf0f3;
        color: #4b4c53;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .Overlay--error {
        background: #ff8b8b;
        color: #ca2a32;
      }

      @keyframes spin {
        from {
          transform: rotateZ(0);
        }
        to {
          transform: rotateZ(360deg);
        }
      }

      .LoaderIcon {
        animation: spin infinite 1.2s linear;
      }

      .Controls {
        background: var(--flipnote-player-controls-background, none);
      }

      .MuteIcon {
        width: 28px;
        height: 28px;
      }

      .Controls__row,
      .Controls__groupLeft,
      .Controls__groupRight {
        display: flex;
        align-items: center;
      }

      .Controls__groupLeft {
        margin-right: auto;
      }

      .Controls__groupRight {
        margin-left: auto;
      }

      .Controls__playButton {
        height: 32px;
        width: 32px;
        padding: 2px;
      }

      .MuteIcon {
        width: 28px;
        height: 28px;
      }

      .LoaderIcon {
        width: 40px;
        height: 40px;
      }

      .Controls.Controls--compact {
        margin: 6px 0;
      }

      .Controls__frameCounter {
        min-width: 90px;
        font-variant-numeric: tabular-nums;
      }

      .Controls__progressBar {
        flex: 1;
      }

      .Controls--compact .Controls__playButton {
        margin-right: 8px;
      }

      .Controls--compact .Controls__progressBar {
        flex: 1;
      }

      .Controls--default .Controls__playButton {
        margin-right: 8px;
      }

      .Controls--default .Controls__volumeBar {
        width: 70px;
        margin-left: 8px;
      }

      .Button {
        border: 0;
        padding: 0;
        outline: 0;
        -webkit-appearance: none;
        display: block;
        font-family: inherit;
        font-size: inherit;
        text-align: center;
        cursor: pointer;
        background: var(--flipnote-player-button-background, #FFD3A6);
        color: var(--flipnote-player-button-color, #F36A2D);
        border-radius: 4px;
      }

      .Button flipnote-player-icon {
        display: block;
      }
    `;
  }

  @property({ type: String })
  public controls: string;

  @property({ type: String })
  get width() {
    return this._width;
  }

  set width(value: number | string) {
    const oldValue = this._width;
    this._width = value;
    // wrangle plain width value to CSS pixel units if possible
    this._cssWidth = (!isNaN(+value)) ? `${value}px` : value;
    // wait for the next browser paint (when the CSS value is applied) to handle updating the canvas
    nextPaint(() => this.updateCanvasSize());
    this.requestUpdate('width', oldValue);
  }

  @property({ type: String })
  get src() {
    return this._playerSrc;
  }

  set src(src: any) {
    const oldValue = this._playerSrc;
    if (this._isPlayerAvailable)
      this.player.src = src;
    this._playerSrc = src;
    this.requestUpdate('src', oldValue);
  }

  @property({ type: Boolean })
  get autoplay() {
    return this.player.autoplay;
  }

  set autoplay(value: boolean) {
    const oldValue = this.player.autoplay;
    this.player.autoplay = value;
    this.requestUpdate('autoplay', oldValue);
  }

  @internalProperty()
  private _width: string | number = 'auto';

  @internalProperty()
  private _cssWidth: string | number = 'auto';

  @internalProperty()
  private _progress = 0;

  @internalProperty()
  private _counter = '';

  @internalProperty()
  private _isLoading = false;

  @internalProperty()
  private _isError = false;

  @internalProperty()
  private _isPlaying = false;

  @internalProperty()
  private _isMuted = false;

  @internalProperty()
  private _volumeLevel = 0;

  @query('#canvasWrapper')
  private playerCanvasWrapper: Element;

  private _isPlayerAvailable = false;
  private _playerSrc: any;
  private _resizeObserver: ResizeObserver;
  
  constructor() {
    super();
    this._resizeObserver = new ResizeObserver(this.handleResize);
  }

  /** @internal */
  render() {
    return html`
      <style>
        :host {
          width: ${ this._cssWidth }
        }
      </style>
      <div class="Player" @keydown=${ this.handleKeyInput }>
        <div class="CanvasArea" @click=${ this.handlePlayToggle }>
          <div class="PlayerCanvas" id="canvasWrapper"></div>
          ${ this._isLoading ?
            html`<div class="Overlay">
              <flipnote-player-icon icon="loader" class="LoaderIcon"></flipnote-player-icon>
            </div>` :
            ''
          }
          ${ this._isError ?
            html`<div class="Overlay Overlay--error">
              Error
            </div>` :
            ''
          }
        </div>
        ${ this.renderControls() }
      </div>
    `;
  }

  /** @internal */
  renderControls() {
    if (this.controls === 'compact') {
      return html`
        <div class="Controls Controls--compact Controls__row">
          <button @click=${ this.handlePlayToggle } class="Button Controls__playButton">
            <flipnote-player-icon icon=${ this._isPlaying ? 'pause' : 'play' }></flipnote-player-icon>
          </button>
          <flipnote-player-slider 
            class="Controls__progressBar"
            value=${ this._progress }
            @change=${ this.handleProgressSliderChange }
            @inputstart=${ this.handleProgressSliderInputStart }
            @inputend=${ this.handleProgressSliderInputEnd }
          />
          </flipnote-player-slider>
        </div>
      `;
    }
    else {
      return html`
        <div class="Controls Controls--default">
          <flipnote-player-slider 
            class="Controls__progressBar"
            value=${ this._progress }
            @change=${ this.handleProgressSliderChange }
            @inputstart=${ this.handleProgressSliderInputStart }
            @inputend=${ this.handleProgressSliderInputEnd }
          >
          </flipnote-player-slider>
          <div class="Controls__row">
            <div class="Controls__groupLeft">
              <button @click=${ this.handlePlayToggle } class="Button Controls__playButton">
                <flipnote-player-icon icon=${ this._isPlaying ? 'pause' : 'play' }></flipnote-player-icon>
              </button>
              <span class="Controls__frameCounter">
                ${ this._counter }
              </span>
            </div>
            <div class="Controls__groupRight">
              <flipnote-player-icon 
                class="MuteIcon"
                @click=${ this.handleMuteToggle }
                icon=${ this._isMuted ? 'volumeOff' : 'volumeOn' }
              >
              </flipnote-player-icon>
              <flipnote-player-slider
                class="Controls__volumeBar"
                value=${ this._volumeLevel }
                @change=${ this.handleVolumeBarChange }
              >
              </flipnote-player-slider>
            </div>
          </div>
        </div>
      `;
    }
  }

  /** @internal */
  firstUpdated(changedProperties: PropertyValues) {
    const player = new Player(this.playerCanvasWrapper, 256, 192);
    this._resizeObserver.observe(this);
    this.player = player;
    player.on(PlayerEvent.LoadStart, () => {
      this._isLoading = true;
    });
    player.on(PlayerEvent.Load, () => {
      this.updateCanvasSize();
    });
    player.on(PlayerEvent.Error, () => {
      this._isLoading = false;
      this._isError = true;
    });
    player.on([PlayerEvent.Load, PlayerEvent.Close, PlayerEvent.Progress], () => {
      this._isLoading = false;
      this._isError = false;
      this._progress = player.getProgress() / 100;
      this._counter = player.getFrameCounter();
    });
    player.on(PlayerEvent.Play, () => {
      this._isPlaying = true;
    });
    player.on(PlayerEvent.Pause, () => {
      this._isPlaying = false;
    });
    player.on([PlayerEvent.Load, PlayerEvent.VolumeChange], () => {
      this._volumeLevel = player.volume;
      this._isMuted = player.muted;
    });
    // catch any player event and dispatch it as a DOM event
    player.on(PlayerEvent.__Any, (eventName: string, args: any[]) => {
      this.dispatchEvent(new Event(eventName));
    });
    if (this._playerSrc)
      player.load(this._playerSrc);
    this._isPlayerAvailable = true;
  }

  /** @internal */
  disconnectedCallback() {
    // disable resize observer
    this._resizeObserver.disconnect();
    // clean up webgl and buffer stuff if this element is removed from DOM
    this.destroy();
  }

  private updateCanvasSize() {
    const isPlayerAvailable = this._isPlayerAvailable;
    // default width is DSi note size
    let canvasWidth = 256;
    // use the Flipnote's native width
    if (this._width === 'auto' && isPlayerAvailable && this.player.isNoteLoaded) {
      canvasWidth = this.player.note.imageWidth;
    }
    // expand to fill the full container width
    else if (this._width !== 'auto') {
      canvasWidth = this.getBoundingClientRect().width;
    }
    // TODO: initialise canvas right away then mount into DOM later?
    // 4:3 aspect ratio is forced
    if (isPlayerAvailable)
      this.player.resize(canvasWidth, canvasWidth * .75);
  }

  private handleResize = (entries: ResizeObserverEntry[]) => {
    this.updateCanvasSize();
  }

  private handleKeyInput = (e: KeyboardEvent) => {
    e.preventDefault();
    switch(e.key.toLowerCase()) {
      case ' ':
        this.togglePlay();
        break;
      case 'a':
      case 'arrowleft':
        if (e.shiftKey) 
          this.firstFrame();
        else 
          this.prevFrame();
        break;
      case 'd':
      case 'arrowright':
        if (e.shiftKey)
          this.lastFrame();
        else
          this.nextFrame();
        break;
    }
  }

  private handlePlayToggle = (e: InputEvent) => {
    this.togglePlay();
    this.focus();
  }

  private handleMuteToggle = (e: InputEvent) => {
    this.toggleMuted();
    this.focus();
  }

  private handleProgressSliderChange = (e: CustomEvent) => {
    this.seek(e.detail.value);
    this.focus();
  }

  private handleProgressSliderInputStart = () => {
    this.startSeek();
    this.focus();
  }

  private handleProgressSliderInputEnd = () => {
    this.endSeek();
    this.focus();
  }

  private handleVolumeBarChange = (e: CustomEvent) => {
    this.setVolume(e.detail.value);
    this.focus();
  }

}