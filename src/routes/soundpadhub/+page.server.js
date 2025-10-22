import { requireUser } from "$lib/auth/guard.server";

export const load = async({fetch, cookies}) => {
    const user = await requireUser(fetch, cookies);

    return { user }
} 