import { writable } from "svelte/store";

export const userStore = writable(null);

export async function fetchUser() {
    try {
        let res = await fetch("https://auth.zed31rus.ru/me", { method: "GET", credentials: "include" });
        
        if (res.ok) {
            const data = await res.json();
            userStore.set(data.user);
            return;
        }

        if (res.status === 401) {
            const refresh = await fetch("https://auth.zed31rus.ru/refresh", { method: "POST", credentials: "include" });
            if (refresh.ok) {
                res = await fetch("https://auth.zed31rus.ru/me", { method: "GET", credentials: "include" });
                if (res.ok) {
                    const data = await res.json();
                    userStore.set(data.user);
                    return;
                }
            }
        }
        userStore.set(null);
    } catch {
        userStore.set(null);
    }
}
