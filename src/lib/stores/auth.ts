import { writable } from 'svelte/store';
import { sendRequest } from '$lib/utils/api';
import type { PortStatus } from '$lib/types/sms';

export interface User {
	username: string;
	ports:number[];
	ip_address:string;
	role:string;
	sms_quote: number;
	sms_balance: number;
}

const EMPTY_USER:User = {username:'',ports:[],ip_address:'',role:'',sms_quote:0,sms_balance:0};

export const user = writable<User>(EMPTY_USER);
export const isAuthenticated = writable(false);
export const dashboardData = writable<PortStatus[]>([]);

export async function getDashboardData(opt:any) {
	const {success, data} = await sendRequest(`/api/dashboard?type=${opt.type}`, {method: 'GET'});
	if (success) {
		dashboardData.set(data);
	}
}

export async function isUserLogin() {
	const {success, data} = await sendRequest(`/api/user`);
	if (success && data.user) {
		isAuthenticated.set(true);
		user.set(data.user);
	}
	return success;
}

export async function login(username: string, password: string): Promise<boolean> {

	const {success, data:{jwt, user:curUser}} = await sendRequest('/api/login', {method: 'POST', body: {username, password}});
	if (success) {
		isAuthenticated.set(true);
		localStorage.setItem('token', jwt);
		user.set(curUser);
	}
	return success;
}

export function logout() {
	user.set(EMPTY_USER);
	isAuthenticated.set(false);
	localStorage.setItem('token', '');
}