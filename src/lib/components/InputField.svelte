<script lang="ts">
    export let id: string;
    export let type: string = 'text';
    export let value: string;
    export let placeholder: string;
    export let disabled: boolean = false;
    export let label: string;
</script>

<div>
    <label for={id} class="block text-sm font-medium text-gray-700 mb-2">
        {label}
    </label>
    <input
        {id}
        {type}
        bind:value
        {placeholder}
        {disabled}
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
    />
</div>