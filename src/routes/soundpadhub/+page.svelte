<script>
    import { io } from "socket.io-client"
    import Soundpad from "./sounpdad.svelte"
    import Hub from "./hub.svelte"
    const socket = io("https://clients.zed31rus.ru")
    let selectednode = $state(null);

</script>

{#if selectednode}
    <Soundpad socket={socket}/>
{:else}
    <Hub selectednode={selectednode} socket={socket}/>
{/if}

<svelte:head>
  <title>zed31rus_ | Profile</title>
  <meta name="description" content="Login/Register page for zed31rus_">
  <style>
    body {
      background-image: url('/resources/background.png');
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      color: white;
    }
  </style>
</svelte:head>