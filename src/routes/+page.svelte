<script>
    import { Tween } from "svelte/motion";
    import { linear } from "svelte/easing";

    let DevHeiht = new Tween(0, { duration: 800, easing: linear });
</script>

<div class="min-h-screen flex flex-col items-center gap-5 text-white p-4 text-center">

  <h1 class="text-4xl font-bold">zed31rus_</h1>

  <div class="flex gap-6 text-lg bg-black/30 rounded-xl shadow-xl backdrop-blur p-3">
    <a href="https://t.me/zed31rus" target="_blank" class="hover:underline">📲 Telegram</a>
    <a href="https://discord.gg/3TJBsH8n36" target="_blank" class="hover:underline">💬 Discord</a>
    <a href="https://steamcommunity.com/id/zed31rus_" target="_blank" class="hover:underline">🎮 Steam</a>
  </div>

  <div class="bg-black/30 p-6 rounded-xl shadow-xl backdrop-blur w-full max-w-lg text-left">
    <h2 class="text-2xl font-bold mb-4">🛠 Прогресс разработки</h2>
    <ul class="list-disc list-inside space-y-1 text-sm">
      <li>✅ Адаптивная панель со звуками</li>
      <li>✅ Поиск и сортировка</li>
      <li>✅ Боковое меню навигации</li>
      <li>✅ Авторизация на сайте</li>
      <li>✅ Добавление звуков</li>
      <li>💡 В планах история воспроизведения</li>
      <li>🛠️ В разработке <a href="https://github.com/zed31rus/soundnode">soundnode</a></li>
    </ul>
  </div>
</div>

<svelte:head>
  <title>zed31rus_ | Home</title>
  <meta name="description" content="Home zed31rus_">
  <style>
    body {
    background-image: url('/resources/background.png');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    color: white;
    overflow: hidden;
  }

  html {
    overflow: hidden;
    height: 100%;
  }
  </style>
</svelte:head>