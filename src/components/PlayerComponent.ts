import { 
  LitElement,
  html,
  css,
  query,
  customElement,
  internalProperty,
  PropertyValues,
  property,
} from 'lit-element';

import { Player, PlayerEvent } from '../player';
import { PlayerMixin } from './PlayerMixin';

import { SliderComponent } from './SliderComponent';
import { IconComponent } from './IconComponent';

/**
 * @category Web Component
 */
@customElement('flipnote-player')
export class PlayerComponent extends PlayerMixin(LitElement) {

  static get styles() {
    return css`
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

      .Player {
        display: inline-block;
        position: relative;
        font-family: var(--flipnote-player-font-family, sans-serif);
        /* width: 100%; */
        /* user-select: none; */
      }

      .PlayerControls__playButton {
        height: 32px;
        width: 32px;
        padding: 2px;
      }

      .PlayerControls {
        background: var(--flipnote-player-controls-background, none);
      }

      .PlayerControls__muteIcon {
        width: 28px;
        height: 28px;
      }

      .PlayerControls__row,
      .PlayerControls__groupLeft,
      .PlayerControls__groupRight {
        display: flex;
        align-items: center;
      }

      .PlayerControls__groupLeft {
        margin-right: auto;
      }

      .PlayerControls__groupRight {
        margin-left: auto;
      }

      .PlayerControls__playButton {
        height: 32px;
        width: 32px;
        padding: 2px;
      }

      .PlayerControls__muteIcon {
        width: 28px;
        height: 28px;
      }

      .PlayerControls__frameCounter {
        font-variant-numeric: tabular-nums;
      }

      .PlayerControls__progressBar {
        flex: 1;
      }

      .PlayerControls--compact .PlayerControls__playButton {
        margin-right: 8px;
      }

      .PlayerControls--compact .PlayerControls__progressBar {
        flex: 1;
      }

      .PlayerControls--default .PlayerControls__playButton {
        margin-right: 8px;
      }

      .PlayerControls--default .PlayerControls__volumeBar {
        width: 70px;
        margin-left: 8px;
      }
    `;
  }

  @property({ type: String })
  public controls: string;

  @property({ type: String })
  get src() {
    return this.player.src;
  }

  set src(src: any) {
    if (this._isPlayerAvailable)
      this.player.src = src;
    this._playerSrc = src;
  }

  @property({ type: Boolean })
  get autoplay() {
    return this.player.autoplay;
  }

  set autoplay(value: boolean) {
    this.player.autoplay = value;
  }

  @internalProperty()
  private _progress = 0;

  @internalProperty()
  private _counter = '';

  @internalProperty()
  private _isPlaying = false;

  @internalProperty()
  private _isMuted = false;

  @internalProperty()
  private _volumeLevel = 0;

  private _isPlayerAvailable = false;
  private _playerSrc: any;

  @query('#canvas')
  private playerCanvas: HTMLCanvasElement;
  
  constructor() {
    super();
  }

  /** @internal */
  renderControls() {
    if (this.controls === 'compact') {
      return html`
        <div class="PlayerControls PlayerControls--compact PlayerControls__row">
          <button @click=${ this.togglePlay } class="Button PlayerControls__playButton">
            <flipnote-player-icon icon=${ this._isPlaying ? 'pause' : 'play' }></flipnote-player-icon>
          </button>
          <flipnote-player-slider 
            class="PlayerControls__progressBar"
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
        <div class="PlayerControls PlayerControls--default">
          <flipnote-player-slider 
            class="PlayerControls__progressBar"
            value=${ this._progress }
            @change=${ this.handleProgressSliderChange }
            @inputstart=${ this.handleProgressSliderInputStart }
            @inputend=${ this.handleProgressSliderInputEnd }
          />
          </flipnote-player-slider>
          <div class="PlayerControls__row">
            <div class="PlayerControls__groupLeft">
              <button @click=${ this.togglePlay } class="Button PlayerControls__playButton">
                <flipnote-player-icon icon=${ this._isPlaying ? 'pause' : 'play' }></flipnote-player-icon>
              </button>
              <span class="PlayerControls__frameCounter">
                ${ this._counter }
              </span>
            </div>
            <div class="PlayerControls__groupRight">
              <flipnote-player-icon 
                class="PlayerControls__muteIcon"
                @click=${ this.toggleMuted }
                icon=${ this._isMuted ? 'volumeOff' : 'volumeOn' }
              >
              </flipnote-player-icon>
              <flipnote-player-slider
                class="PlayerControls__volumeBar"
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
  render() {
    return html`
      <div class="Player" @keydown=${ this.handleKeyInput }>
        <div class="Player__canvasArea">
          <canvas class="Player__canvas" id="canvas"></canvas>
        </div>
        ${ this.renderControls() }
      </div>
    `;
  }

  /** @internal */
  firstUpdated(changedProperties: PropertyValues) {
    const player = new Player(this.playerCanvas, 320, 240);
    player.on([PlayerEvent.Load, PlayerEvent.Close, PlayerEvent.Progress], () => {
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
    player.on([PlayerEvent.Error], () => {
      console.log('err!')
    });
    // catch any player event and dispatch it as a DOM event
    player.on(PlayerEvent.__Any, (eventName: string, args: any[]) => {
      this.dispatchEvent(new Event(eventName));
    });
    if (this._playerSrc) {
      player.load(this._playerSrc);
    }
    this.player = player;
    this._isPlayerAvailable = true;
  }

  /** @internal */
  disconnectedCallback() {
    // clean up webgl and buffer stuff if this element is removed from DOM
    this.destroy();
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

  private handleProgressSliderChange = (e: CustomEvent) => {
    this.seek(e.detail.value);
  }

  private handleProgressSliderInputStart = () => {
    this.startSeek();
  }

  private handleProgressSliderInputEnd = () => {
    this.endSeek();
  }

  private handleVolumeBarChange = (e: CustomEvent) => {
    this.setVolume(e.detail.value);
  }

}