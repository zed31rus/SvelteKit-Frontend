<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { fetchUser } from "$lib/auth/stores/user";

    onMount(async () => {
        await fetch("https://auth.zed31rus.ru/logout", {
            method: "POST",
            credentials: "include"
        });

        fetchUser()

        goto("/authorization");
    });
</script>

<p></p>