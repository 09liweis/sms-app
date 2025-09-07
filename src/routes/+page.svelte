<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  onMount(() => {
    goto('/login');
  });
</script>

<svelte:head>
  <title>SMS Dashboard</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
  <div class="text-center">
    <div class="text-4xl mb-4">📱</div>
    <p class="text-gray-600">Redirecting to login...</p>
  </div>
</div>