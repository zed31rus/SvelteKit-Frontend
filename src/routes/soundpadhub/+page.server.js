import { guardPage } from "$lib/auth/guard.server";

export const load = async({fetch, cookies}) => {
    await guardPage(fetch, cookies);
} 