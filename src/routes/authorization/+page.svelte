<script>
  import { fetchUser } from "$lib/stores/user";

  let mode = "login";

  let login = "";
  let email = "";
  let password = "";
  let nickname = "";

  async function submitForm() {

    if (mode === "login") {

      try {
        const res = await fetch("https://auth.zed31rus.ru/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            login: login,
            password: password
          })
        });

        fetchUser();
        window.location.href = "/profile";
      } catch (err) {
        alert("Ошибка");
        console.error(err);
      }
    }

    else if (mode === "register") {
      try {
        const res = await fetch("https://auth.zed31rus.ru/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            login: login.trim(),
            email: email.trim(),
            nickname: nickname.trim(),
            password: password
          })
        });

        const data = await res.json();

        if (!res.ok) {
          alert("Ошибка регистрации: " + (data.message || res.status));
          console.error(data);
          return;
        }
      } catch (err) {
        alert("Ошибка");
        console.error(err);
      }
    }
  }
</script>

<div class="flex items-center justify-center h-screen px-4">
  <div class="bg-black/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6 border border-white/10">

    <!-- Title -->
    <h1 class="text-center text-3xl font-extrabold tracking-wide drop-shadow-md">
      {mode === "login" ? "Вход" : "Регистрация"}
    </h1>

    <form class="flex flex-col gap-4" on:submit|preventDefault={submitForm}>

      {#if mode === "login"}

        <!-- ЛОГИН -->
        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-300">Логин</label>
          <input
            type="text"
            bind:value={login}
            placeholder="Введите логин"
            class="px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <!-- ПАРОЛЬ -->
        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-300">Пароль</label>
          <input
            type="password"
            bind:value={password}
            placeholder="Введите пароль"
            class="px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

      {:else}

        <!-- ЛОГИН -->
        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-300">Логин</label>
          <input
            type="text"
            bind:value={login}
            placeholder="Введите логин"
            class="px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <!-- EMAIL -->
        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-300">Email</label>
          <input
            type="email"
            bind:value={email}
            placeholder="Введите email"
            class="px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <!-- ПАРОЛЬ -->
        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-300">Пароль</label>
          <input
            type="password"
            bind:value={password}
            placeholder="Введите пароль"
            class="px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <!-- НИКНЕЙМ -->
        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-300">Никнейм</label>
          <input
            type="text"
            bind:value={nickname}
            placeholder="Введите никнейм"
            class="px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

      {/if}

      <!-- SUBMIT -->
      <button
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-xl p-3 shadow-md mt-2"
      >
        {mode === "login" ? "Войти" : "Зарегистрироваться"}
      </button>
    </form>


    <!-- SWITCH MODE -->
    <div class="text-center text-sm text-gray-300 pt-2">
      {#if mode === "login"}
        Нет аккаунта?
        <button
          class="text-blue-400 hover:text-blue-300 hover:underline transition"
          on:click={() => mode = "register"}
        >
          Зарегистрироваться
        </button>
      {:else}
        Уже есть аккаунт?
        <button
          class="text-blue-400 hover:text-blue-300 hover:underline transition"
          on:click={() => mode = "login"}
        >
          Войти
        </button>
      {/if}
    </div>
  </div>
</div>

<svelte:head>
  <title>zed31rus_ | Auth</title>
  <meta name="description" content="Login/Register page for zed31rus_" />
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
