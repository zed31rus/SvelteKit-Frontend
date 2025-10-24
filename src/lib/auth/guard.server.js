import { redirect } from "@sveltejs/kit";

export async function guardPage(fetch, cookies, requiredRole) {
    const AllCookies = cookies.getAll().map(c => `${c.name}=${c.value}`).join('; ');
    const cookieHeader = {
        'Cookie': AllCookies
    };

    let meRes = await fetch("https://auth.zed31rus.ru/me", {
        headers: cookieHeader
    });

    if (meRes.status === 401) {
        const refreshRes = await fetch("https://auth.zed31rus.ru/refresh", {
            headers: cookieHeader
        })

        if (!refreshRes.ok) {
            throw redirect(303, '/authorization');
        }

        meRes = await fetch("https://auth.zed31rus.ru/me", {
            headers: cookieHeader
        });
    }
    
    if (!meRes.ok) {
         throw redirect(303, '/authorization');
    }

    if (requiredRole) {
        const user = await meRes.json();
        
        if (requiredRole === "admin") {
            if (!user.isAdmin) {
                throw redirect(303, '/authorization');
            }
        } 
    }
}
