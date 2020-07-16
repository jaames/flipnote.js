<svelte:options tag="flipnote-player-icon"/>

<script>
import { injectSvgStyle } from './utils.ts';
import IconPlay from './icons/play.svg';
import IconPause from './icons/pause.svg';
import IconLoader from './icons/loader.svg';
import IconVolumeOn from './icons/volumeOn.svg';
import IconVolumeOff from './icons/volumeOff.svg';

export let icon = 'play';

// Had to do a bit of a hack here since Svelte doesn't really like you importing SVGs and stlying them
// SVGs are imported as SVGO-optimised XML strings, and then inline styles get injected into their root tag

const style = 'fill:currentColor';

const iconMap = {
  play: injectSvgStyle(IconPlay, style),
  pause: injectSvgStyle(IconPause, style),
  loader: injectSvgStyle(IconLoader, style),
  volumeOn: injectSvgStyle(IconVolumeOn, style),
  volumeOff: injectSvgStyle(IconVolumeOff, style),
}
</script>

<div class="PlayerIcon">
  {@html iconMap[icon]}
</div>

<style>
.PlayerIcon {
  width: 100%;
  height: 100%;
  color: var(--flipnote-player-icon-color, #F36A2D);
}
</style>
