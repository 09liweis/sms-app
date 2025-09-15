<script lang="ts">
	import { onMount } from 'svelte';
	import { messages } from '$lib/stores/sms';
	import StatsCard from '$lib/components/StatsCard.svelte';
    import { api } from '$lib/utils/api';
    import type { SMSStats } from '$lib/types/sms';
	
	let stats:any = {};

	async function getSMSStats() {
		const {success, data} = await api.get<SMSStats>('/api/sms');
		if (success && data) {
			stats = data;
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

	<!-- Stats Cards -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">

	</div>

</div>