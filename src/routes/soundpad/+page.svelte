<script>
  import { onMount, tick } from 'svelte';
  import { io } from 'socket.io-client';
  import { Tween } from 'svelte/motion';
  import { linear } from 'svelte/easing';
  import { animate } from 'motion';
  import { userStore } from '$lib/auth/stores/user';

  let soundList = [];
  let filteredList = [];
  let current = {};
  let history = [];

  let percentage = 0;
  let volume = 0;
  let soundContainer;
  let soundContainerHeight = new Tween(40, { duration: 800, easing: linear });
  let currentUser;
  let soundFileInput;

  async function handleSoundFiles(SoundFiles) {
    if (!SoundFiles || SoundFiles.length === 0 ) return;

    const formData = new FormData();
    for (const SoundFile of SoundFiles) {
      formData.append('files', SoundFile)
    }
      await fetch('https://soundpadapi.zed31rus.ru/soundpad/addSound', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
  }

  function openSoundFileDialog() {
    soundFileInput.click();
  }

  function handleSoundDrop(e) {
    e.preventDefault();
    handleSoundFiles(e.dataTransfer.files);
  }

  let socket;
  let sortMethod = 'index';
  let searchInput = "";

  userStore.subscribe(user => {
		currentUser = user
	})

  $: {
    const searched = search(soundList, searchInput);
    filteredList = sort(searched, sortMethod);
    updateSize();
  }

  onMount(() => {
    socket = io('https://soundpadapi.zed31rus.ru');

    socket.on('currentUpdated', (data) => {
      current = data;
      percentage = data.percentage;
    });

    socket.on('historyUpdated', (data) => {
      history = data;
    });

    socket.on('soundListUpdated', (data) => {
      soundList = data;
      updateSize();
    });

    socket.on('volumeUpdated', (data) => {
      volume = data;
    });

    return () => socket.disconnect();
  });

  export function soundButtonAnimateOnMount(node, { n = 0 } = {}) {
    animate(node, {
      opacity: [0, 1],
      transform: ['translateY(20px) rotate(5deg) scale(0.5)', 'translateY(0) rotate(0deg) scale(1)']
    }, { delay: (n+1) * 0.01 });

    return {};
  }

  function search(list, query) {
    if (!query) return list;
    query = query.toLowerCase().trim();
    return list.filter(item =>
      item.tag.toLowerCase().includes(query) ||
      item.index.toString().includes(query)
    );
  }

  function sort(list, method) {
    if (method === 'index') return list.sort((a, b) => a.index - b.index);
    if (method === 'tag') return list.sort((a, b) => a.tag.localeCompare(b.tag));
    if (method === 'playCount') return list.sort((a, b) => b.playCount - a.playCount);
    return list;
  }

  async function updateSize() {
    await tick();
    const maxContainerHeight = window.innerHeight - 23 * 8;
    soundContainerHeight.target = (Math.min(soundContainer.scrollHeight, maxContainerHeight));
  }

  async function play(index) {
    await fetch('https://soundpadapi.zed31rus.ru/soundpad/playSound', {
      method: 'POST',
      body: JSON.stringify({ soundId: index }),
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async function stop() {
    await fetch('https://soundpadapi.zed31rus.ru/soundpad/stopSound', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async function pause() {
    await fetch('https://soundpadapi.zed31rus.ru/soundpad/pauseSound', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async function jump(percentage) {
    await fetch('https://soundpadapi.zed31rus.ru/soundpad/jump', {
      method: 'POST',
      body: JSON.stringify({ percentage }),
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async function setVolume(volumeVal) {
    await fetch('https://soundpadapi.zed31rus.ru/soundpad/setVolume', {
      method: 'POST',
      body: JSON.stringify({ volume: volumeVal }),
      headers: { 'Content-Type': 'application/json' }
    });
  }
</script>

<div class="flex item-center justify-center">
  <h1>zed31rus_</h1>
</div>

<div id="searchcontainer" class="flex flex-col sm:flex-row gap-2 ml-4 mb-2 mr-4 h-10">
  <select
    bind:value={sortMethod}
    class="bg-black/30 text-white px-4 py-2 rounded-lg shadow-md backdrop-blur border-0"
  >
    <option disabled>Сортировка</option>
    <option value="index">Номер</option>
    <option value="playCount">Популярность</option>
    <option value="tag">Название</option>
  </select>

  <input
    type="text"
    placeholder="🔍 Поиск по названию..."
    bind:value={searchInput}
    class="bg-black/30 text-white px-4 py-2 rounded-lg shadow-xl backdrop-blur border-0"
  />
</div>

<div
  class="soundContainer content-start shadow-xl bg-black/30 p-2 backdrop-blur rounded-r-md rounded-l-xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 overflow-y-auto ml-4 mr-4 mt-0"
  style="height: {soundContainerHeight.current}px;"
  bind:this={soundContainer}
>
  {#if filteredList.length > 0}
    {#each filteredList as { index, tag, duration, playCount }, n (index + '-' + searchInput + '-' + sortMethod)}
      <button
        class="bg-black/30 text-white text-xs sm:text-sm rounded-lg p-2 flex flex-col items-start justify-start gap-1 hover:bg-gray-700 transition duration-200 cursor-pointer h-12"
        use:soundButtonAnimateOnMount={{ n }}
        on:click={async () => {
          current?.sound?.index === index && (current.status === 'PLAYING' || current.status === 'PAUSED')
            ? await pause()
            : await play(index);
        }}
      >
        <div class="w-full flex flex-col">
          {#if current?.sound?.index === index}
            {#if current.status === 'PLAYING'}
              <span class="text-green-400 font-bold">⏸ pause</span>
            {:else if current.status === 'PAUSED'}
              <span class="text-yellow-400 font-bold">▶️ resume</span>
            {:else}
              <span>{tag}</span>
            {/if}
          {:else}
            <span class="truncate">{tag}</span>
          {/if}
          <div class="text-[10px] text-gray-400 flex justify-between w-full">
            <span># {index}</span>
            <span>{duration}</span>
            <span>▶ {playCount}</span>
          </div>
        </div>
      </button>
    {/each}
    {#if currentUser?.isCheckedByAdmin}
      <input type="file" accept="audio/*" multiple bind:this={soundFileInput} class="hidden" on:change={(e) => handleSoundFiles(e.currentTarget.files)}>

      <button
      class="bg-black/30 text-white text-xs sm:text-sm rounded-lg p-2 flex flex-col items-start justify-start gap-1 hover:bg-gray-700 transition duration-200 cursor-pointer h-12"
      use:soundButtonAnimateOnMount={{n: filteredList.length}}
      on:click={openSoundFileDialog}
      on:dragover|preventDefault
      on:drop={handleSoundDrop}
      >
          <div class="w-full flex flex-col">
            <span>+</span>
            <span>addSound</span>
          </div>
      </button>
    {/if}
  {:else}
    <p class="text-gray-500">Загрузка звуков...</p>
  {/if}
</div>

<div class="fixed bg-black/50 backdrop-blur rounded-xl shadow-xl bottom-17 left-0 right-0 m-4">
  <div class="flex items-center gap-4 pr-6 pl-4 w-full">
    <input
      type="range"
      max="100"
      class="progressbar flex-grow rounded-xl w-full h-2 cursor-pointer"
      style="background: linear-gradient(to right, gray {percentage}%, white {percentage}%)"
      value={percentage}
      on:input={(e) => jump(e.currentTarget.value)}
    />
    <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 min-w-[150px] max-w-[250px] truncate text-sm text-gray-300">
      <span class="truncate">
        🎵 {current?.sound?.tag || current?.sound?.title || '—'}
      </span>
      <span class="text-xs text-gray-400">
        {current?.positionmmss || '0:00'} / {current?.durationmmss || '0:00'}
      </span>
    </div>
  </div>
</div>

<div class="fixed bottom-0 left-0 right-0 m-4 bg-black/50 backdrop-blur rounded-xl shadow-xl h-15">
  <div class="flex items-center justify-between p-4 gap-4">
    <div class="flex gap-2">
      <button
        type="button"
        on:click={stop}
        class="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded shadow-xl cursor-pointer"
      >
        ⏹ Stop
      </button>
      <button
        type="button"
        on:click={pause}
        class="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-black rounded shadow-xl cursor-pointer"
      >
        ⏯ Pause/Resume
      </button>
    </div>

    <div class="flex items-center gap-2 w-full sm:w-auto">
      <span class="text-xl">
        {#if volume == 0}
          🔇
        {:else if volume < 30}
          🔈
        {:else if volume < 70}
          🔉
        {:else}
          🔊
        {/if}
      </span>
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        on:input={(e) => setVolume(e.currentTarget.value)}
        class="volumebar w-full sm:w-[150px] h-2 accent-blue-500 cursor-pointer rounded-xl"
        style="background: linear-gradient(to right, gray {volume}%, white {volume}%)"
      />
    </div>
  </div>
</div>

<style>
  .soundContainer::-webkit-scrollbar {
    width: 12px;
  }

  .soundContainer::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 12px;
  }

  .soundContainer::-webkit-scrollbar-track {
    opacity: 0;
  }

  .progressbar,
  .volumebar {
    appearance: none;
    outline: none;
    overflow: hidden;
  }

  .progressbar::-webkit-slider-thumb,
  .volumebar::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 0px;
    height: 0px;
    opacity: 0;
  }
</style>

<svelte:head>
  <title>zed31rus_ | Soundpad</title>
  <meta name="description" content="Soundpad interface for zed31rus_">
  <style>
    body {
    background-image: url('/resources/background.png');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    color: white;
    overflow: hidden;
  }

  html {
    overflow: hidden;
    height: 100%;
  }
  </style>
</svelte:head>