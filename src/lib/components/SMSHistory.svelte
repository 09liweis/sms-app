<script lang="ts">
  import { smsStore, type SMSMessage } from '$lib/stores/sms';
  
  $: messages = $smsStore;
  
  function getStatusColor(status: SMSMessage['status']) {
    switch (status) {
      case 'sent': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }
  
  function formatDate(date: Date) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
</script>

<div class="card">
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-xl font-semibold text-gray-900">SMS History</h2>
    <button 
      on:click={() => smsStore.clear()}
      class="btn-secondary text-sm"
    >
      Clear History
    </button>
  </div>
  
  {#if messages.length === 0}
    <div class="text-center py-12 text-gray-500">
      <div class="text-4xl mb-4">📱</div>
      <p class="text-lg">No SMS messages sent yet</p>
      <p class="text-sm">Your sent messages will appear here</p>
    </div>
  {:else}
    <div class="space-y-4">
      {#each messages as sms}
        <div class="border rounded-lg p-4 hover:bg-gray-50 transition duration-200">
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="font-medium text-gray-900">To: {sms.to}</p>
              <p class="text-sm text-gray-500">{formatDate(sms.timestamp)}</p>
            </div>
            <span class="px-2 py-1 text-xs font-medium rounded-full {getStatusColor(sms.status)}">
              {sms.status.toUpperCase()}
            </span>
          </div>
          <p class="text-gray-700 bg-gray-100 p-3 rounded text-sm">{sms.message}</p>
        </div>
      {/each}
    </div>
  {/if}
</div>