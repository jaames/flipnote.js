// Entrypoint for webcomponent build

import PlayerComponent from './component/Player.svelte';
export * from './flipnote'; // make sure regular flipnote.js api is available on window.flipnote

// https://svelte.dev/docs#Custom_element_API
customElements.define('flipnote-player', PlayerComponent);

export const playerComponent = PlayerComponent; // adds window.flipnote.playerComponent