<svelte:options
  tag={ null }
  accessors={ true }
/>

<script>
  import { onMount } from 'svelte';
  import { Player as FlipnotePlayer } from '../player/index.ts';
  import { createDomEventDispatcher, padNumber, formatTime } from './utils.ts';
  import './Slider.svelte';
  import './Icon.svelte';

  export let src = null;
  export let controls = 'default';
  export let timeformat = 'frames';
  export let muted = false;

  let player; // will be bound to flipnote player object
  let canvasElement; // will be bound to the canvas element
  let progress = 0;
  let currentFrame = 0;
  let totalFrames = 0;
  let currentTime = 0;
  let duration = 0;
  let isPlaying = false;
  let volume = 1;
  let isMuted = false;
  let timeString = '';
  
  onMount(() => {
    player = new FlipnotePlayer(canvasElement, 256, 192);
    player.on('load', () => {
      totalFrames = player.frameCount;
      duration = player.duration;
      volume = player.volume;
      player.muted = muted;
      player.resize(player.note.width, player.note.height);
    });
    player.on('progress', (playbackProgress) => {
      progress = playbackProgress;
      currentTime = player.currentTime;
    });
    player.on('playback:start', () => {
      isPlaying = true;
    });
    player.on('playback:stop', () => {
      isPlaying = false;
    });
    player.on('frame:update', () => {
      currentFrame = player.currentFrame + 1;
    });
  });

  async function loadSource(src) {
    await player.open(src);
  }

  function handleProgressBarInputStart(event) {
    player && player.startSeek();
  }

  function handleProgressBarChange(event) {
    const { value } = event.detail;
    player && player.seek(value * 100);
  }

  function handleProgressBarInputEnd(event) {
    player && player.endSeek();
  }

  function handleVolumeBarChange(event) {
    const { value } = event.detail;
    if (player) {
      player.volume = value;
      volume = value;
      if (volume > 0 && muted) muted = false;
    }
  }
  
  function togglePlay() {
    player && player.togglePlay();
  }

  function toggleMute() {
    muted = !muted;
  }

  let flipnoteLoader = new Promise((resolve, reject) => reject());

  $: if (src) {
    flipnoteLoader = loadSource(src);
  }

  $: {
    if (player) {
      player.muted = muted;
    }
  }

  $: {
    if (timeformat === 'time') {
      timeString = `${ formatTime(currentTime) } / ${ formatTime(duration) }`
    } else { // default is 'frames'
      timeString = `${ padNumber(currentFrame, 3) } / ${ padNumber(totalFrames, 3) }`
    }
  }
</script>

