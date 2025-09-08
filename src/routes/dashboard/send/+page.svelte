<script lang="ts">
	import { sendSMS } from '$lib/stores/sms';

	let phoneNumber = $state('');
	let message = $state('');
	let isLoading = $state(false);
	let success = $state(false);
	let error = $state('');

	const maxLength = 160;
	const remainingChars = $derived(maxLength - message.length);
	const isOverLimit = $derived(message.length > maxLength);

	async function handleSubmit() {
		if (!phoneNumber || !message) {
			error = 'Please fill in all fields';
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
			await sendSMS(phoneNumber, message);
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
</script>

<svelte:head>
	<title>Send SMS - 8n8</title>
</svelte:head>

<div class="p-4 sm:p-6 lg:p-8">
	<div class="mb-6 lg:mb-8">
		<h1 class="text-3xl font-bold text-gray-900 mb-2">Send SMS</h1>
		<p class="text-gray-600">Send SMS messages to your customers</p>
	</div>

	<div class="max-w-2xl mx-auto">
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
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

			<form onsubmit={handleSubmit} class="space-y-6">
				<div>
					<label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
						Phone Number
					</label>
					<input
						id="phone"
						type="text"
						bind:value={phoneNumber}
						oninput={()=>{
							//handlePhoneInput
						}}
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
						placeholder="+1 (555) 123-4567"
						disabled={isLoading}
					/>
					<p class="mt-1 text-sm text-gray-500">Include country code (e.g., +1 for US)</p>
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
		</div>

		<!-- Quick Tips -->
		<div class="mt-6 lg:mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
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
</div>