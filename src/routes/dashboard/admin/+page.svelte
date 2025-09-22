<script lang="ts">
  import { WEBSITE_NAME } from '$lib/constants/text';
  import { api } from '$lib/utils/api';

  let userData = {
    username: '',
    selectedPorts: [] as number[],
    ipAddress: '',
    role: 'user' as 'admin' | 'user' | 'sms_only'
  };
  let editingUser: any = null;
  let isLoading = false;
  let success = '';
  let error = '';
  let users: any[] = [];

  // Generate array of ports 1-64
  const availablePorts = Array.from({ length: 64 }, (_, i) => i + 1);

  async function loadUsers() {
    const response = await api.get('/api/admin');
    if (response.success) {
      users = response.data || [];
    }
  }

  async function createUser() {
    if (!userData.username || userData.selectedPorts.length === 0 || !userData.ipAddress) {
      error = 'Please fill in all required fields';
      return;
    }

    // Validate IP address format
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(userData.ipAddress)) {
      error = 'Please enter a valid IP address';
      return;
    }

    isLoading = true;
    error = '';
    success = '';

    try {
      const response = editingUser
        ? await api.put(`/api/admin/${editingUser.id}`, {
            username: userData.username,
            ports: userData.selectedPorts,
            ipAddress: userData.ipAddress,
            role: userData.role
          })
        : await api.post('/api/admin', {
            username: userData.username,
            ports: userData.selectedPorts,
            ipAddress: userData.ipAddress,
            role: userData.role
          });

      if (response.success) {
        success = editingUser ? 'User updated successfully!' : 'User created successfully!';
        userData = {
          username: '',
          selectedPorts: [],
          ipAddress: '',
          role: 'user'
        };
        editingUser = null;
        await loadUsers();
        
        setTimeout(() => {
          success = '';
        }, 5000);
      } else {
        error = response.error || (editingUser ? 'Failed to update user' : 'Failed to create user');
      }
    } catch (err) {
      error = editingUser ? 'An error occurred while updating the user' : 'An error occurred while creating the user';
    } finally {
      isLoading = false;
    }
  }

  function editUser(user: any) {
    editingUser = user;
    userData = {
      username: user.username,
      selectedPorts: Array.isArray(user.ports) ? [...user.ports] : [user.port],
      ipAddress: user.ipAddress,
      role: user.role
    };
  }

  function cancelEdit() {
    editingUser = null;
    userData = {
      username: '',
      selectedPorts: [],
      ipAddress: '',
      role: 'user'
    };
  }

  function togglePort(port: number) {
    if (userData.selectedPorts.includes(port)) {
      userData.selectedPorts = userData.selectedPorts.filter(p => p !== port);
    } else {
      userData.selectedPorts = [...userData.selectedPorts, port];
    }
  }

  function selectAllPorts() {
    userData.selectedPorts = [...availablePorts];
  }

  function clearAllPorts() {
    userData.selectedPorts = [];
  }

  // Load users on component mount
  loadUsers();
</script>

<svelte:head>
  <title>Admin - {WEBSITE_NAME}</title>
</svelte:head>

<div class="p-4 sm:p-6 lg:p-8">
  <div class="mb-6 lg:mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
    <p class="text-gray-600">Manage users and system settings</p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

    <!-- Users List -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">Existing Users</h2>
      
      {#if users.length === 0}
        <div class="text-center py-8">
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
          </svg>
          <p class="text-gray-500">No users created yet</p>
          <p class="text-sm text-gray-400 mt-1">Create your first user to get started</p>
        </div>
      {:else}
        <div class="space-y-4">
          {#each users as user}
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="font-medium text-gray-900">{user.username}</h3>
                  <button
                    on:click={() => editUser(user)}
                    class="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Edit
                  </button>
                  <div class="mt-1 space-y-1">
                    <p class="text-sm text-gray-600">
                      <span class="font-medium">Role:</span> 
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'user' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }">
                        {user.role}
                      </span>
                    </p>
                    <p class="text-sm text-gray-600">
                      <span class="font-medium">IP:</span> {user.ipAddress}
                    </p>
                    <p class="text-sm text-gray-600">
                      <span class="font-medium">Ports:</span> 
                      {#if Array.isArray(user.ports)}
                        {user.ports.join(', ')}
                      {:else}
                        {user.port || 'N/A'}
                      {/if}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Create User Form -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">{editingUser ? 'Edit User' : 'Create New User'}</h2>

      {#if success}
        <div class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <p class="text-green-800 font-medium">{success}</p>
          </div>
        </div>
      {/if}

      {#if error}
        <div class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <p class="text-red-800">{error}</p>
          </div>
        </div>
      {/if}

      <form on:submit|preventDefault={createUser} class="space-y-6">
        <!-- Username -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
            Username *
          </label>
          <input
            id="username"
            type="text"
            bind:value={userData.username}
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="Enter username"
            disabled={isLoading}
            required
          />
        </div>

        <!-- Role -->
        <div>
          <label for="role" class="block text-sm font-medium text-gray-700 mb-2">
            Role *
          </label>
          <select
            id="role"
            bind:value={userData.role}
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            disabled={isLoading}
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="sms_only">SMS Only</option>
          </select>
          <p class="mt-1 text-sm text-gray-500">
            Admin: Full access, User: Standard access, SMS Only: Can only send SMS
          </p>
        </div>

        <!-- IP Address -->
        <div>
          <label for="ipAddress" class="block text-sm font-medium text-gray-700 mb-2">
            IP Address *
          </label>
          <input
            id="ipAddress"
            type="text"
            bind:value={userData.ipAddress}
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="192.168.1.100"
            disabled={isLoading}
            required
          />
        </div>

        <!-- Ports Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Ports * ({userData.selectedPorts.length} selected)
          </label>
          
          <div class="mb-3 flex gap-2">
            <button
              type="button"
              on:click={selectAllPorts}
              class="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
              disabled={isLoading}
            >
              Select All
            </button>
            <button
              type="button"
              on:click={clearAllPorts}
              class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              Clear All
            </button>
          </div>

          <div class="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3 bg-gray-50">
            <div class="grid grid-cols-8 gap-2">
              {#each availablePorts as port}
                <button
                  type="button"
                  on:click={() => togglePort(port)}
                  class="w-10 h-10 cursor-pointer text-sm rounded-md border transition-colors {userData.selectedPorts.includes(port) 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}"
                  disabled={isLoading}
                >
                  {port}
                </button>
              {/each}
            </div>
          </div>
          
          {#if userData.selectedPorts.length > 0}
            <div class="mt-2 p-2 bg-blue-50 rounded-md">
              <p class="text-sm text-blue-800">
                Selected ports: {userData.selectedPorts.sort((a, b) => a - b).join(', ')}
              </p>
            </div>
          {/if}
        </div>

        <div class="flex gap-4">
          <button
            type="submit"
            disabled={isLoading || !userData.username || userData.selectedPorts.length === 0 || !userData.ipAddress}
            class="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#if isLoading}
              <div class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {editingUser ? 'Updating User...' : 'Creating User...'}
              </div>
            {:else}
              {editingUser ? 'Update User' : 'Create User'}
            {/if}
          </button>
          {#if editingUser}
            <button
              type="button"
              on:click={cancelEdit}
              class="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
          {/if}
        </div>
      </form>
    </div>

  </div>
</div>