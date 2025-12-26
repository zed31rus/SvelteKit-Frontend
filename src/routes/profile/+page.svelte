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
  class="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-5
         absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
         w-[90%] sm:w-3/4 md:w-2/3 lg:w-1/3 max-w-md border border-white/10"
>
  {#if currentUser}
    <button
      type="button"
      class="rounded-full hover:scale-105 transition-transform duration-200"
      onclick={() => avatarInput.click()}
    >
      <img
        src={currentUser.avatar || "/resources/avatar.png"}
        class="w-28 h-28 rounded-full border-4 border-blue-500 shadow-lg object-cover"
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

    <h1 class="text-2xl font-bold text-white tracking-wide text-center drop-shadow-md">{currentUser.nickname}</h1>
    <p class="text-gray-300 text-sm text-center break-all">{currentUser.email}</p>

    <div class="flex gap-2 mt-1">
      {#if currentUser.isAdmin}
        <span class="text-red-400 font-bold bg-white/10 px-2 py-1 rounded-lg">Админ 👑</span>
      {/if}

      {#if currentUser.isCheckedByAdmin}
        <span class="text-green-400 bg-white/10 px-2 py-1 rounded-lg">✅ Проверен</span>
      {:else}
        <span class="text-red-400 bg-white/10 px-2 py-1 rounded-lg">❌ Не проверен</span>
      {/if}
    </div>

    <form
      class="flex flex-col w-full mt-4 gap-3"
      onsubmit={(e) => {
        e.preventDefault();
        patchUserProfile(nickname, email, password);
      }}
    >
      <input
        type="text"
        class="p-2 w-full bg-black/40 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
        bind:value={nickname}
        placeholder="Сменить nickname"
      />

      <input
        type="email"
        class="p-2 w-full bg-black/40 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
        bind:value={email}
        placeholder="Сменить email"
      />

      <input
        type="password"
        class="p-2 w-full bg-black/40 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
        bind:value={password}
        placeholder="Сменить пароль"
      />

      <button
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-lg p-2 mt-2 shadow-md"
      >
        Сохранить
      </button>
    </form>

    <a href="/logout" class="text-blue-300 hover:underline hover:text-blue-400 mt-3">Выйти</a>
  {:else}
    <div class="text-white mt-10 text-center text-lg animate-pulse">Загружаем профиль...</div>
  {/if}
</div>

<svelte:head>
  <title>zed31rus_ | Profile</title>
  <meta name="description" content="Профиль пользователя zed31rus_" />
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
