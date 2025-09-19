import { writable } from 'svelte/store';
import { sendRequest } from '$lib/utils/api';

export interface User {
	id: string;
	email: string;
	name: string;
}

export interface DashboardData {
	total_sent: number,
	total_sentOk: number,
	total_received: number,
	total_sent_failed: number,
	total_sending: number
}

export const user = writable<User | null>(null);
export const isAuthenticated = writable(false);
export const dashboardData = writable<DashboardData|null>(null);

export async function getDashboardData(opt:any) {
	const {success, data} = await sendRequest(`/api/dashboard?type=${opt.type}`, {method: 'GET'});
	if (success) {
		dashboardData.set(data);
	} else {
		dashboardData.set({total_sent: 0,
	total_sentOk: 0,
	total_received: 0,
	total_sent_failed: 0,
	total_sending: 0});
	}
}

export async function login(username: string, password: string): Promise<boolean> {

	const {success, data:{jwt}} = await sendRequest('/api/login', {method: 'POST', body: {username, password}});
	if (success) {
		isAuthenticated.set(true);
		localStorage.setItem('token', jwt);
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