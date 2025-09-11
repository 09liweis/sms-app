import { writable } from 'svelte/store';
import { sendRequest } from '$lib/utils/api';

export interface User {
	id: string;
	email: string;
	name: string;
}

export const user = writable<User | null>(null);
export const isAuthenticated = writable(false);

export async function login(email: string, password: string): Promise<boolean> {

	await sendRequest('/api/login', {method: 'POST', body: {email, password}});
	// Simulate API call - replace with actual API endpoint
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

	// Example of how to use the API wrapper for real authentication:
	/*
	return api.post('/auth/login', { email, password })
		.then(response => {
			if (response.success && response.data) {
				user.set(response.data.user);
				isAuthenticated.set(true);
				return true;
			}
			return false;
		})
		.catch(() => false);
	*/
}

export function logout() {
	user.set(null);
	isAuthenticated.set(false);
}