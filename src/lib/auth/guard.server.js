import { redirect } from "@sveltejs/kit";

export async function requireUser(fetch, cookies) {
    const AllCookies = cookies.getAll().map(c => `${c.name}=${c.value}`).join('; ')
    const res = await fetch("https://auth.zed31rus.ru/me", {
        headers: {
            'Cookie': AllCookies
        }
    });

    if (!res.ok) {
        throw redirect(303, '/authorization')
    }

    const data = await res.json()

    return data.user
}