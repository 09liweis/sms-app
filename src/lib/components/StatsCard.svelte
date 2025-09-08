<script lang="ts">
	export let title: string;
	export let value: string | number;
	export let icon: string;
	export let color: 'blue' | 'green' | 'red' | 'yellow' = 'blue';

	const colorClasses = {
		blue: 'bg-blue-500',
		green: 'bg-green-500',
		red: 'bg-red-500',
		yellow: 'bg-yellow-500'
	};
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
	<div class="flex items-center justify-between">
		<div>
			<p class="text-sm font-medium text-gray-600 mb-1">{title}</p>
			<p class="text-3xl font-bold text-gray-900">{value}</p>
		</div>
		<div class="w-12 h-12 {colorClasses[color]} rounded-lg flex items-center justify-center">
			{@html icon}
		</div>
	</div>
</div>