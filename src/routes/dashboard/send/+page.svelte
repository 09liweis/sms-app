<script lang="ts">
	import { sendSMS, selectedConversation } from '$lib/stores/sms';
	import ConversationList from '$lib/components/ConversationList.svelte';
	import ConversationView from '$lib/components/ConversationView.svelte';
    import { onMount } from 'svelte';
    import { api } from '$lib/utils/api';
  import { WEBSITE_NAME } from '$lib/constants/text';
    import { user } from '$lib/stores/auth';
    import PortsSelector from '$lib/components/PortsSelector.svelte';

	let phoneNumber = $state('');
	let message = $state('');
	let isLoading = $state(false);
	let success = $state(false);
	let error = $state('');
	let showNewMessage = $state(false);
	let selectedPorts:number[] = $state([]);

	const maxLength = 160;
	const remainingChars = $derived(maxLength - message.length);
	const isOverLimit = $derived(message.length > maxLength);

	let conversations = $state([]);
	let loadingConversation = $state(true);

	onMount(async()=>{
		try {
			const {success,data} = await api.get('/api/sms');
			if (success) {
				conversations = data.conversations;
			}
		} catch (error) {
			console.error(error);
		} finally {
			loadingConversation = false;
		}
	});

	async function handleSubmit() {
		if (!phoneNumber || !message || selectedPorts.length === 0) {
			error = 'Please fill in all fields and select at least one port';
			return;
		}

		if (isOverLimit) {
			error = 'Message exceeds character limit';
			return;
		}

		// Basic phone number validation
		// const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
		// if (!phoneRegex.test(phoneNumber)) {
		// 	error = 'Please enter a valid phone number';
		// 	return;
		// }

		isLoading = true;
		error = '';
		success = false;

		try {
			await sendSMS({to:phoneNumber, message,ports:selectedPorts});
			success = true;
			phoneNumber = '';
			message = '';
			
			setTimeout(() => {
				success = false;
			}, 5000);
		} catch (err) {
			error = 'Failed to send SMS. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	function formatPhoneNumber(value: string): string {
		// Remove all non-digit characters except +
		const cleaned = value.replace(/[^\d+]/g, '');
		
		// If it starts with +1, format as US number
		if (cleaned.startsWith('+1') && cleaned.length === 12) {
			return `+1 (${cleaned.slice(2, 5)}) ${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
		}
		
		return cleaned;
	}

	function handlePhoneInput(event: Event) {
		const target = event.target as HTMLInputElement;
		phoneNumber = formatPhoneNumber(target.value);
	}

	function handleSelectConversation(phoneNumber: string) {
		showNewMessage = false;
	}

	function startNewMessage() {
		selectedConversation.set(null);
		showNewMessage = true;
		phoneNumber = '';
		message = '';
	}
</script>

<svelte:head>
	<title>Send SMS - {WEBSITE_NAME}</title>
</svelte:head>

<div class="p-4 sm:p-6 lg:p-8">
	<div class="mb-6 lg:mb-8">
		<h1 class="text-3xl font-bold text-gray-900 mb-2">Send SMS</h1>
		<p class="text-gray-600">Send SMS messages to your customers</p>
	</div>

	<div class="flex h-[calc(100vh-200px)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
		<!-- Conversation List -->
		<div class="w-80 flex-shrink-0">
			<div class="bg-white border-r border-gray-200 h-full flex flex-col">
				<div class="p-4 border-b border-gray-200 flex items-center justify-between">
					<h2 class="text-lg font-semibold text-gray-900">Conversations</h2>
					<button
						on:click={startNewMessage}
						class="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center"
					>
						<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
						</svg>
						New SMS
					</button>
				</div>
				<ConversationList loading={loadingConversation} conversations={conversations} onSelectConversation={handleSelectConversation} />
			</div>
		</div>

		<!-- Main Content Area -->
		<div class="flex-1 flex flex-col">
			{#if showNewMessage || !$selectedConversation}
				<!-- New Message Form -->
				<div class="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
					<h3 class="text-lg font-semibold text-gray-900">New Message</h3>
				</div>

				<div class="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
			{#if success}
				<div class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
					<div class="flex items-center">
						<svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
						</svg>
						<p class="text-green-800 font-medium">SMS sent successfully!</p>
					</div>
				</div>
			{/if}

					<form on:submit|preventDefault={handleSubmit} class="space-y-6">
				<div>
					<label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
						Phone Number
					</label>
					<input
						id="phone"
						type="text"
						bind:value={phoneNumber}
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
						placeholder="+1 (555) 123-4567"
						disabled={isLoading}
					/>
					<p class="mt-1 text-sm text-gray-500">Include country code (e.g., +1 for US)</p>
				</div>

				<div>
					<label for="ports" class="block text-sm font-medium text-gray-700 mb-2">
						Ports
					</label>
					<button
						on:click={() => selectedPorts = $user.ports}
						class="bg-indigo-600 text-white px-3 py-1.5 mb-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
					>
						Select All
					</button>
					<PortsSelector ports={$user.ports} {selectedPorts} togglePort={(port:number)=>{
						if(selectedPorts.includes(port)) {
							selectedPorts = selectedPorts.filter((p) => p !== port);
						} else {
							selectedPorts = [...selectedPorts, port];
						}
					}} />
				</div>

				<div>
					<label for="message" class="block text-sm font-medium text-gray-700 mb-2">
						Message
					</label>
					<textarea
						id="message"
						bind:value={message}
						rows="4"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
						placeholder="Enter your message here..."
						disabled={isLoading}
					></textarea>
					<div class="mt-1 flex justify-between items-center">
						<p class="text-sm text-gray-500">SMS messages are charged at $0.05 per message</p>
						<p class="text-sm {isOverLimit ? 'text-red-600' : remainingChars < 20 ? 'text-yellow-600' : 'text-gray-500'}">
							<span class="hidden sm:inline">{remainingChars} characters remaining</span>
							<span class="sm:hidden">{remainingChars} left</span>
						</p>
					</div>
				</div>

				{#if error}
					<div class="bg-red-50 border border-red-200 rounded-lg p-4">
						<div class="flex items-center">
							<svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
							</svg>
							<p class="text-red-800">{error}</p>
						</div>
					</div>
				{/if}

				<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 space-y-4 sm:space-y-0">
					<div class="text-sm text-gray-600 order-2 sm:order-1">
						<p>Estimated cost: <span class="font-semibold">$0.05</span></p>
					</div>
					<button
						type="submit"
						disabled={isLoading || !phoneNumber || !message || isOverLimit}
						class="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
					>
						{#if isLoading}
							<div class="flex items-center">
								<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Sending...
							</div>
						{:else}
							Send SMS
						{/if}
					</button>
				</div>
			</form>

					<!-- Quick Tips -->
					<div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
						<h3 class="text-lg font-semibold text-blue-900 mb-3">Quick Tips</h3>
						<ul class="space-y-2 text-sm text-blue-800">
							<li class="flex items-start">
								<svg class="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
								Keep messages under 160 characters to avoid additional charges
							</li>
							<li class="flex items-start">
								<svg class="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
								Always include country code for international numbers
							</li>
							<li class="flex items-start">
								<svg class="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
								Avoid sending promotional messages during late hours
							</li>
						</ul>
					</div>
				</div>
			{:else}
				<!-- Conversation View -->
				<ConversationView />
			{/if}
		</div>
	</div>
</div>