import { PlayerComponent } from './PlayerComponent';
import { SliderComponent } from './SliderComponent';
import { IconComponent } from './IconComponent';
import { ImageComponent } from './ImageComponent';

/**
 * @internal
 */
declare global {
  /**
   * Maps web component HTML tag names to their component classes 
   */
  interface HTMLElementTagNameMap {
    'flipnote-player': PlayerComponent;
    'flipnote-player-slider': SliderComponent;
    'flipnote-player-icon': IconComponent;
    'flipnote-image': ImageComponent;
  }
}