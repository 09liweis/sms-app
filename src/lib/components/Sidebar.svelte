<script lang="ts">
	import { page } from '$app/stores';
	import { logout } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	let isMobileMenuOpen = $state(false);

	function handleLogout() {
		logout();
		goto('/');
	}

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function closeMobileMenu() {
		isMobileMenuOpen = false;
	}
	const currentPath = $derived($page.url.pathname);
</script>

<!-- Mobile menu button -->
<div class="lg:hidden bg-white border-b border-gray-200 p-4">
	<button
		on:click={toggleMobileMenu}
		class="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
	>
		<svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
		</svg>
	</button>
</div>

<!-- Mobile menu overlay -->
{#if isMobileMenuOpen}
	<div class="lg:hidden fixed inset-0 z-50 flex">
		<div class="fixed inset-0 bg-black bg-opacity-50" on:click={closeMobileMenu}></div>
		<div class="relative bg-gray-900 text-white w-64 min-h-screen flex flex-col">
			<div class="p-6">
				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
							<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
							</svg>
						</div>
						<h1 class="text-xl font-bold">8n8</h1>
					</div>
					<button
						on:click={closeMobileMenu}
						class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 transition-colors"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</button>
				</div>
			</div>

			<nav class="flex-1 px-4">
				<ul class="space-y-2">
					<li>
						<a
							href="/dashboard"
							on:click={closeMobileMenu}
							class="flex items-center px-4 py-3 rounded-lg transition-colors {currentPath === '/dashboard' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}"
						>
							<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
							</svg>
							Dashboard
						</a>
					</li>
					<li>
						<a
							href="/dashboard/send"
							on:click={closeMobileMenu}
							class="flex items-center px-4 py-3 rounded-lg transition-colors {currentPath === '/dashboard/send' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}"
						>
							<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
							</svg>
							Send SMS
						</a>
					</li>
				</ul>
			</nav>

			<div class="p-4 border-t border-gray-800">
				<button
					on:click={() => { handleLogout(); closeMobileMenu(); }}
					class="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
				>
					<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
					</svg>
					Sign Out
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Desktop sidebar -->
<div class="hidden lg:flex bg-gray-900 text-white w-64 min-h-screen flex-col">
	<div class="p-6">
		<div class="flex items-center">
			<div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
				<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
				</svg>
			</div>
			<h1 class="text-xl font-bold">8n8</h1>
		</div>
	</div>

	<nav class="flex-1 px-4">
		<ul class="space-y-2">
			<li>
				<a
					href="/dashboard"
					class="flex items-center px-4 py-3 rounded-lg transition-colors {currentPath === '/dashboard' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}"
				>
					<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
					</svg>
					Dashboard
				</a>
			</li>
			<li>
				<a
					href="/dashboard/send"
					class="flex items-center px-4 py-3 rounded-lg transition-colors {currentPath === '/dashboard/send' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}"
				>
					<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
					</svg>
					Send SMS
				</a>
			</li>
		</ul>
	</nav>

	<div class="p-4 border-t border-gray-800">
		<button
			on:click={handleLogout}
			class="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
		>
			<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
			</svg>
			Sign Out
		</button>
	</div>
</div>