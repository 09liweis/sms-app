<script lang="ts">
  import { smsStore } from '$lib/stores/sms';
  
  let phoneNumber = '';
  let message = '';
  let isSubmitting = false;
  let successMessage = '';
  
  async function sendSMS() {
    if (!phoneNumber || !message) return;
    
    isSubmitting = true;
    successMessage = '';
    
    try {
      const messageId = smsStore.send(phoneNumber, message);
      successMessage = `SMS queued for sending (ID: ${messageId})`;
      phoneNumber = '';
      message = '';
    } catch (error) {
      console.error('Failed to send SMS:', error);
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="card max-w-2xl">
  <h2 class="text-xl font-semibold text-gray-900 mb-6">Send SMS Message</h2>
  
  <form on:submit|preventDefault={sendSMS} class="space-y-6">
    <div>
      <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
        Phone Number
      </label>
      <input
        type="tel"
        id="phone"
        bind:value={phoneNumber}
        placeholder="+1234567890"
        class="input-field"
        required
      />
    </div>
    
    <div>
      <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
        Message
      </label>
      <textarea
        id="message"
        bind:value={message}
        rows="4"
        placeholder="Enter your message here..."
        class="input-field resize-none"
        maxlength="160"
        required
      ></textarea>
      <p class="text-sm text-gray-500 mt-1">{message.length}/160 characters</p>
    </div>
    
    <button 
      type="submit" 
      disabled={isSubmitting || !phoneNumber || !message}
      class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? 'Sending...' : 'Send SMS'}
    </button>
    
    {#if successMessage}
      <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        {successMessage}
      </div>
    {/if}
  </form>
</div>