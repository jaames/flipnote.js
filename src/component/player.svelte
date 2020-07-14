<svelte:options
  tag={ null }
  accessors={ true }
/>

<script>
  import { onMount, afterUpdate } from 'svelte';
  import './Slider.svelte';
  import { Player } from '../player/index.ts';

  export let src = null;
  export let controls = true;

  let player; // will be bound to flipnote player object
  let canvasElement; // will be bound to the canvas element
  let progress = 0;
  let isPlaying = false;
  let wasPlaying = false;

  onMount(() => {
    player = new Player(canvasElement, 256, 192);
    player.on('progress', (playbackProgress) => {
      progress = playbackProgress;
    });
    player.on('playback:start', () => {
      isPlaying = true;
    });
    player.on('playback:stop', () => {
      isPlaying = false;
    });
  });

  async function loadSource(src) {
    await player.open(src);
  }

  function handleProgressBarChange(event) {
    const { value } = event.detail;
    player.progress = value * 100;
  }

  function handleProgressBarInputStart(event) {
    if (isPlaying) {
      player.pause();
      wasPlaying = true;
    }
  }

  function handleProgressBarInputEnd(event) {
    if (wasPlaying) {
      player.play();
      wasPlaying = false;
    }
  }
  
  function togglePlay() {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  }

  let promise = new Promise((resolve, reject) => reject());

  $: if (src) {
    console.log(src);
    // player.open(src);
    promise = loadSource(src);
  }

  console.log(Player);
</script>

<div class="Player" style="width: 256px">
  <canvas
    class="Player__canvas"
    bind:this={ canvasElement }
  />
  {#if controls}
    <div class="PlayerControls PlayerControls--compact">
      <button
        on:click={ togglePlay }
        class="Button PlayerControls__playButton"
      >
        { isPlaying ? 'Pause' : 'Play' }
      </button>
      <flipnote-player-slider-bar
        class="PlayerControls__progressBar"
        value={progress / 100}
        on:change={handleProgressBarChange}
        on:inputstart={handleProgressBarInputStart}
        on:inputend={handleProgressBarInputEnd}
      />
    </div>
  {/if}
  <div class="p">
    {#await promise}
      <p>...loading</p>
    {:then number}
      <p>loaded</p>
    {:catch error}
      <p style="color: red">error, oh no {error}</p>
    {/await}
  </div>
</div>

<style>
  .Button {
    border: 0;
    appearance: none;
    cursor: pointer;
    background: #FFD3A6;
    outline: white;
    color: #F36A2D;
    border-radius: 4px;
    height: 32px;
    width: 50px;
  }

  .Player {
    color: var(--color-red);
  }

  .PlayerControls--compact {
    display: flex;
    align-items: center;
  }

  .PlayerControls--compact .PlayerControls__playButton {
    margin-right: 12px;
  }

  .PlayerControls--compact .PlayerControls__progressBar {
    flex: 1;
  }
</style>
