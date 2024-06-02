import { 
  LitElement,
  html,
  css,
} from 'lit';

import {
  state,
  property,
  query,
  customElement,
} from 'lit/decorators.js';

import {
  classMap
} from 'lit/directives/class-map.js';

import {
  styleMap
} from 'lit/directives/style-map.js';

import { KEY_MAP } from './utils';
import { clamp } from '../utils';

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

      .Slider:focus {
        position: relative;
        z-index: 1;
        outline: var(--flipnote-player-focus-outline, 3px solid #FFD3A6);
        outline-offset: 2px;
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

  @property({ type: Number })
  step: number = 0.1;

  @property({ type: String })
  label: string = '';

  @property({ type: String })
  orientation: SliderOrientation = 'horizontal'; // switch to horizontal

  @state()
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
      <div
        class=${ classMap(rootClasses) }
        tabIndex="0"
        role="slider"
        aria-label=${ this.label }
        aria-valuemin="0"
        aria-valuemax="1"
        aria-valuenow=${ this.value }
        @touchstart=${ this.onSliderTouchStart }
        @mousedown=${ this.onSliderMouseStart }
        @keydown=${ this.onKeyInput }
      >
        <div class="Slider__track">
          <div class="Slider__levelWrapper">  
            <div class="Slider__level" style=${ styleMap({ [mainAxis]: percent }) }></div>
          </div>
          <div class="Slider__handle" style=${ styleMap({ [side]: percent }) }></div>
        </div>
      </div>
    `;
  }

  private onSliderMouseStart = (event: MouseEvent) => {
    event.preventDefault();
    this.isActive = true;
    document.addEventListener('mousemove', this.onSliderMouseMove);
    document.addEventListener('mouseup', this.onSliderMouseEnd);
    this.dispatch('inputstart');
    this.onSliderInput(event.clientX, event.clientY);
  }

  private onSliderMouseEnd = (event: MouseEvent) => {
    event.preventDefault();
    document.removeEventListener('mousemove', this.onSliderMouseMove);
    document.removeEventListener('mouseup', this.onSliderMouseEnd);
    this.dispatch('inputend');
    this.onSliderInput(event.clientX, event.clientY);
    this.isActive = false;
  }

  private onSliderMouseMove = (event: MouseEvent) => {
    event.preventDefault();
    this.onSliderInput(event.clientX, event.clientY);
  }

  private onSliderTouchStart = (event: TouchEvent) => {
    const point = event.changedTouches[0];
    event.preventDefault();
    this.isActive = true;
    document.addEventListener('touchmove', this.onSliderTouchMove);
    document.addEventListener('touchend', this.onSliderTouchEnd);
    this.dispatch('inputstart');
    this.onSliderInput(point.clientX, point.clientY);
  }

  private onSliderTouchEnd = (event: TouchEvent) => {
    const point = event.changedTouches[0];
    event.preventDefault();
    document.removeEventListener('touchmove', this.onSliderTouchMove);
    document.removeEventListener('touchend', this.onSliderTouchEnd);
    this.dispatch('inputend');
    this.onSliderInput(point.clientX, point.clientY);
    this.isActive = false;
  }

  private onSliderTouchMove = (event: TouchEvent) => {
    const point = event.changedTouches[0];
    event.preventDefault();
    this.onSliderInput(point.clientX, point.clientY);
  }

  private onSliderInput = (x: number, y: number) => {
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
    this.updateValue(value); 
  }

  private onKeyInput = (e: KeyboardEvent) => {
    const key = KEY_MAP[e.key];

    if (!key)
      return;

    this.dispatch('inputstart');
    switch (key) {
      case 'ArrowLeft':
        if (e.shiftKey)
          this.updateValue(0);
        else
          this.updateValue(this.value - this.step);
        break;
      case 'ArrowRight':
        if (e.shiftKey)
          this.updateValue(1);
        else
          this.updateValue(this.value + this.step);
        break;
    }
    this.dispatch('inputend');
    e.preventDefault();
  }

  private updateValue = (value: number) => {
    value = clamp(value, 0, 1);
    if (this.value !== value) {
      this.value = value;
      this.dispatch('change', { value });
    }
  }

  private dispatch(eventName: string, detail?: any) {
    const event = new CustomEvent(eventName, { detail });
    this.dispatchEvent(event);
  }

}