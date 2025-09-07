<script>
	import { Tween } from 'svelte/motion';
	import { linear } from 'svelte/easing';
	import '../app.css';
	import { onMount, tick } from 'svelte';
	import { authFetch } from '$lib/auth/auth';
	import { page } from '$app/stores';
	import { userStore, fetchUser } from '$lib/auth/stores/user';

	let sidePanelSize = new Tween(0, { duration: 200, easing: linear });
	let sidePanelVisible = $state(false);
	let sidePanelLittle = $state(false);
	let sidePanelRef = $state(null);
	let hoverPanelRef = $state(null);
	let nickname = $state(null);
	let currentPage = $page.url.href;
	let currentUser = $state(null);
	userStore.subscribe(user => {
		currentUser = user
	})

	let { children } = $props();

	let targetSize = $derived(
		sidePanelVisible ? 256 :
		sidePanelLittle ? 16 : 0
	);

	onMount( () => {
		fetchUser();
	})

	onMount(async () => {
		await tick();

		// анимашкээээ
		setTimeout(() => { if (!sidePanelLittle  == true || !sidePanelVisible == true) {sidePanelSize.target = 8}}, 1000);
		setTimeout(() => { if (!sidePanelLittle  == true || !sidePanelVisible == true) {sidePanelSize.target = 0}}, 1500);
		setTimeout(() => { if (!sidePanelLittle  == true || !sidePanelVisible == true) {sidePanelSize.target = 8}}, 2000);
		setTimeout(() => { if (!sidePanelLittle  == true || !sidePanelVisible == true) {sidePanelSize.target = 0}}, 2500);
	});

	$effect(() => {
		sidePanelSize.target = targetSize;
	});

	$effect(() => {
		function handleClickOutside(event) {
			if (
				sidePanelRef && !sidePanelRef.contains(event.target) &&
				hoverPanelRef && !hoverPanelRef.contains(event.target)
			) {
				sidePanelVisible = false;
				sidePanelLittle = false;
			}
		}
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	});
</script>

<!-- Hover панелька(в мытищах) -->
<div
	bind:this={hoverPanelRef}
	class="absolute top-0 left-0 z-2 opacity-0 w-4 h-full"
	role="presentation"
	onclick={() => {sidePanelVisible = !sidePanelVisible;}}
	onmouseenter={() => sidePanelLittle = true}
	onmouseleave={() => sidePanelLittle = false}
	ontouchstart={() => sidePanelLittle = true}>
</div>

<!-- Основная панелька(в мытищах) -->
<div
	bind:this={sidePanelRef}
	class="flex flex-col absolute top-0 left-0 h-full z-1 overflow-hidden bg-black/50 rounded-r-xl backdrop-blur gap-4 pt-4 pb-4"
	class:pl-2={sidePanelVisible}
	style="width: {sidePanelSize.current}px;">
	{#if sidePanelVisible}
		<a href="/"><h1>Home</h1></a>
		<a href="/soundpad"><h1>Soundpad</h1></a>
		<div class="absolute bottom-4">
			{#if currentUser && currentUser.nickname}
				<a href="/profile">{currentUser.nickname}</a>
			{:else}
				<a href="/authorization">Login/Registration</a>
			{/if}
		</div>
	{/if}
</div>

{@render children()}
