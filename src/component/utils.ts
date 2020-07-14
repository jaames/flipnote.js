import { createEventDispatcher } from 'svelte';
import { get_current_component } from 'svelte/internal';

export function createDomEventDispatcher() {
  const component = get_current_component();
  const svelteDispatch = createEventDispatcher();
  return function (name: string, detail: any) {
    svelteDispatch(name, detail);
    component.dispatchEvent && component.dispatchEvent(new CustomEvent(name, { detail }));
  }
}