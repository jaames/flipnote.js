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
    `;
  }

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
  private _isPlaying = false;

  private _isPlayerAvailable = false;
  private _playerSrc: any;

  @query('#canvas')
  private playerCanvas: HTMLCanvasElement;
  
  constructor() {
    super();
  }

  /** @internal */
  render() {
    return html`
      <div class="Player" @keydown=${ this.handleKeyInput }>
        <div class="Player__canvasArea">
          <canvas class="Player__canvas" id="canvas"></canvas>
        </div>
        <flipnote-player-slider 
          value=${ this._progress }
          @change=${ this.handleProgressSliderChange }
          @inputstart=${ this.handleProgressSliderInputStart }
          @inputend=${ this.handleProgressSliderInputEnd }
        />
        </flipnote-player-slider>
        <div class="PlayerControls">

        </div>
        <button @click=${ this.togglePlay } class="Button PlayerControls__playButton">
          <flipnote-player-icon icon=${ this._isPlaying ? 'pause' : 'play' }></flipnote-player-icon>
        </button>
      </div>
    `;
  }

  /** @internal */
  firstUpdated(changedProperties: PropertyValues) {
    const player = new Player(this.playerCanvas, 640, 480);
    player.on(PlayerEvent.Progress, () => {
      this._progress = player.getProgress() / 100;
    });
    player.on(PlayerEvent.Play, () => {
      this._isPlaying = true;
    });
    player.on(PlayerEvent.Pause, () => {
      this._isPlaying = false;
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

}