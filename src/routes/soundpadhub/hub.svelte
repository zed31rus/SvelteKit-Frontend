<script>
  import { userStore, fetchUser } from '$lib/stores/user';
    import { onMount } from 'svelte';
  let { socket = $bindable(), selectednode = $bindable() } = $props();
  let currentUser = $state(null);
  let socketState = $state(null);
	
	onMount(() => {
		fetchUser();
	})
	
	userStore.subscribe((user) => {currentUser = user});

  let nodes = $state({})

  socket.on("nodesChanged", (req, res) => {
      nodes = req
  })

  function nodesClickHandler(node) {
      socket.emit("nodeConnect", node, (res) => {
          if (res.ok) {
              selectednode = node
          }
      })
  }

  onMount(() => {
    if (window?.socketApi?.onSocketStatusUpdate) {
      window.socketApi.onSocketStatusUpdate((state) => {
        socketState = state
      })
    }
  })  

</script>
<div class="absolute left-1/2 -translate-x-1/2 bottom-[calc(50%+100px)] transform translate-y-[calc(75%-50px)] w-1/2 h-3/4 space-y-4">
    
  <div class="rounded-xl bg-black/30 backdrop-blur p-2 flex justify-center">
    <p class="text-2xl">Soundnodes</p>
  </div>

  <div class="rounded-xl bg-black/30 backdrop-blur p-5 h-[calc(50%+200px)] overflow-auto">
    {#if nodes.length != 0}
      <div class="grid grid-cols-3 gap-2 content-start">
        {#each nodes as node}

          <button
            onclick={() => nodesClickHandler(node)}
            class="bg-black/30 p-2 backdrop-blur rounded-xl overflow-auto w-full text-center hover:bg-black/50 transition flex flex-col items-center"
          >
            <img
              src={currentUser.avatar || "/resources/avatar.png"}
              class="w-24 h-24 rounded-full border-2 border-gray-600 shadow-md mb-4 mt-4"
              alt="User avatar"
            />
            {node.nickname}
          </button>

        {/each}
      </div>
    {:else}
      <div class="flex justify-center items-center mt-10">
        <p class="text-2xl  text-white drop-shadow-lg select-none">
          Как то пустовато тут... 😢
        </p>
      </div>
    {/if}

    {#if window?.socketApi?.activateSocket && currentUser}
      <div class="flex justify-center mt-4">
        <button
          onclick={async () => socketState ? window?.socketApi?.disconnectSocket() : await window?.socketApi?.activateSocket()}
          class="px-4 py-2 bg-black/40 rounded-lg hover:bg-black/60 transition">
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
      <div class="flex justify-center mt-4">
        <a href=https://github.com/zed31rus/soundnode/releases/download/1.1.0/soundnode.Setup.exe>Скачать Soundnode</a>
      </div>
    {/if}
  </div>
</div>