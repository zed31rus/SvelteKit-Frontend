<script>
	import { Tween } from 'svelte/motion';
	import { linear } from 'svelte/easing';
	import '../app.css';
	import { userStore, fetchUser } from '$lib/stores/user.js';
    import { onMount } from 'svelte';

	let sidePanelSize = new Tween(0, { duration: 200, easing: linear });
	let sidePanelState = $state(false); // false закрыта,true открыта
	let sidePanelRef = $state(null);
	let currentUser = $state(null);
	
	onMount(() => {
		fetchUser();
	})
	
	userStore.subscribe(user => currentUser = user);

	let { children } = $props();

	let targetSize = $derived(
		sidePanelState ? 256 : 16 
	);

	$effect(() => {
		sidePanelSize.target = targetSize;
	});

	onMount(() => {
		function handleClickOutside(event) {
			if (
				sidePanelRef && !sidePanelRef.contains(event.target)
			) {
				sidePanelState = 0;
			}
		}
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	});
</script>



<!-- Основная панель -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={sidePanelRef}
	class="flex flex-col absolute top-0 left-0 h-full z-1 overflow-hidden bg-black/50 rounded-r-xl backdrop-blur gap-4 pt-4 pb-4"
	class:pl-2={sidePanelState}
	style="width: {sidePanelSize.current}px;"
	onclick={() => {sidePanelState = !sidePanelState}}
	>
	{#if sidePanelState}
		<a href="/"><h1>Home</h1></a>
		<a href="/soundpad"><h1>Soundpad</h1></a>
		<a href="/soundpadhub">soundpadhub</a>
		{#if currentUser?.isAdmin} 
			<a href="/discord">discord</a>
		{/if}
		<div class="absolute bottom-4">
			{#if currentUser?.nickname}
				<a href="/profile">{currentUser.nickname}</a>
			{:else}
				<a href="/authorization">Login/Registration</a>
			{/if}
		</div>
	{/if}
</div>
<div class="ml-8">
	{@render children()}
</div>