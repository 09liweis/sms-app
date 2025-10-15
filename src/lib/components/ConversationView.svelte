<script lang="ts">
	import type { SMSMessage } from '$lib/stores/sms';
	import { onMount } from 'svelte';
	import { api } from '$lib/utils/api';
    import { user } from '$lib/stores/auth';
    import { SMS_QUOTATION_LIMIT } from '$lib/constants/text';

	let { selectedConversation } = $props();
	
	let messages: SMSMessage[] = $state([]);
	let loading = $state(true);
	let replyMessage = $state('');
	let sending = $state(false);

	onMount(() => {
		loadMessages();

		const interval = setInterval(() => {
			if (selectedConversation) {
				loadMessages();
			}
		}, 5000);

		return () => clearInterval(interval);
	});

	$effect(() => {
		if (selectedConversation) {
			loading = true;
			loadMessages();
			replyMessage = '';
		}
	});

	async function loadMessages() {
		if (!selectedConversation) return;

		try {
			const { success, data } = await api.get(`/api/sms?port=${selectedConversation.port}&sender=${selectedConversation.sender}`);
			if (success && data.conversations) {
				messages = data.conversations;

				const messagesContainer = document.querySelector('#messages-container');
				if (messagesContainer) {
					messagesContainer.scrollTo({
						top: messagesContainer.scrollHeight,
						behavior: 'smooth'
					});
				}
			}
		} catch (error) {
			console.error('Failed to load messages:', error);
		} finally {
			loading = false;
		}
	}

	async function handleSendReply() {
		if (!replyMessage.trim() || !selectedConversation || sending) return;

		sending = true;
		try {
			const { success, curUser  } = await api.post('/api/sms', {
				to: selectedConversation.sender,
				message: replyMessage,
				port: selectedConversation.port
			});

			if (curUser) {
				user.set(curUser);
			}

			if (success) {
				replyMessage = '';
				await loadMessages();
			}
		} catch (error) {
			console.error('Failed to send reply:', error);
		} finally {
			sending = false;
		}
	}

	function handleKeypress(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSendReply();
		}
	}
</script>

<div class="flex flex-col h-full">
	<div class="border-b border-gray-200 p-4 bg-gray-50">
		<div class="flex items-center justify-between">
			<div>
				<h3 class="text-lg font-semibold text-gray-900">{selectedConversation?.sender}</h3>
				<p class="text-sm text-gray-500">{messages.length} messages</p>
			</div>
		</div>
	</div>

	<div id="messages-container" class="flex-1 overflow-y-auto p-4 space-y-4">
		{#if loading}
			<div class="flex items-center justify-center h-full">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
			</div>
		{:else if messages.length === 0}
			<div class="flex items-center justify-center h-full">
				<div class="text-center">
					<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
					</svg>
					<p class="mt-2 text-sm text-gray-500">No messages yet</p>
				</div>
			</div>
		{:else}
			{#each messages as msg}
				<div class="flex {msg.type === 'sent' ? 'justify-end' : 'justify-start'}">
					<div class="max-w-[70%]">
						<div class="rounded-lg p-3 {msg.type === 'sent'
							? 'bg-blue-600 text-white'
							: 'bg-gray-200 text-gray-900'}">
							<p class="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
						</div>
						<div class="flex items-center mt-1 {msg.type === 'sent' ? 'justify-end' : 'justify-start'} gap-2">
							<p class="text-xs text-gray-500">
								{#if msg.created_at}
									{msg.created_at}
								{/if}
							</p>
							{#if msg.port}
								<span class="text-xs text-gray-400">" Port {msg.port}</span>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>

	<div class="border-t border-gray-200 p-4 bg-white">
		<form onsubmit={(e) => { e.preventDefault(); handleSendReply(); }} class="flex gap-2">
			<textarea
				bind:value={replyMessage}
				onkeypress={handleKeypress}
				placeholder="Type a message..."
				rows="1"
				disabled={sending || !selectedConversation}
				class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
			></textarea>
			<button
				type="submit"
				disabled={sending || !replyMessage.trim() || !selectedConversation}
				class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
			>
				{#if sending}
					<div class="flex items-center gap-2">
						<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
						<span>Sending...</span>
					</div>
				{:else}
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
					</svg>
				{/if}
			</button>
		</form>
	</div>
</div>
