import { writable } from 'svelte/store';

export interface User {
	id: string;
	email: string;
	name: string;
}

export const user = writable<User | null>(null);
export const isAuthenticated = writable(false);

export function login(email: string, password: string): Promise<boolean> {
	// Simulate API call
	return new Promise((resolve) => {
		setTimeout(() => {
			if (email === 'admin@8n8.com' && password === 'password') {
				const userData = {
					id: '1',
					email: 'admin@8n8.com',
					name: 'Admin User'
				};
				user.set(userData);
				isAuthenticated.set(true);
				resolve(true);
			} else {
				resolve(false);
			}
		}, 1000);
	});
}

export function logout() {
	user.set(null);
	isAuthenticated.set(false);
}