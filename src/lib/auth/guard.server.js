import { redirect } from "@sveltejs/kit";

export async function guardPage(fetch, cookies, requiredRole) {
    const AllCookies = cookies.getAll().map(c => `${c.name}=${c.value}`).join('; ');
    const cookieHeader = {
        'Cookie': AllCookies
    };

    let Res = await fetch("https://auth.zed31rus.ru/me", {
        headers: cookieHeader
    });
    
    if (!Res.ok) {
         throw redirect(303, '/authorization');
    }

    if (requiredRole) {
        const user = await Res.json();
        
        if (requiredRole === "admin") {
            if (!user.isAdmin) {
                throw redirect(303, '/profile');
            }
        } 
    }
}
