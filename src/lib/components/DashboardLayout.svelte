<script lang="ts">
  import Sidebar from './Sidebar.svelte';
  export let title = 'Dashboard';
</script>

<div class="flex min-h-screen bg-gray-50">
  <Sidebar />
  
  <main class="flex-1 p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">{title}</h1>
      <slot />
    </div>
  </main>
</div>