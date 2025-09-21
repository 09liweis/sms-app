<script lang="ts">
  import { WEBSITE_NAME } from "$lib/constants/text";
	import { getDashboardData, dashboardData } from "$lib/stores/auth";
    import { api } from "$lib/utils/api";
	import { onMount } from "svelte";

	let selectedType = 3;
	const statTypes = [
		{ value: 0, label: "最近一小时" },
		{ value: 1, label: "最近两小时" },
		{ value: 2, label: "当日" },
		{ value: 3, label: "累计" },
	];

	function handleTypeChange() {
		fetchDashboardData();
	}

	onMount(() => {
		fetchDashboardData();
		fetchTasks();
		
		const interval = setInterval(() => {
			getDashboardData({type: selectedType});
		}, 20000);

		return () => {
			clearInterval(interval);
		};
	});

	let loading = true;
	async function fetchDashboardData() {
		loading = true;
		await getDashboardData({ type: selectedType });
		loading = false;
	}

	async function fetchTasks() {
		const { success, data } = await api.get('/api/tasks');
	}
</script>

<svelte:head>
	<title>Dashboard - {WEBSITE_NAME}</title>
</svelte:head>

<div class="p-4 sm:p-6 lg:p-8">
	<div class="mb-6 lg:mb-8">
		<h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
		<p class="text-gray-600">Overview of your SMS campaigns and statistics</p>
		<div class="mt-4">
			<select
				bind:value={selectedType}
				on:change={handleTypeChange}
				class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
			>
				{#each statTypes as type}
					<option value={type.value}>{type.label}</option>
				{/each}
			</select>
		</div>
	</div>

	{#if !loading && $dashboardData}
		<div class="overflow-x-auto">
			<table class="min-w-full bg-white rounded-lg shadow-md">
				<thead>
					<tr class="bg-gray-100">
						<th class="py-3 px-4 text-center">Port</th>
						<th class="py-3 px-4 text-center">Slot</th>
						<th class="py-3 px-4 text-center">Received</th>
						<th class="py-3 px-4 text-center">Spam</th>
						<th class="py-3 px-4 text-center">Sent</th>
						<th class="py-3 px-4 text-center">Sent OK</th>
						<th class="py-3 px-4 text-center">Sent Failed</th>
						<th class="py-3 px-4 text-center">Connection Failed</th>
						<th class="py-3 px-4 text-center">Unsent</th>
						<th class="py-3 px-4 text-center">Sending</th>
					</tr>
				</thead>
				<tbody>
					{#each $dashboardData as port}
						<tr class="border-b border-gray-200 hover:bg-gray-50">
							<td class="py-3 px-4 text-center">{port.port}</td>
							<td class="py-3 px-4 text-center">{port.slot}</td>
							<td class="py-3 px-4 text-center">{port.received}</td>
							<td class="py-3 px-4 text-center">{port.rcv_spam}</td>
							<td class="py-3 px-4 text-center">{port.sent}</td>
							<td class="py-3 px-4 text-center">{port.sent_ok}</td>
							<td class="py-3 px-4 text-center">{port.sent_failed}</td>
							<td class="py-3 px-4 text-center">{port.con_failed}</td>
							<td class="py-3 px-4 text-center">{port.unsent}</td>
							<td class="py-3 px-4 text-center">{port.sending}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each Array(6).fill(0) as _, i}
				<div class="bg-white rounded-lg shadow-md p-6 animate-pulse">
					<div class="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
					<div class="h-4 bg-gray-200 rounded w-full"></div>
				</div>
			{/each}
		</div>
	{/if}
</div>
