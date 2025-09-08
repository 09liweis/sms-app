<script lang="ts">
	import { onMount } from 'svelte';
	import { stats, messages } from '$lib/stores/sms';
	import StatsCard from '$lib/components/StatsCard.svelte';

	let currentStats = $state({ totalSent: 0, totalDelivered: 0, totalFailed: 0, totalCost: 0, monthlyStats: [] });
	let recentMessages = $state([]);

	onMount(() => {
		const unsubscribeStats = stats.subscribe(value => {
			currentStats = value;
		});

		const unsubscribeMessages = messages.subscribe(value => {
			recentMessages = value.slice(0, 5);
		});

		return () => {
			unsubscribeStats();
			unsubscribeMessages();
		};
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
		<StatsCard
			title="Total Sent"
			value={currentStats.totalSent.toLocaleString()}
			color="blue"
			icon='<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>'
		/>
		<StatsCard
			title="Delivered"
			value={currentStats.totalDelivered.toLocaleString()}
			color="green"
			icon='<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
		/>
		<StatsCard
			title="Failed"
			value={currentStats.totalFailed.toLocaleString()}
			color="red"
			icon='<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>'
		/>
		<StatsCard
			title="Total Cost"
			value={formatCurrency(currentStats.totalCost)}
			color="yellow"
			icon='<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path></svg>'
		/>
	</div>

	<div class="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
		<!-- Monthly Stats Chart -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<h2 class="text-lg lg:text-xl font-semibold text-gray-900 mb-4 lg:mb-6">Monthly Statistics</h2>
			<div class="space-y-4">
				{#each currentStats.monthlyStats as stat}
					<div class="flex items-center">
						<div class="flex items-center">
							<div class="w-8 sm:w-12 text-xs sm:text-sm font-medium text-gray-600">{stat.month}</div>
							<div class="flex-1 mx-2 sm:mx-4">
								<div class="bg-gray-200 rounded-full h-2">
									<div 
										class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
										style="width: {(stat.sent / Math.max(...currentStats.monthlyStats.map(s => s.sent))) * 100}%"
									></div>
								</div>
							</div>
						</div>
						<div class="text-right ml-2">
							<div class="text-xs sm:text-sm font-semibold text-gray-900">{stat.sent}</div>
							<div class="text-xs text-gray-500">{formatCurrency(stat.cost)}</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Recent Messages -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<h2 class="text-lg lg:text-xl font-semibold text-gray-900 mb-4 lg:mb-6">Recent Messages</h2>
			<div class="space-y-4">
				{#each recentMessages as message}
					<div class="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 p-3 bg-gray-50 rounded-lg">
						<div class="flex-1 min-w-0">
							<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 space-y-1 sm:space-y-0">
								<p class="text-sm font-medium text-gray-900 truncate">{message.to}</p>
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor(message.status)}">
									{message.status}
								</span>
							</div>
							<p class="text-sm text-gray-600 mb-2">{message.message}</p>
							<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 space-y-1 sm:space-y-0">
								<span>{formatDate(message.timestamp)}</span>
								<span>{formatCurrency(message.cost)}</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>