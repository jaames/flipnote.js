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

export function padNumber(num: number, strLength: number) {
  return num.toString().padStart(strLength, '0');
}

export function formatTime(seconds: number) {
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  return `${ m }:${ padNumber(s, 2) }`
}

export function injectSvgStyle(svgString: string, styleString: string) {
  return svgString.replace(/<svg ([^>]*)>/, (match, svgAttrs) => `<svg ${ svgAttrs } style="${ styleString }">`);
}