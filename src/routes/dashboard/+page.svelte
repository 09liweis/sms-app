<script lang="ts">
	import { onMount } from 'svelte';
	import { messages } from '$lib/stores/sms';
	import StatsCard from '$lib/components/StatsCard.svelte';
    import { api } from '$lib/utils/api';
    import type { SMSStats } from '$lib/types/sms';
	
	let stats:any = [];

	async function getSMSStats() {
		const {success, data} = await api.get<SMSStats>('/api/sms');
		if (success && data) {
			stats = data.stats;
		}
	}

	onMount(() => {

		getSMSStats();
	});

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(amount);
	}

	function formatDate(date: Date): string {
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case 'delivered': return 'text-green-600 bg-green-100';
			case 'sent': return 'text-blue-600 bg-blue-100';
			case 'failed': return 'text-red-600 bg-red-100';
			default: return 'text-gray-600 bg-gray-100';
		}
	}
</script>

<svelte:head>
	<title>Dashboard - 8n8</title>
</svelte:head>

<div class="p-4 sm:p-6 lg:p-8">
	<div class="mb-6 lg:mb-8">
		<h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
		<p class="text-gray-600">Overview of your SMS campaigns and statistics</p>
	</div>

	<!-- Stats Table -->
	<div class="bg-white rounded-lg shadow-sm border border-gray-100 mb-6 lg:mb-8 overflow-x-auto">
		<table class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
				<tr>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Port</th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slot</th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received</th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spam</th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent</th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent OK</th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent Failed</th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Connection Failed</th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unsent</th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sending</th>
				</tr>
			</thead>
			<tbody class="bg-white divide-y divide-gray-200">
				{#if stats.length > 0}
					{#each stats as item}
						<tr>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.port}</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.slot}</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.received}</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.rcv_spam}</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.sent}</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">{item.sent_ok}</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-red-600">{item.sent_failed}</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-red-600">{item.con_failed}</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.unsent}</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{item.sending}</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>

</div>