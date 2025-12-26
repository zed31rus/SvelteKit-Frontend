<script>
  import { userStore, fetchUser } from '$lib/stores/user';
  import { onMount } from 'svelte';

  let { socket = $bindable(), selectednode = $bindable() } = $props();
  let currentUser = $state(null);
  let socketState = $state(null);
  let nodes = $state([]);

  onMount(() => {
    fetchUser();

    if (socket?.on) {
      socket.on("nodesChanged", (req) => {
        nodes = req || [];
      });
    }

    if (window?.socketApi?.onSocketStatusUpdate) {
      window.socketApi.onSocketStatusUpdate((state) => {
        socketState = state;
      });
    }
  });

  userStore.subscribe((user) => {
    currentUser = user;
  });

  function nodesClickHandler(node) {
    socket.emit("nodeConnect", node, (res) => {
      if (res?.ok) selectednode = node;
    });
  }
</script>

<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-3/4 md:w-1/2 h-3/4 space-y-4 select-none">

  <div class="rounded-xl bg-black/40 backdrop-blur-xl p-3 flex justify-center shadow-lg border border-white/10">
    <p class="text-3xl font-bold drop-shadow-md tracking-wide">Soundnodes</p>
  </div>

  <div class="rounded-xl bg-black/30 backdrop-blur-xl p-5 h-[calc(50%+200px)] overflow-auto shadow-lg border border-white/10">
    {#if nodes.length > 0}
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 content-start p-1">
        {#each nodes as node}
          <button
            onclick={() => nodesClickHandler(node)}
            class="bg-black/30 p-4 backdrop-blur rounded-xl w-full text-center hover:bg-black/50 transition shadow-md border border-white/10 flex flex-col items-center hover:scale-[1.03] duration-200"
          >
            <img
              src={node.avatar || "/resources/avatar.png"}
              class="w-20 h-20 rounded-full border-2 border-blue-500 shadow-lg mb-3 object-cover"
              alt="User avatar"
            />
            <span class="text-white font-semibold break-all">{node.nickname}</span>
          </button>
        {/each}
      </div>
    {:else}
      <div class="flex justify-center items-center mt-10">
        <p class="text-2xl text-gray-200 opacity-80 drop-shadow-lg">Как-то пустовато тут... 😢</p>
      </div>
    {/if}

    {#if window?.socketApi?.activateSocket}
      {#if currentUser}
        <div class="flex justify-center mt-6">
          <button
            onclick={async () => socketState ? window?.socketApi?.disconnectSocket() : await window?.socketApi?.activateSocket()}
            class="px-6 py-2 bg-blue-600/80 rounded-lg hover:bg-blue-700 transition shadow-md text-white font-semibold"
          >
            {#if !socketState}
              Подключиться
            {:else if socketState == "CONNECTING"}
              Подключение...
            {:else if socketState == "CONNECTED"}
              Аутентификация...
            {:else if socketState == "AUTHED"}
              Отключиться
            {/if}
          </button>
        </div>
      {:else}
        <div class="flex justify-center mt-6">
          <a href="/authorization" class="text-blue-300 hover:underline hover:text-blue-400">Зарегистрироваться / Войти</a>
        </div>
      {/if}
    {:else}
      <div class="flex justify-center mt-6">
        <a
          class="text-blue-300 hover:text-blue-400 hover:underline"
          href="https://github.com/zed31rus/soundnode/releases/download/1.1.0/soundnode.Setup.exe"
        >
          Скачать Soundnode
        </a>
      </div>
    {/if}
  </div>
</div>
