<script lang="ts">
  import { page } from '$app/stores';
  
  interface MenuItem {
    href: string;
    label: string;
    icon: string;
  }
  
  const menuItems: MenuItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/dashboard/send-sms', label: 'Send SMS', icon: '📱' },
    { href: '/dashboard/history', label: 'SMS History', icon: '📋' },
    { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' }
  ];
</script>

<aside class="bg-white shadow-lg w-64 min-h-screen">
  <div class="p-6 border-b border-gray-200">
    <h2 class="text-xl font-bold text-gray-800">SMS Dashboard</h2>
  </div>
  
  <nav class="mt-6">
    {#each menuItems as item}
      <a 
        href={item.href}
        class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition duration-200 {$page.url.pathname === item.href ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500' : ''}"
      >
        <span class="mr-3 text-lg">{item.icon}</span>
        {item.label}
      </a>
    {/each}
  </nav>
  
  <div class="absolute bottom-0 w-64 p-6 border-t border-gray-200">
    <button 
      on:click={() => {
        import('$lib/stores/auth').then(({ auth }) => auth.logout());
        window.location.href = '/login';
      }}
      class="flex items-center w-full text-gray-600 hover:text-red-600 transition duration-200"
    >
      <span class="mr-3 text-lg">🚪</span>
      Logout
    </button>
  </div>
</aside>