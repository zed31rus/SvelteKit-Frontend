const API = "https://discord.zed31rus.ru";

async function post(url, body = {}) {
  const res = await fetch(API + url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  return await res.json();
}

export function sendMessage(channelId, content, mentionEveryone, mentionRoles, mentionUsers) {
  return post("/sendMessage", {
    channelId,
    content,
    mentionEveryone,
    mentionRoles,
    mentionUsers
  });
}

export function getGuilds() {
  return post("/getGuilds");
}

export function getChannels(guildId) {
  return post("/getChannels", { guildId });
}

export function getRoles(guildId) {
  return post("/getRoles", { guildId });
}
