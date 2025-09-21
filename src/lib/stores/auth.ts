import { writable } from 'svelte/store';
import { sendRequest } from '$lib/utils/api';
import type { PortStatus } from '$lib/types/sms';

export interface User {
	username: string;
}

export const user = writable<User | null>(null);
export const isAuthenticated = writable(false);
export const dashboardData = writable<PortStatus[]>([]);

export async function getDashboardData(opt:any) {
	const {success, data} = await sendRequest(`/api/dashboard?type=${opt.type}`, {method: 'GET'});
	if (success) {
		dashboardData.set(data);
	}
}

export async function login(username: string, password: string): Promise<boolean> {

	const {success, data:{jwt, user:curUser}} = await sendRequest('/api/login', {method: 'POST', body: {username, password}});
	if (success) {
		isAuthenticated.set(true);
		localStorage.setItem('token', jwt);
		user.set(curUser);
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
	localStorage.setItem('token', '');
}