<div class="FlipnotePlayer">
  <div class="FlipnotePlayer__canvasArea">
    <canvas
      class="FlipnotePlayer__canvas"
      bind:this={ canvasElement }
      on:click={ togglePlay }
    />
    {#await flipnoteLoader}
      <div class="FlipnotePlayer__overlay">
        <flipnote-player-icon icon="loader" class="FlipnotePlayer__loaderIcon"/>
      </div>
    {:catch error}
      <div class="FlipnotePlayer__overlay">
        Error
      </div>
    {/await}
  </div>
  {#if controls === 'compact'}
    <div class="FlipnotePlayerControls FlipnotePlayerControls--compact FlipnotePlayerControls__row">
      <button
        on:click={ togglePlay }
        class="Button FlipnotePlayerControls__playButton"
      >
        <flipnote-player-icon icon={ isPlaying ? 'pause' : 'play' }/>
      </button>
      <flipnote-player-slider-bar
        class="FlipnotePlayerControls__progressBar"
        value={progress / 100}
        on:change={handleProgressBarChange}
        on:inputstart={handleProgressBarInputStart}
        on:inputend={handleProgressBarInputEnd}
      />
    </div>
  {:else if controls === 'default'}
    <div class="FlipnotePlayerControls FlipnotePlayerControls--default">
      <flipnote-player-slider-bar
        class="FlipnotePlayerControls__progressBar"
        value={progress / 100}
        on:change={handleProgressBarChange}
        on:inputstart={handleProgressBarInputStart}
        on:inputend={handleProgressBarInputEnd}
      />
      <div class="FlipnotePlayerControls__row">
        <div class="FlipnotePlayerControls__groupLeft">
          <button class="Button FlipnotePlayerControls__playButton" on:click={ togglePlay }>
            <flipnote-player-icon icon={ isPlaying ? 'pause' : 'play' }/>
          </button>
          <span class="FlipnotePlayerControls__frameCounter">
            { timeString }
          </span>
        </div>
        <div class="FlipnotePlayerControls__groupRight">
          <flipnote-player-icon 
            class="FlipnotePlayerControls__muteIcon"
            on:click={ toggleMute }
            icon={ (muted || volume === 0) ? 'volumeOff' : 'volumeOn' }
          />
          <flipnote-player-slider-bar
            class="FlipnotePlayerControls__volumeBar"
            value={ muted ? 0 : volume }
            on:change={ handleVolumeBarChange }
          />
        </div>
      </div>
    </div>
  {:else if controls === 'full'}
    <div class="FlipnotePlayerControls FlipnotePlayerControls--full">
      todo :)
    </div>
  {/if}
</div>

<style>

  .Button {
    border: 0;
    padding: 0;
    outline: 0;
    -webkit-appearance: none;
    display: block;
    font-family: inherit;
    font-size: inherit;
    text-align: center;
    cursor: pointer;
    background: var(--flipnote-player-button-background, #FFD3A6);
    color: var(--flipnote-player-button-color, #F36A2D);
    border-radius: 4px;
  }

  .Button flipnote-player-icon {
    display: block;
  }

  .FlipnotePlayer {
    display: inline-block;
    position: relative;
    font-family: var(--flipnote-player-font-family, sans-serif);
    /* width: 100%; */
    /* user-select: none; */
  }

  .FlipnotePlayer__canvasArea {
    position: relative;
    /* width: 100%; */
  }

  .FlipnotePlayer__canvas {
    position: relative;
    display: block;
  }

  .FlipnotePlayer__overlay {
    position: absolute;
    top: 0;
    left: 0;
    background: #e5e5e9;
    color: #4b4c53;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @keyframes spin {
    from {
      transform: rotateZ(0);
    }
    to {
      transform: rotateZ(360deg);
    }
  }

  .FlipnotePlayer__loaderIcon {
    animation: spin infinite 1.2s linear;
  }

  .FlipnotePlayerControls {
    background: var(--flipnote-player-controls-background, none);
  }

  .FlipnotePlayerControls__muteIcon {
    width: 28px;
    height: 28px;
  }

  .FlipnotePlayerControls__row,
  .FlipnotePlayerControls__groupLeft,
  .FlipnotePlayerControls__groupRight {
    display: flex;
    align-items: center;
  }

  .FlipnotePlayerControls__groupLeft {
    margin-right: auto;
  }

  .FlipnotePlayerControls__groupRight {
    margin-left: auto;
  }

  .FlipnotePlayerControls__playButton {
    height: 32px;
    width: 32px;
    padding: 2px;
  }

  .FlipnotePlayerControls__frameCounter {
    font-variant-numeric: tabular-nums;
  }

  .FlipnotePlayerControls--compact .FlipnotePlayerControls__playButton {
    margin-right: 12px;
  }

  .FlipnotePlayerControls--compact .FlipnotePlayerControls__progressBar {
    flex: 1;
  }

  .FlipnotePlayerControls--default .FlipnotePlayerControls__playButton {
    margin-right: 8px;
  }

  .FlipnotePlayerControls--default .FlipnotePlayerControls__volumeBar {
    width: 70px;
    margin-left: 8px;
  }
</style>
