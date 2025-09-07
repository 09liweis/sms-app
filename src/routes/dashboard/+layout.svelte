<script lang="ts">
  import { auth } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import DashboardLayout from '$lib/components/DashboardLayout.svelte';
  
  let isAuthenticated = false;
  
  onMount(() => {
    const unsubscribe = auth.subscribe(user => {
      if (!user) {
        goto('/login');
      } else {
        isAuthenticated = true;
      }
    });
    return unsubscribe;
  });
</script>

{#if isAuthenticated}
  <DashboardLayout>
    <slot />
  </DashboardLayout>
{/if}