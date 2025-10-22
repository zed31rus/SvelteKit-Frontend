<script>
  let currentUser = $state(null);

	userStore.subscribe(user => {
		currentUser = user
	})
</script>

<div class="profile flex flex-col items-center gap-4 mt-6">
  <div class="bg-black/30 backdrop-blur rounded-xl shadow-xl p-6 flex flex-col items-center gap-4">
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
</div>

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