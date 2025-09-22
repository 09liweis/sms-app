<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { isAuthenticated } from '$lib/stores/auth';
	import Sidebar from '$lib/components/Sidebar.svelte';

	let { children } = $props();

	onMount(() => {
		const unsubscribe = isAuthenticated.subscribe(value => {
			if (!value) {
				// goto('/');
			}
		});

		return unsubscribe;
	});
</script>

<div class="lg:flex min-h-screen bg-gray-50">
	<Sidebar />
	<main class="flex-1 lg:ml-0 max-h-screen overflow-y-auto">
		{@render children?.()}
	</main>
</div>