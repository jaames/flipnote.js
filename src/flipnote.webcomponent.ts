// Entrypoint for webcomponent build

export * from './flipnote'; // make sure regular flipnote.js api is available on window.flipnote

import { PlayerComponent as _PlayerComponent } from './components';
import { ImageComponent as _ImageComponent } from './components';
/** @internal */
export const PlayerComponent = _PlayerComponent;
/** @internal */
export const ImageComponent = _ImageComponent;

