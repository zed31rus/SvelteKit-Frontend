<script>
  import { sendMessage, getGuilds, getChannels, getRoles } from "$lib/utils/discordAPI.js";
  import { onMount } from "svelte";

  let guilds = $state([]);
  let channels = $state([]);
  let roles = $state([]);
  let users = $state([]);

  let guildId = $state("");
  let channelId = $state("");
  let content = $state("");
  let textareaEl;

  let mentionEveryone = $state(false);
  let mentionRoles = $state("");
  let mentionUsers = $state("");

  let roleArray = $derived(
    mentionRoles ? mentionRoles.split(",").map(r => r.trim()).filter(Boolean) : []
  );
  let userArray = $derived(
    mentionUsers ? mentionUsers.split(",").map(u => u.trim()).filter(Boolean) : []
  );

  onMount(async () => {
    const res = await getGuilds();
    if (res?.guilds) guilds = res.guilds;
  });

  async function selectGuild(id) {
    if (!id) return;

    const chRes = await getChannels(id);
    const rlRes = await getRoles(id);

    channels = chRes?.channels || [];
    roles = rlRes?.roles || [];
  }

  function insertAtCursor(value, type = "role") {
    if (!textareaEl) return;

    const start = textareaEl.selectionStart;
    const end = textareaEl.selectionEnd;
    const before = content.slice(0, start);
    const after = content.slice(end);
    const insertText = type === "role" ? `<@&${value}>` : `<@${value}>`;

    content = before + insertText + after;

    if (type === "role") {
      mentionRoles = mentionRoles ? `${mentionRoles},${value}` : value;
    } else {
      mentionUsers = mentionUsers ? `${mentionUsers},${value}` : value;
    }

    const cursorPos = start + insertText.length;
    setTimeout(() => {
      textareaEl.focus();
      textareaEl.selectionStart = textareaEl.selectionEnd = cursorPos;
    });
  }

  async function submit() {
    if (!channelId || !content) return alert("Channel и текст обязательны");

    const res = await sendMessage(
      channelId,
      content,
      mentionEveryone,
      roleArray,
      userArray
    );

    if (res?.success) {
      content = "";
      mentionRoles = "";
      mentionUsers = "";
      alert("Сообщение отправлено");
    } else {
      alert("Ошибка отправки");
    }
  }
</script>

<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-3/4 md:w-1/2 max-w-xl space-y-4 select-none">

  <div class="rounded-xl bg-black/40 backdrop-blur-xl p-4 shadow-lg border border-white/10">
    <h2 class="text-2xl font-bold tracking-wide text-center">Discord Control Panel</h2>
  </div>

  <div class="rounded-xl bg-black/30 backdrop-blur-xl p-5 shadow-lg border border-white/10 space-y-4">

    <div class="space-y-1">
      <label class="text-xs opacity-70">Guild</label>
      <select
        class="w-full rounded-lg bg-black/40 px-3 py-2 outline-none border border-white/10"
        bind:value={guildId}
        onchange={(e) => selectGuild(e.target.value)}>
        <option value="">Выбери сервер</option>
        {#each guilds as guild}
          <option value={guild.id}>{guild.name}</option>
        {/each}
      </select>
    </div>

    <div class="space-y-1">
      <label class="text-xs opacity-70">Channel</label>
      <select
        class="w-full rounded-lg bg-black/40 px-3 py-2 outline-none border border-white/10"
        bind:value={channelId}>
        <option value="">Выбери канал</option>
        {#each channels as channel}
          <option value={channel.id}>#{channel.name}</option>
        {/each}
      </select>
    </div>

    <div class="space-y-1">
      <label class="text-xs opacity-70">Сообщение</label>
      <textarea
        bind:this={textareaEl}
        bind:value={content}
        rows="4"
        class="w-full rounded-lg bg-black/40 px-3 py-2 outline-none resize-y border border-white/10"
        placeholder="Текст сообщения">
      </textarea>
    </div>

    <label class="flex items-center gap-2 text-sm">
      <input type="checkbox" class="accent-blue-500" bind:checked={mentionEveryone} />
      <span>@everyone</span>
    </label>

    <div class="space-y-1">
      <label class="text-xs opacity-70">Роли (клик чтобы вставить в сообщение)</label>
      <div class="flex flex-wrap gap-2 text-xs opacity-70 mt-1">
        {#each roles as r}
          <span
            class="bg-black/40 px-2 py-0.5 rounded border border-white/10 cursor-pointer hover:bg-black/60"
            onclick={() => insertAtCursor(r.id, "role")}>
            @{r.name}
          </span>
        {/each}
      </div>
    </div>

    <div class="space-y-1">
      <label class="text-xs opacity-70">Пользователи (клик чтобы вставить в сообщение)</label>
      <div class="flex flex-wrap gap-2 text-xs opacity-70 mt-1">
        {#each userArray as u}
          <span
            class="bg-black/40 px-2 py-0.5 rounded border border-white/10 cursor-pointer hover:bg-black/60"
            onclick={() => insertAtCursor(u, "user")}>
            @{u}
          </span>
        {/each}
      </div>
    </div>

    <button
      class="w-full py-3 rounded-xl bg-blue-600/80 hover:bg-blue-700 transition shadow-md font-semibold"
      onclick={submit}>
      Отправить
    </button>

  </div>
</div>

<svelte:head>
  <title>zed31rus_ | Discord Admin</title>
  <meta name="description" content="Discord admin page for zed31rus_" />
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
