import { writable } from 'svelte/store';
import { api } from '$lib/utils/api';

export interface SMSMessage {
	id?: string;
	to: string;
	from?: string;
	message: string;
	timestamp: Date;
}


export const selectedConversation = writable<string | null>(null);

export function sendSMS(to: string, message: string): Promise<boolean> {

	api.post('/api/sms', { to, message })
		.then(response => {
			if (response.success && response.data) {
				const newMessage: SMSMessage = {
					id: response.data.id,
					to,
					from: '+1555000001', // Your business number
					message,
					timestamp: new Date(response.data.timestamp),
				};
								
				return true;
			}
			return false;
		})
		.catch(() => false);

	// Simulate API call - replace with actual API endpoint
	return new Promise((resolve) => {
		setTimeout(() => {
			const newMessage: SMSMessage = {
				id: Date.now().toString(),
				to,
				from: '+1555000001', // Your business number
				message,
				timestamp: new Date(),
			};
			
			
			resolve(true);
		}, 1500);
	});

}