<svelte:options tag="flipnote-player-slider-bar"/>

<script>
  import { createDomEventDispatcher } from './utils.ts';

  export let value = 0;

  let sliderElement; // will be bound to the progress bar element
  let isSliderActive = false;

  const dispatch = createDomEventDispatcher();

  function onSliderInputStart(event) {
    event.preventDefault();
    isSliderActive = true;
    onSliderInput(event);
    dispatch('inputstart');
  }

  function onSliderInputEnd(event) {
    event.preventDefault();
    isSliderActive = false;
    onSliderInput(event);
    dispatch('inputend');
  }

  function onSliderInput(event) {
    event.preventDefault();
    const rect = sliderElement.getBoundingClientRect();
    const railCap = rect.height / 2;
    const railLength = rect.width - railCap * 2;
    const x = event.pageX - rect.left - railCap;
    const newValue = Math.max(0, Math.min(1, x / railLength));
    if (value !== newValue) {
      dispatch('change', {value: newValue});
    }
  }
</script>

<svelte:window
  on:mousemove={ isSliderActive ? onSliderInput : null }
  on:mouseup={ isSliderActive ? onSliderInputEnd : null }
/>
<div
  class="PlayerSlider"
  on:mousedown={ onSliderInputStart }
>
  <div 
    class="PlayerSlider__track" 
    bind:this={ sliderElement }
  >
    <div 
      class="PlayerSlider__level"
      style="width:{ value * 100 }%;"
    />
    <div
      class="PlayerSlider__handle"
      style="left:{ value * 100 }%;"
    />
  </div>
</div>

<style>

.PlayerSlider {
  padding: 6px 0;
}

.PlayerSlider__track {
  cursor: pointer;
  position: relative;
  flex: 1;
  height: 4px;
  border-radius: 3px;
  margin: 6px 0;
  background: var(--flipnote-player-slider-track, #FFD3A6);
}

.PlayerSlider__level {
  position: absolute;
  width: 100%;
  /* min-width: 6px; */
  height: 6px;
  margin: -1px;
  border-radius: 8px;
  background: var(--flipnote-player-slider-level, #F36A2D);
}
.PlayerSlider__handle {
  /* display: none; */
  position: absolute;
  top: 0;
  height: 10px;
  width: 4px;
  margin-left: -2px;
  margin-top: -3px;
  border-radius: 2px;
  background: var(--flipnote-player-slider-handle, #F36A2D);
  /* box-shadow: 0 2px 3px 0 rgba(102, 102, 153, .62); */
}

/* .PlayerSlider:hover .PlayerSlider__handle {
  display: block;
} */
</style>