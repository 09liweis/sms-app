import { writable } from 'svelte/store';
import { browser } from '$app/environment';

interface User {
  id: string;
  email: string;
  name: string;
}

function createAuthStore() {
  const { subscribe, set, update } = writable<User | null>(null);

  return {
    subscribe,
    login: (email: string, password: string) => {
      // Simulate authentication
      if (email === 'admin@example.com' && password === 'password') {
        const user = { id: '1', email, name: 'Admin User' };
        set(user);
        if (browser) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        return true;
      }
      return false;
    },
    logout: () => {
      set(null);
      if (browser) {
        localStorage.removeItem('user');
      }
    },
    init: () => {
      if (browser) {
        const stored = localStorage.getItem('user');
        if (stored) {
          set(JSON.parse(stored));
        }
      }
    }
  };
}

export const auth = createAuthStore();