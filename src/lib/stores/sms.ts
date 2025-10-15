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

export function sendSMS({to,message,port}:{to:string,message:string,port:number}) {

	return api.post('/api/sms', { to, message,port });
}