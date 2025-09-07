<script lang="ts">
  import { smsStore } from '$lib/stores/sms';
  import { auth } from '$lib/stores/auth';
  
  $: messages = $smsStore;
  $: user = $auth;
  
  $: totalMessages = messages.length;
  $: sentMessages = messages.filter(m => m.status === 'sent').length;
  $: failedMessages = messages.filter(m => m.status === 'failed').length;
  $: pendingMessages = messages.filter(m => m.status === 'pending').length;
</script>

<svelte:head>
  <title>Dashboard - SMS Dashboard</title>
</svelte:head>

<div class="space-y-8">
  <!-- Welcome Section -->
  <div class="card">
    <h2 class="text-2xl font-semibold text-gray-900 mb-2">
      Welcome back, {user?.name || 'User'}! 👋
    </h2>
    <p class="text-gray-600">
      Manage your SMS campaigns and track your messaging performance.
    </p>
  </div>
  
  <!-- Stats Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="card">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Total Messages</p>
          <p class="text-3xl font-bold text-gray-900">{totalMessages}</p>
        </div>
        <div class="text-3xl">📊</div>
      </div>
    </div>
    
    <div class="card">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Sent</p>
          <p class="text-3xl font-bold text-green-600">{sentMessages}</p>
        </div>
        <div class="text-3xl">✅</div>
      </div>
    </div>
    
    <div class="card">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Failed</p>
          <p class="text-3xl font-bold text-red-600">{failedMessages}</p>
        </div>
        <div class="text-3xl">❌</div>
      </div>
    </div>
    
    <div class="card">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Pending</p>
          <p class="text-3xl font-bold text-yellow-600">{pendingMessages}</p>
        </div>
        <div class="text-3xl">⏳</div>
      </div>
    </div>
  </div>
  
  <!-- Quick Actions -->
  <div class="card">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
    <div class="flex flex-wrap gap-4">
      <a href="/dashboard/send-sms" class="btn-primary">
        📱 Send New SMS
      </a>
      <a href="/dashboard/history" class="btn-secondary">
        📋 View History
      </a>
    </div>
  </div>
  
  <!-- Recent Activity -->
  {#if messages.length > 0}
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Messages</h3>
      <div class="space-y-3">
        {#each messages.slice(0, 5) as message}
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex-1">
              <p class="font-medium text-gray-900">To: {message.to}</p>
              <p class="text-sm text-gray-600 truncate max-w-md">{message.message}</p>
            </div>
            <span class="px-2 py-1 text-xs font-medium rounded-full {
              message.status === 'sent' ? 'text-green-600 bg-green-100' :
              message.status === 'failed' ? 'text-red-600 bg-red-100' :
              'text-yellow-600 bg-yellow-100'
            }">
              {message.status.toUpperCase()}
            </span>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>