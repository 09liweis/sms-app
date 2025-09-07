<script lang="ts">
  import SMSForm from '$lib/components/SMSForm.svelte';
</script>

<svelte:head>
  <title>Send SMS - SMS Dashboard</title>
</svelte:head>

<div class="space-y-6">
  <SMSForm />
  
  <div class="card">
    <h3 class="text-lg font-semibold text-gray-900 mb-3">💡 Tips</h3>
    <ul class="space-y-2 text-sm text-gray-600">
      <li>• Keep messages under 160 characters for best delivery rates</li>
      <li>• Include country code in phone numbers (e.g., +1 for US)</li>
      <li>• Test with a small group before sending bulk messages</li>
      <li>• Avoid special characters that might cause encoding issues</li>
    </ul>
  </div>
</div>