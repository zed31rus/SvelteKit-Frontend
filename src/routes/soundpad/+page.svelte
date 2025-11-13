<script>
  import { onMount, tick } from 'svelte';
  import { io } from 'socket.io-client';
  import { animate } from 'motion';
  import { fetchUser, userStore } from '$lib/stores/user';

  let soundList = [];
  let filteredList = [];
  let current = {};
  let history = [];

  let percentage = 0;
  let volume = 0;
  let soundContainer;
  let currentUser;
  let soundFileInput;

  let seenIndexes = new Set();
  let animationOrderMap = new Map();

  const INITIAL_STEP = 0.01;//10ms
  const BASE_NEW_DELAY = 0.005;//5ms
  const NEW_BATCH_STEP = 0.01;//10ms

  let socket;
  let sortMethod = 'index';
  let searchInput = "";

  userStore.subscribe(user => {
    currentUser = user;
  });

  async function handleSoundFiles(SoundFiles) {
    if (!SoundFiles || SoundFiles.length === 0) return;

    const formData = new FormData();
    for (const SoundFile of SoundFiles) formData.append('files', SoundFile);

    let response = await fetch('https://soundpadapi.zed31rus.ru/soundpad/addSound', {
      method: 'POST',
      credentials: 'include',
      body: formData
    });

    if (response.status === 401) {
      await fetchUser();
      await fetch('https://soundpadapi.zed31rus.ru/soundpad/addSound', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
    }
  }

  function openSoundFileDialog() {
    soundFileInput.click();
  }

  function handleSoundDrop(e) {
    e.preventDefault();
    handleSoundFiles(e.dataTransfer.files);
  }

  function search(list, query) {
    if (!query) return list;
    query = query.toLowerCase().trim();
    return list.filter(item =>
      item.tag.toLowerCase().includes(query) ||
      item.index.toString().includes(query)
    );
  }

  const sorters = {
    index: (a, b) => a.index - b.index,
    tag: (a, b) => a.tag.localeCompare(b.tag),
    playCount: (a, b) => b.playCount - a.playCount,
  };

  function sort(list, method) {
    const sorter = sorters[method];
    return sorter ? [...list].sort(sorter) : [...list];
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

  $: if (filteredList) {
    const currentSet = new Set(filteredList.map(s => s.index));
    for (const id of Array.from(seenIndexes)) {
      if (!currentSet.has(id)) seenIndexes.delete(id);
    }

    const unseenInFiltered = filteredList
      .map((it) => it.index)
      .filter(idx => !seenIndexes.has(idx));

    if (seenIndexes.size === 0 && unseenInFiltered.length > 0 && unseenInFiltered.length === filteredList.length) {
      unseenInFiltered.forEach((idx, i) => animationOrderMap.set(idx, i));
    } else if (unseenInFiltered.length > 0) {
      unseenInFiltered.forEach((idx, i) => animationOrderMap.set(idx, i));
    }
  }

    $: {
    const searched = search(soundList, searchInput);
    filteredList = sort(searched, sortMethod);
  }


  export function soundButtonAnimateOnMount(node, { n = 0, index } = {}) {
    if (seenIndexes.has(index)) {
      animate(
        node,
        {
          opacity: [0, 1],
          transform: ['translateY(20px) rotate(5deg) scale(0.5)', 'translateY(0) rotate(0deg) scale(1)']
        },
        { delay: 0 }
      );
      return {};
    }

    let delay = BASE_NEW_DELAY;
    if (animationOrderMap.has(index)) {
      const pos = animationOrderMap.get(index);
      if (seenIndexes.size === 0 && animationOrderMap.size >= filteredList.length) {
        delay = pos * INITIAL_STEP;
      } else {
        delay = BASE_NEW_DELAY + pos * NEW_BATCH_STEP;
      }
    }

    animate(
      node,
      {
        opacity: [0, 1],
        transform: ['translateY(20px) rotate(5deg) scale(0.5)', 'translateY(0) rotate(0deg) scale(1)']
      },
      { delay }
    );

    seenIndexes.add(index);
    animationOrderMap.delete(index);

    return {};
  }

  onMount(() => {
    socket = io('https://soundpadapi.zed31rus.ru');
    //socket = io("http://127.0.0.1:3002")

    socket.on('currentUpdated', (data) => {
      current = data;
      percentage = data.percentage;
    });

    socket.on('historyUpdated', (data) => {
      history = data;
    });

    socket.on('soundListUpdated', (data) => {
      soundList = data;
    });

    socket.on('volumeUpdated', (data) => {
      volume = data;
    });

    return () => socket.disconnect();
  });
</script>

<div id="main" class="flex flex-col h-[calc(100vh-1rem)]">
  <div id="searchcontainer" class="flex flex-col sm:flex-row gap-2 ml-4 mb-2 mt-4 mr-4 relative">
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
    class="soundContainer mb-2 content-start shadow-xl bg-black/30 p-2 backdrop-blur rounded-r-md rounded-l-xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 overflow-y-auto ml-4 mr-4 mt-0 h-auto"
    bind:this={soundContainer}
  >
    {#if filteredList.length > 0}
      {#each filteredList as { index, tag, duration, playCount }, n (index)}
        <button
          class="bg-black/30 text-white text-xs sm:text-sm rounded-lg p-2 flex flex-col items-start justify-start gap-1 hover:bg-gray-700 transition duration-200 cursor-pointer h-12"
          use:soundButtonAnimateOnMount={{ n, index }}
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

  <div class="bottom-4 left-0 right-0 ml-4 mr-4">
    <div class=" bg-black/50 backdrop-blur rounded-xl shadow-xl mb-2 h-10">
      <div class="flex items-center gap-4 pr-4 pl-4 w-full">
        <input
          type="range"
          max="100"
          class="progressbar flex-grow rounded-xl w-full h-2 cursor-pointer"
          style="background: linear-gradient(to right, gray {percentage}%, white {percentage}%)"
          value={percentage}
          on:input={(e) => jump(e.currentTarget.value)}
        />
        <div class="flex flex-col text-sm text-gray-300 h-10">
          <span class="truncate w-32">
            🎵 {current?.sound?.tag || current?.sound?.title || '—'}
          </span>
          <span class="text-xs text-gray-400">
            {current?.positionmmss || '0:00'} / {current?.durationmmss || '0:00'}
          </span>
        </div>
      </div>
    </div>

    <div class=" bg-black/50 backdrop-blur rounded-xl shadow-xl h-20">
      <div class="flex items-center justify-between p-4 gap-4">
        <div class="flex gap-2">
          <button
            type="button"
            on:click={stop}
            class="px-3 w-32 h-12 text-sm bg-red-600 hover:bg-red-700 text-white rounded shadow-xl cursor-pointer"
          >
            ⏹ Stop
          </button>
          <button
            type="button"
            on:click={pause}
            class="px-3 w-32 h-12 text-sm bg-yellow-500 hover:bg-yellow-600 text-black rounded shadow-xl cursor-pointer"
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