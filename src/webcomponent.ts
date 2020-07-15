// Entrypoint for webcomponent build

import PlayerComponent from './components/Player.svelte';
export * from './flipnote'; // make sure regular flipnote.js api is available on window.flipnote

// https://svelte.dev/docs#Custom_element_API
// Had to do a hacky type coercion fix to get this to compile without complaints :/
customElements.define('flipnote-player', PlayerComponent as unknown as CustomElementConstructor);

export const playerComponent = PlayerComponent; // adds window.flipnote.playerComponent