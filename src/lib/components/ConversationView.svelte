<script lang="ts">
	import { conversations, selectedConversation, sendSMS } from '$lib/stores/sms';
	import type { SMSMessage } from '$lib/stores/sms';

	let replyMessage = $state('');
	let isLoading = $state(false);
	let error = $state('');

	const maxLength = 160;
	const remainingChars = $derived(maxLength - replyMessage.length);
	const isOverLimit = $derived(replyMessage.length > maxLength);

	const selectedConversationData = $derived(
		$conversations.find(conv => conv.phoneNumber === $selectedConversation)
	);

	const sortedMessages = $derived(
		selectedConversationData?.messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()) || []
	);

	async function handleReply() {
		if (!replyMessage.trim() || !$selectedConversation) return;

		if (isOverLimit) {
			error = 'Message exceeds character limit';
			return;
		}

		isLoading = true;
		error = '';

		try {
			await sendSMS($selectedConversation, replyMessage);
			replyMessage = '';
		} catch (err) {
			error = 'Failed to send reply. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	function formatTime(date: Date): string {
		return date.toLocaleTimeString('en-US', { 
			hour: 'numeric', 
			minute: '2-digit',
			hour12: true 
		});
	}

	function formatDate(date: Date): string {
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		if (date.toDateString() === today.toDateString()) {
			return 'Today';
		} else if (date.toDateString() === yesterday.toDateString()) {
			return 'Yesterday';
		} else {
			return date.toLocaleDateString('en-US', { 
				month: 'short', 
				day: 'numeric',
				year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
			});
		}
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case 'delivered': return 'text-green-600';
			case 'sent': return 'text-blue-600';
			case 'failed': return 'text-red-600';
			default: return 'text-gray-600';
		}
	}

	function getStatusIcon(status: string): string {
		switch (status) {
			case 'delivered': return '✓✓';
			case 'sent': return '✓';
			case 'failed': return '✗';
			default: return '';
		}
	}

	// Group messages by date
	const messagesByDate = $derived(() => {
		const groups: { date: string; messages: SMSMessage[] }[] = [];
		let currentDate = '';
		let currentGroup: SMSMessage[] = [];

		sortedMessages.forEach(message => {
			const messageDate = message.timestamp.toDateString();
			
			if (messageDate !== currentDate) {
				if (currentGroup.length > 0) {
					groups.push({ date: formatDate(new Date(currentDate)), messages: currentGroup });
				}
				currentDate = messageDate;
				currentGroup = [message];
			} else {
				currentGroup.push(message);
			}
		});

		if (currentGroup.length > 0) {
			groups.push({ date: formatDate(new Date(currentDate)), messages: currentGroup });
		}

		return groups;
	});
</script>

{#if $selectedConversation && selectedConversationData}
	<div class="flex flex-col h-full bg-white">
		<!-- Header -->
		<div class="p-4 border-b border-gray-200 bg-gray-50">
			<div class="flex items-center justify-between">
				<div>
					<h3 class="text-lg font-semibold text-gray-900">{$selectedConversation}</h3>
					<p class="text-sm text-gray-600">{selectedConversationData.messages.length} messages</p>
				</div>
				<div class="flex items-center space-x-2">
					<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
						Active
					</span>
				</div>
			</div>
		</div>

		<!-- Messages -->
		<div class="flex-1 overflow-y-auto p-4 space-y-4">
			{#each messagesByDate() as group}
				<!-- Date separator -->
				<div class="flex items-center justify-center">
					<div class="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
						{group.date}
					</div>
				</div>

				<!-- Messages for this date -->
				{#each group.messages as message}
					<div class="flex {message.direction === 'outbound' ? 'justify-end' : 'justify-start'}">
						<div class="max-w-xs lg:max-w-md">
							<div class="px-4 py-2 rounded-lg {message.direction === 'outbound' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-900'}">
								<p class="text-sm">{message.message}</p>
							</div>
							<div class="flex items-center mt-1 {message.direction === 'outbound' ? 'justify-end' : 'justify-start'}">
								<span class="text-xs text-gray-500">
									{formatTime(message.timestamp)}
								</span>
								{#if message.direction === 'outbound'}
									<span class="ml-1 text-xs {getStatusColor(message.status)}">
										{getStatusIcon(message.status)}
									</span>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			{/each}
		</div>

		<!-- Reply form -->
		<div class="p-4 border-t border-gray-200 bg-gray-50">
			{#if error}
				<div class="mb-3 bg-red-50 border border-red-200 rounded-lg p-3">
					<p class="text-red-600 text-sm">{error}</p>
				</div>
			{/if}

			<form on:submit|preventDefault={handleReply} class="flex items-end space-x-3">
				<div class="flex-1">
					<textarea
						bind:value={replyMessage}
						placeholder="Type your reply..."
						rows="2"
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
						disabled={isLoading}
					></textarea>
					<div class="flex justify-between items-center mt-1">
						<span class="text-xs text-gray-500">$0.05 per message</span>
						<span class="text-xs {isOverLimit ? 'text-red-600' : remainingChars < 20 ? 'text-yellow-600' : 'text-gray-500'}">
							{remainingChars} left
						</span>
					</div>
				</div>
				<button
					type="submit"
					disabled={isLoading || !replyMessage.trim() || isOverLimit}
					class="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{#if isLoading}
						<svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
					{:else}
						Send
					{/if}
				</button>
			</form>
		</div>
	</div>
{:else}
	<div class="flex items-center justify-center h-full bg-gray-50">
		<div class="text-center">
			<svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
			</svg>
			<h3 class="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
			<p class="text-gray-600">Choose a conversation from the list to view messages and reply</p>
		</div>
	</div>
{/if}