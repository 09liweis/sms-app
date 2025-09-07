<script lang="ts">
  import { auth } from '$lib/stores/auth';
  
  $: user = $auth;
  
  let notifications = true;
  let emailReports = false;
  let maxRetries = 3;
  let savedMessage = '';
  
  function saveSettings() {
    // Simulate saving settings
    savedMessage = 'Settings saved successfully!';
    setTimeout(() => savedMessage = '', 3000);
  }
</script>

<svelte:head>
  <title>Settings - SMS Dashboard</title>
</svelte:head>

<div class="space-y-6">
  <div class="card">
    <h2 class="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
    
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          value={user?.email || ''}
          class="input-field"
          disabled
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
        <input
          type="text"
          value={user?.name || ''}
          class="input-field"
          disabled
        />
      </div>
    </div>
  </div>
  
  <div class="card">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">SMS Settings</h3>
    
    <form on:submit|preventDefault={saveSettings} class="space-y-6">
      <div class="flex items-center">
        <input
          type="checkbox"
          id="notifications"
          bind:checked={notifications}
          class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <label for="notifications" class="ml-2 text-sm text-gray-700">
          Enable SMS delivery notifications
        </label>
      </div>
      
      <div class="flex items-center">
        <input
          type="checkbox"
          id="emailReports"
          bind:checked={emailReports}
          class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <label for="emailReports" class="ml-2 text-sm text-gray-700">
          Send weekly email reports
        </label>
      </div>
      
      <div>
        <label for="retries" class="block text-sm font-medium text-gray-700 mb-2">
          Max Retry Attempts
        </label>
        <select bind:value={maxRetries} class="input-field">
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={5}>5</option>
        </select>
      </div>
      
      <button type="submit" class="btn-primary">
        Save Settings
      </button>
      
      {#if savedMessage}
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {savedMessage}
        </div>
      {/if}
    </form>
  </div>
  
  <div class="card">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">API Information</h3>
    <div class="bg-gray-100 p-4 rounded-lg">
      <p class="text-sm text-gray-600 mb-2">API Endpoint:</p>
      <code class="text-sm bg-white px-2 py-1 rounded border">
        https://api.example.com/sms/send
      </code>
    </div>
  </div>
</div>