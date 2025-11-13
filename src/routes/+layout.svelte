<script>
	import { Tween } from 'svelte/motion';
	import { linear } from 'svelte/easing';
	import '../app.css';
	import { userStore, fetchUser } from '$lib/stores/user';

	let sidePanelSize = new Tween(0, { duration: 200, easing: linear });
	let sidePanelState = $state(0); // 0 = закрыта, 1 = hover, 2 = открыта
	let sidePanelRef = $state(null);
	let hoverPanelRef = $state(null);
	let currentUser = $state(null);
	
	$effect(() => {
		fetchUser();
	})
	
	userStore.subscribe(user => currentUser = user);

	let { children } = $props();

	let targetSize = $derived(
		sidePanelState === 2 ? 256 :
		sidePanelState === 1 ? 16 : 0
	);

	$effect(() => {
		sidePanelSize.target = targetSize;
	});

	$effect(() => {
		function handleClickOutside(event) {
			if (
				sidePanelRef && !sidePanelRef.contains(event.target) &&
				hoverPanelRef && !hoverPanelRef.contains(event.target)
			) {
				sidePanelState = 0;
			}
		}
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	});
</script>

<!-- Hover-зона -->
<div
  bind:this={hoverPanelRef}
  class="absolute top-0 left-0 z-1000 w-8 h-full"
  class:opacity-0={sidePanelState === 2}
  class:pointer-events-none={sidePanelState === 2}
  role="presentation"
  onmouseenter={() => {
    if (sidePanelState === 0) sidePanelState = 1;
  }}
  onmouseleave={() => {
    if (sidePanelState === 1) sidePanelState = 0;
  }}
  onclick={() => {
    if (sidePanelState === 1) sidePanelState = 2;
    else if (sidePanelState === 2) sidePanelState = 0;
  }}>

	<svg 
		class="w-6 h-6 text-white top-5 absolute -left-[6px]"
		xmlns="http://www.w3.org/2000/svg" 
		fill="none" 
		viewBox="0 0 24 24" 
		stroke="currentColor">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
  	</svg>
</div>



<!-- Основная панель -->
<div
	bind:this={sidePanelRef}
	class="flex flex-col absolute top-0 left-0 h-full z-1 overflow-hidden bg-black/50 rounded-r-xl backdrop-blur gap-4 pt-4 pb-4"
	class:pl-2={sidePanelState === 2}
	style="width: {sidePanelSize.current}px;">
	{#if sidePanelState === 2}
		<a href="/"><h1>Home</h1></a>
		<a href="/soundpad"><h1>Soundpad</h1></a>
		<a href="/soundpadhub">soundpadhub</a>
		<div class="absolute bottom-4">
			{#if currentUser?.nickname}
				<a href="/profile">{currentUser.nickname}</a>
			{:else}
				<a href="/authorization">Login/Registration</a>
			{/if}
		</div>
	{/if}
</div>

{@render children()}