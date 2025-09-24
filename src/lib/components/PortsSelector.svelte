<script lang="ts">
  export let ports: number[];
  export let selectedPorts: number[] = [];
  export let togglePort;
</script>

<div class="grid grid-cols-8 gap-2">
  {#each ports as port}
    <button
      type="button"
      on:click={() => togglePort(port)}
      class="w-10 h-10 cursor-pointer text-sm rounded-md border transition-colors {selectedPorts.includes(port) 
        ? 'bg-indigo-600 text-white border-indigo-600' 
        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}"
    >
      {port}
    </button>
  {/each}
</div>