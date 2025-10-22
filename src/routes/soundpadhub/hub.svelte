<script>
    let { socket, selectednode } = $props();


    socket.on("nodesChanged", (req, res) => {
        nodes = req
    })

    function nodesClickHandler(node) {
        selectednode = node.login
        socket.emit("nodeConnect", node, (res) => {})
    }

    let nodes = $state({})
    $inspect(nodes)

</script>
<div class="absolute l-1 t-1 mb-2 shadow-xl bg-black/30 p-2 backdrop-blur rounded-xl overflow-auto h-auto">
    <div class="content-start grid grid-cols-3 gap-1">
        {#each nodes as node}
            <button onclick={() => {nodesClickHandler(node)}} class="bg-black/30 p-2 backdrop-blur rounded-xl overflow-auto h-auto">
                {node.nickname}
            </button>
        {/each}
    </div>
</div>

{#if window?.socketApi?.activateSocket}
    <button onclick={async () => {
        await window?.socketApi?.activateSocket()
    }}>
        connect
    </button>
{/if}