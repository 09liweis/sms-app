<script lang="ts">
  import type { SMSMessage } from "$lib/stores/sms";


	export let loading:boolean;
	export let conversations:SMSMessage[];
	export let onSelectConversation: (conversation: SMSMessage) => void;
	export let selectedConversation:SMSMessage|null;

	function formatTime(date: Date): string {
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const hours = diff / (1000 * 60 * 60);

		if (hours < 24) {
			return date.toLocaleTimeString('en-US', { 
				hour: 'numeric', 
				minute: '2-digit',
				hour12: true 
			});
		} else {
			return date.toLocaleDateString('en-US', { 
				month: 'short', 
				day: 'numeric' 
			});
		}
	}

	function truncateMessage(message: string, maxLength: number = 50): string {
		return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
	}
</script>

<div class="bg-white border-r border-gray-200 h-full flex flex-col">
	<div class="flex-1 overflow-y-auto">
		{#if loading}
			{#each Array(5) as _}
				<div class="w-full p-4 text-left border-b border-gray-100">
					<div class="flex items-start justify-between">
						<div class="flex-1 min-w-0">
							<div class="flex items-center justify-between mb-1">
								<div class="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
							</div>
							<div class="h-3 bg-gray-200 rounded w-3/4 animate-pulse mb-1"></div>
							<div class="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
						</div>
					</div>
				</div>
			{/each}
		{:else}
			{#each conversations as conversation }
				<button
					on:click={() => onSelectConversation(conversation)}
					class="w-full cursor-pointer p-4 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors {selectedConversation?.sender === conversation.sender ? 'bg-indigo-50 border-indigo-200' : ''}"
				>
					<div class="flex items-start justify-between">
						<div class="flex-1 min-w-0">
							<div class="flex items-center justify-between mb-1">
								<p class="text-sm font-medium text-gray-900">
									{conversation.sender}
							</p>
							<!-- {#if conversation.unreadCount > 0}
								<span class="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-indigo-600 rounded-full">
									{conversation.unreadCount}
								</span>
							{/if} -->
						</div>
						<p class="text-sm text-gray-600">
							{conversation.message}
						</p>
						<p class="text-xs text-gray-400 mt-1">
							{conversation.created_at}
						</p>
					</div>
				</div>
			</button>
			{/each}
		{/if}
		
		{#if !loading && conversations.length === 0}
			<div class="p-8 text-center">
				<svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
				</svg>
				<p class="text-gray-500">No conversations yet</p>
				<p class="text-sm text-gray-400 mt-1">Send your first message to get started</p>
			</div>
		{/if}
	</div>
</div>