import { writable } from 'svelte/store';
import { api } from '$lib/utils/api';

export interface SMSMessage {
	id?: string;
	message: string;
	created_at?: string;
	updated_at?: string;
	ip?: string;
	sender: string;
	port?: number;
	receiver?: string;
	SMSC?: string;
	SCTS?: string;
	type?: string;
}

export function sendSMS({to,message,port}:{to:string,message:string,port:number}): Promise<boolean> {

	api.post('/api/sms', { to, message,port })
		.then(response => {
			if (response.success && response.data) {
				return true;
			}
			return false;
		})
		.catch(() => false);

	// Simulate API call - replace with actual API endpoint
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, 1500);
	});

}