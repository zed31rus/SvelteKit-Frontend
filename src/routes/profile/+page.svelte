<script>
  import { userStore, fetchUser } from '$lib/stores/user.js';
  import { patchUserProfile } from '$lib/utils/patchUserProfile.js';

  let currentUser = $state(null);
  let nickname = $state('');
  let email = $state('');
  let password = $state('');
  let avatarFile = null;
  let avatarInput = $state();

  fetchUser();

  userStore.subscribe(user => {
    currentUser = user;
  });
</script>

  <div
    class="bg-black/30 backdrop-blur rounded-xl shadow-xl p-6 flex flex-col items-center gap-4 
           absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
           w-[90%] sm:w-full md:w-full lg:w-1/4 h-auto max-w-sm"
  >
  {#if currentUser}
    <button
      type="button"
      class="rounded-full"
      onclick={() => avatarInput.click()}
    >
      <img
        src={currentUser.avatar || "/resources/avatar.png"}
        class="w-24 h-24 rounded-full border-2 border-gray-600 shadow-md"
        alt="{nickname} avatar"
      />
    </button>

    <input
      type="file"
      accept="image/*"
      bind:this={avatarInput}
      onchange={async (e) => {
        avatarFile = e.target.files[0]
        if (!avatarFile) return

        await patchUserProfile(null, null, null, avatarFile)
      }}
      style="display:none"
    />

    <h1 class="text-xl font-bold text-white break-words text-center">{currentUser.nickname}</h1>
    <p class="text-gray-400 text-sm text-center break-all">{currentUser.email}</p>

    {#if currentUser.isAdmin}
      <span class="text-red-400 font-bold">Админ 👑</span>
    {/if}

    {#if currentUser.isCheckedByAdmin}
      <span class="text-green-400">✅ Проверен</span>
    {:else}
      <span class="text-red-400">❌ Не проверен</span>
    {/if}

    <form onsubmit={(e) => {
      e.preventDefault()
      patchUserProfile(nickname, email, password)
    }}>

      <input type="text" bind:value={nickname} placeholder="Новый ник"/>
      <input type="email" bind:value={email} placeholder="Новый email"/>
      <input type="password" bind:value={password} placeholder="Новый пароль"/>

      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Сохранить</button>
    </form>

    <a href="/logout" class="text-blue-400 hover:underline">Выйти</a>
  {:else}
    <div class="text-white mt-10 text-center text-lg">Загружаем профиль...</div>
  {/if}
  </div>

<svelte:head>
  <title>zed31rus_ | Profile</title>
  <meta name="description" content="Профиль пользователя zed31rus_">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      background-image: url('/resources/background.png');
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      color: white;
      overflow-x: hidden;
    }
  </style>
</svelte:head>
