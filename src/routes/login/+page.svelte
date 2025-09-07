<script lang="ts">
  import { auth } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  let email = '';
  let password = '';
  let error = '';
  let isLoading = false;
  
  onMount(() => {
    // Check if already logged in
    const unsubscribe = auth.subscribe(user => {
      if (user) {
        goto('/dashboard');
      }
    });
    return unsubscribe;
  });
  
  async function handleLogin() {
    if (!email || !password) {
      error = 'Please fill in all fields';
      return;
    }
    
    isLoading = true;
    error = '';
    
    try {
      const success = auth.login(email, password);
      if (success) {
        goto('/dashboard');
      } else {
        error = 'Invalid email or password';
      }
    } catch (err) {
      error = 'Login failed. Please try again.';
    } finally {
      isLoading = false;
    }
  }
</script>

<svelte:head>
  <title>Login - SMS Dashboard</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
  <div class="max-w-md w-full mx-4">
    <div class="card">
      <div class="text-center mb-8">
        <div class="text-4xl mb-4">📱</div>
        <h1 class="text-2xl font-bold text-gray-900">SMS Dashboard</h1>
        <p class="text-gray-600 mt-2">Sign in to your account</p>
      </div>
      
      <form on:submit|preventDefault={handleLogin} class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            bind:value={email}
            placeholder="admin@example.com"
            class="input-field"
            required
          />
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            bind:value={password}
            placeholder="password"
            class="input-field"
            required
          />
        </div>
        
        {#if error}
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        {/if}
        
        <button 
          type="submit" 
          disabled={isLoading}
          class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      
      <div class="mt-6 pt-6 border-t border-gray-200">
        <p class="text-sm text-gray-600 text-center">
          Demo credentials:<br>
          <span class="font-medium">admin@example.com</span> / <span class="font-medium">password</span>
        </p>
      </div>
    </div>
  </div>
</div>