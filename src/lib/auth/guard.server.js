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
        const body = await Res.json();
        console.log(body)
        
        if (requiredRole === "admin") {
            if (!body?.user?.isAdmin) {
                throw redirect(303, '/profile');
            }
        } 
    }
}
