export async function authFetch(url, options = {}) {
    let res = await fetch(url, { ...options, credentials: "include" });

    if (res.status === 401) {
        const refreshRes = await fetch("https://auth.zed31rus.ru/refresh", {
            method: "POST",
            credentials: "include"
        });

        if (refreshRes.ok) {
            res = await fetch(url, { ...options, credentials: "include" });
        } else {
            window.location.href = "/authorization";
        }
    }

    return res;
}