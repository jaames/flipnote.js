import { 
  LitElement,
  html,
  css,
  query,
  property,
  internalProperty,
  customElement,
} from 'lit-element';

import { classMap } from 'lit-html/directives/class-map.js';
import { styleMap } from 'lit-html/directives/style-map.js';

/** @internal */
type SliderOrientation = 'horizontal' | 'vertical';

/**
 * @category Web Component
 * @internal
 */
@customElement('flipnote-player-slider')
export class SliderComponent extends LitElement {

  static get styles() {
    return css`
      .Slider {
        touch-action: none;
        padding: 4px 0;
        cursor: pointer;
      }

      .Slider--vertical {
        height: 100px;
        width: 14px;
      }

      .Slider__track {
        position: relative;
        border-radius: 3px;
        background: var(--flipnote-player-slider-track, #FFD3A6);
      }

      .Slider--horizontal .Slider__track {
        height: 4px;
        margin: 6px 0;
      }

      .Slider--vertical .Slider__track {
        width: 4px;
        height: 100%;
        margin: 0 6px;
      }

      .Slider__levelWrapper {
        position: absolute;
        left: 0px;
        right: 0px;
        height: 6px;
        margin: -1px;
      }

      .Slider__level {
        position: absolute;
        width: 100%;
        left: 0;
        height: 8px;
        /* margin: -1px; */
        border-radius: 8px;
        background: var(--flipnote-player-slider-level, #F36A2D);
      }

      .Slider--horizontal .Slider__level {
        width: 100%;
        height: 6px;
      }

      .Slider--vertical .Slider__level {
        width: 6px;
        height: 100%;
        bottom: 0;
      }

      .Slider__handle {
        display: none;
        position: absolute;
        height: 10px;
        width: 10px;
        border-radius: 5px;
        box-sizing: border-box;
        border: 3px solid var(--flipnote-player-slider-handle, #F36A2D);
        background: var(--flipnote-player-slider-handle-fill, white);
      }

      .Slider:hover .Slider__handle,
      .Slider--isActive .Slider__handle {
        display: block;
      }

      .Slider--horizontal .Slider__handle { 
        top: 0;
        margin-top: -3px;
        margin-left: -6px;
      }

      .Slider--vertical .Slider__handle { 
        left: 0;
        margin-bottom: -6px;
        margin-left: -3px;
      }
    `;
  }

  @property({ type: Number })
  value: number = 0;

  @property({ type: String })
  orientation: SliderOrientation = 'horizontal'; // switch to horizontal

  @internalProperty()
  private isActive: boolean = false;

  @query('.Slider__track')
  private sliderElement: Element;

  render() {
    const percent = `${ this.value * 100 }%`;
    const mainAxis = this.orientation === 'horizontal' ? 'width' : 'height';
    const side = this.orientation === 'horizontal' ? 'left' : 'bottom';
    const rootClasses = {
      'Slider': true,
      'Slider--horizontal': this.orientation === 'horizontal',
      'Slider--vertical': this.orientation === 'vertical',
      'Slider--isActive': this.isActive,
    };
    return html`
      <div class=${ classMap(rootClasses) } @touchstart=${ this.onSliderTouchStart } @mousedown=${ this.onSliderMouseStart }>
        <div class="Slider__track">
          <div class="Slider__levelWrapper">  
            <div class="Slider__level" style=${ styleMap({ [mainAxis]: percent }) }></div>
          </div>
          <div class="Slider__handle" style=${ styleMap({ [side]: percent }) }></div>
        </div>
      </div>
    `;
  }

  onSliderMouseStart = (event: MouseEvent) => {
    event.preventDefault();
    this.isActive = true;
    document.addEventListener('mousemove', this.onSliderMouseMove);
    document.addEventListener('mouseup', this.onSliderMouseEnd);
    this.dispatch('inputstart');
    this.onSliderInput(event.clientX, event.clientY);
  }

  onSliderMouseEnd = (event: MouseEvent) => {
    event.preventDefault();
    document.removeEventListener('mousemove', this.onSliderMouseMove);
    document.removeEventListener('mouseup', this.onSliderMouseEnd);
    this.dispatch('inputend');
    this.onSliderInput(event.clientX, event.clientY);
    this.isActive = false;
  }

  onSliderMouseMove = (event: MouseEvent) => {
    event.preventDefault();
    this.onSliderInput(event.clientX, event.clientY);
  }

  onSliderTouchStart = (event: TouchEvent) => {
    const point = event.changedTouches[0];
    event.preventDefault();
    this.isActive = true;
    document.addEventListener('touchmove', this.onSliderTouchMove);
    document.addEventListener('touchend', this.onSliderTouchEnd);
    this.dispatch('inputstart');
    this.onSliderInput(point.clientX, point.clientY);
  }

  onSliderTouchEnd = (event: TouchEvent) => {
    const point = event.changedTouches[0];
    event.preventDefault();
    document.removeEventListener('touchmove', this.onSliderTouchMove);
    document.removeEventListener('touchend', this.onSliderTouchEnd);
    this.dispatch('inputend');
    this.onSliderInput(point.clientX, point.clientY);
    this.isActive = false;
  }

  onSliderTouchMove = (event: TouchEvent) => {
    const point = event.changedTouches[0];
    event.preventDefault();
    this.onSliderInput(point.clientX, point.clientY);
  }

  onSliderInput = (x: number, y: number) => {
    const rect = this.sliderElement.getBoundingClientRect();
    let value;
    if (this.orientation === 'horizontal') {
      const railCap = rect.height / 2;
      const railLength = rect.width - railCap * 2;
      const inputPosition = x - rect.left - railCap;
      const v = inputPosition / railLength;
      value = Math.max(0, Math.min(v, 1));
    }
    else if (this.orientation === 'vertical') {
      const railCap = rect.width / 2;
      const railLength = rect.height - railCap * 2;
      const inputPosition = y - rect.top - railCap;
      const v = 1 - inputPosition / railLength; // y is inverted; top is the max point
      value = Math.max(0, Math.min(v, 1));
    }
    if (this.value !== value)
      this.dispatch('change', { value });
  }

  private dispatch(eventName: string, detail?: any) {
    const event = new CustomEvent(eventName, { detail });
    this.dispatchEvent(event);
  }

}