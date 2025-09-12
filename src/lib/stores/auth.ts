import { writable } from 'svelte/store';
import { sendRequest } from '$lib/utils/api';

export interface User {
	id: string;
	email: string;
	name: string;
}

export const user = writable<User | null>(null);
export const isAuthenticated = writable(false);

export async function login(username: string, password: string): Promise<boolean> {

	const {success, data} = await sendRequest('/api/login', {method: 'POST', body: {username, password}});
	if (success) {
		isAuthenticated.set(true);
	}
	return success;

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