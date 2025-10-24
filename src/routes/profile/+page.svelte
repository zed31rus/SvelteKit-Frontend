<script>
  import { userStore, fetchUser } from '$lib/stores/user';

  let currentUser = $state(null);

  fetchUser()

	userStore.subscribe(user => {
		currentUser = user
	})
</script>

{#if currentUser}
  <div class="bg-black/30 backdrop-blur rounded-xl shadow-xl p-6 flex flex-col items-center gap-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-3/4 w-1/4 h-auto">
    <!-- svelte-ignore a11y_missing_attribute -->
    <img
      src={"/resources/avatar.png"}
      class="w-24 h-24 rounded-full border-2 border-gray-600 shadow-md"
    />
    <h1 class="text-xl font-bold text-white">{currentUser.nickname}</h1>
    <p class="text-gray-400 text-sm">{currentUser.email}</p>
    {#if currentUser.isAdmin}
      <span class="text-red-400 font-bold">Админ 👑</span>
    {/if}
    {#if currentUser.isCheckedByAdmin}
      <span class="text-green-400">✅ Проверен</span>
    {:else}
      <span class="text-red-400">❌Не проверен</span>
    {/if}
    <a href="/logout">Выйти</a>
  </div>
{:else}
  <div class="text-white mt-10">Загружаем профиль...</div>
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