<script lang="ts">
	import { login } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { api } from '$lib/utils/api';
	
	let username = '';
	let password = '';
	let isLoading = false;
	let error = '';
	let showPassword = false;

	onMount(async () => {
		const {success, data:{user}} = await api.get('/api/user');
		
		if (user) {
			goto('/dashboard');
		}
	});

	async function handleSubmit() {
		if (!username || !password) {
			error = 'Please fill in all fields';
			return;
		}

		isLoading = true;
		error = '';

		try {
			const success = await login(username, password);
			if (success) {
				goto('/dashboard');
			} else {
				error = 'Invalid username or password';
			}
		} catch (err) {
			error = 'An error occurred. Please try again.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
	<div class="max-w-md w-full">
		<div class="bg-white/60 rounded-2xl shadow-xl p-8">
			<div class="text-center mb-8">
				<div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
					<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
					</svg>
				</div>
				<h1 class="text-3xl font-bold text-gray-900 mb-2">8n8</h1>
				<p class="text-gray-600">SMS Management Platform</p>
			</div>

			<form on:submit|preventDefault={handleSubmit} class="space-y-6">
				<div>
					<label for="username" class="block text-sm font-medium text-gray-700 mb-2">
						Username
					</label>
					<input
						id="username"
						type="username"
						bind:value={username}
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
						placeholder="Enter your username"
						disabled={isLoading}
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-gray-700 mb-2">
						Password
					</label>
					<div class="relative">
						<input
							id="password"
							type={showPassword ? 'text' : 'password'}
							bind:value={password}
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
							placeholder="Enter your password"
							disabled={isLoading}
						/>
						<button
							type="button"
							on:click={() => showPassword = !showPassword}
							class="absolute cursor-pointer inset-y-0 right-0 flex items-center pr-3 text-gray-600 hover:text-indigo-600"
						>
							{#if showPassword}
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
							{:else}
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
								</svg>
							{/if}
						</button>
					</div>
				</div>

				{#if error}
					<div class="bg-red-50 border border-red-200 rounded-lg p-3">
						<p class="text-red-600 text-sm">{error}</p>
					</div>
				{/if}

				<button
					type="submit"
					disabled={isLoading}
					class="w-full bg-indigo-600 cursor-pointer text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{#if isLoading}
						<div class="flex items-center justify-center">
							<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Signing in...
						</div>
					{:else}
						Sign In
					{/if}
				</button>
			</form>
		</div>
	</div>
</div>