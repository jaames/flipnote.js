// Entrypoint for webcomponent build

export * from './flipnote'; // make sure regular flipnote.js api is available on window.flipnote

import { PlayerComponent } from './components';
/** @internal */
export const playerComponent = PlayerComponent; // adds window.flipnote.playerComponent

