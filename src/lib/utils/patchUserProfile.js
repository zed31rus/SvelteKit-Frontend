import { fetchUser } from '$lib/stores/user.js';

export async function patchUserProfile(nickname, email, password, avatar) {
    const formData = new FormData();

    if (nickname) formData.append("nickname", nickname)
    if (email) formData.append("email", email)
    if (password) formData.append("password", password)
    if (avatar) formData.append("avatar", avatar)

        const res = await fetch("https://auth.zed31rus.ru/me", {
            method: "PATCH",
            credentials: "include",
            body: formData
        });

        await fetchUser();
        return res.json()
}