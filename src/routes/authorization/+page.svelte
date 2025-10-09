<script>
    import { fetchUser } from "$lib/stores/user";

  let mode = 'login'; // "login" или "register"

  let login = "";
  let email = "";
  let password = "";
  let nickname = "";

  async function submitForm() {
    const endpoint = mode === 'login'
      ? 'https://auth.zed31rus.ru/login'
      : 'https://auth.zed31rus.ru/register';

    const body = mode === 'login'
      ? { login, password }
      : { login, email, password, nickname };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      window.location.href = "/profile"
      
      fetchUser();
    } catch (err) {
      alert("Ошибка: " + err.message);
      console.error(err)
    }
  }
</script>

<div class="flex items-center justify-center h-screen">
  <div class="bg-black/50 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col gap-6">
    <h1 class="text-center text-2xl font-bold">
      {mode === 'login' ? 'Вход' : 'Регистрация'}
    </h1>

    <form on:submit|preventDefault={submitForm} class="flex flex-col gap-4">

      {#if mode === 'login'}
        <!-- login -->
        <input
          type="text"
          placeholder="Логин"
          bind:value={login}
          class="px-4 py-2 bg-black/30 border-0 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
        />

        <!-- password -->
        <input
          type="password"
          placeholder="Пароль"
          bind:value={password}
          class="px-4 py-2 bg-black/30 border-0 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
        />
      {:else if mode === 'register'}
        <!-- login -->
        <input
          type="text"
          placeholder="Логин"
          bind:value={login}
          class="px-4 py-2 bg-black/30 border-0 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
        />

        <!-- email -->
        <input
          type="email"
          placeholder="Email"
          bind:value={email}
          class="px-4 py-2 bg-black/30 border-0 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
        />

        <!-- password -->
        <input
          type="password"
          placeholder="Пароль"
          bind:value={password}
          class="px-4 py-2 bg-black/30 border-0 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
        />

        <!-- nickname -->
        <input
          type="text"
          placeholder="Никнейм"
          bind:value={nickname}
          class="px-4 py-2 bg-black/30 border-0 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
        />
      {/if}

      <button
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 transition text-white rounded-lg px-4 py-2 font-semibold shadow-lg"
      >
        {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
      </button>
    </form>

    <div class="text-center text-sm text-gray-400">
      {#if mode === 'login'}
        Нет аккаунта?
        <button
          type="button"
          class="text-blue-400 hover:underline"
          on:click={() => mode = 'register'}
        >
          Зарегистрироваться
        </button>
      {:else}
        Уже есть аккаунт?
        <button
          type="button"
          class="text-blue-400 hover:underline"
          on:click={() => mode = 'login'}
        >
          Войти
        </button>
      {/if}
    </div>
  </div>
</div>

<svelte:head>
  <title>zed31rus_ | Auth</title>
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
