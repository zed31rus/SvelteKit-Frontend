export async function authFetch(url, options = {}) {
    const res = await fetch(url, { ...options, credentials: "include" });

    if (!refreshRes.ok) {
        window.location.href = "/authorization";
    }

    return res;
}