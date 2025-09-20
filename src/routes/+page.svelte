<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { isAuthenticated } from '$lib/stores/auth';
	import LoginForm from '$lib/components/LoginForm.svelte';
  import { WEBSITE_NAME } from '$lib/constants/text';

	onMount(() => {
		// Check if user is already authenticated
		const unsubscribe = isAuthenticated.subscribe(value => {
			if (value) {
				goto('/dashboard');
			}
		});

		return unsubscribe;
	});
</script>

<svelte:head>
	<title>{WEBSITE_NAME} - SMS Management Platform</title>
</svelte:head>

<LoginForm />