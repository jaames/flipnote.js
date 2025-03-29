import {
  LitElement,
  html,
  css,
} from 'lit';

import {
  property,
  customElement,
} from 'lit/decorators.js';

import {
  unsafeSVG
} from 'lit/directives/unsafe-svg.js';

import IconPlay from './icons/play.svg';
import IconPause from './icons/pause.svg';
import IconLoader from './icons/loader.svg';
import IconVolumeOn from './icons/volumeOn.svg';
import IconVolumeOff from './icons/volumeOff.svg';

/**
 * @internal
 */
const patchSvg = (svgString: string) =>
  svgString.replace(/<svg ([^>]*)>/, (match, svgAttrs) => `<svg ${ svgAttrs } class="Icon" part="Icon" style="fill:currentColor">`);

/**
 * @internal
 */
const iconMap: Record<string, string> = {
  play: patchSvg(IconPlay),
  pause: patchSvg(IconPause),
  loader: patchSvg(IconLoader),
  volumeOn: patchSvg(IconVolumeOn),
  volumeOff: patchSvg(IconVolumeOff),
}

/** 
 * Flipnote player icon component
 * 
 * @group Web Component
 * @internal
 */
@customElement('flipnote-player-icon')
export class IconComponent extends LitElement {

  static get styles() {
    return css`
      .Icon {
        width: 100%;
        height: 100%;
        color: var(--flipnote-player-icon-color, #F36A2D);
      }
    `;
  }

  /**
   * Available icons:
   * - `play`
   * - `pause`
   * - `loader`
   * - `volumeOn`
   * - `volumeOff`
   */
  @property({ type: String })
  icon: string = 'loader';

  /**
   * @internal
   */
  render() {
    return html`${ unsafeSVG(iconMap[this.icon]) }`;
  }
}