import { writable } from 'svelte/store';
import { api } from '$lib/utils/api';

export interface SMSMessage {
	id: string;
	to: string;
	message: string;
	status: 'sent' | 'delivered' | 'failed';
	timestamp: Date;
	cost: number;
}

export interface SMSStats {
	totalSent: number;
	totalDelivered: number;
	totalFailed: number;
	totalCost: number;
	monthlyStats: {
		month: string;
		sent: number;
		cost: number;
	}[];
}

// Mock data
const mockMessages: SMSMessage[] = [
	{
		id: '1',
		to: '+1234567890',
		message: 'Welcome to 8n8! Your account has been activated.',
		status: 'delivered',
		timestamp: new Date('2024-01-15T10:30:00'),
		cost: 0.05
	},
	{
		id: '2',
		to: '+1987654321',
		message: 'Your verification code is: 123456',
		status: 'delivered',
		timestamp: new Date('2024-01-15T11:45:00'),
		cost: 0.05
	},
	{
		id: '3',
		to: '+1555666777',
		message: 'Reminder: Your appointment is tomorrow at 2 PM',
		status: 'sent',
		timestamp: new Date('2024-01-15T14:20:00'),
		cost: 0.05
	},
	{
		id: '4',
		to: '+1444555666',
		message: 'Thank you for your purchase! Order #12345',
		status: 'failed',
		timestamp: new Date('2024-01-15T16:10:00'),
		cost: 0.00
	}
];

const mockStats: SMSStats = {
	totalSent: 1247,
	totalDelivered: 1198,
	totalFailed: 49,
	totalCost: 62.35,
	monthlyStats: [
		{ month: 'Jan', sent: 245, cost: 12.25 },
		{ month: 'Feb', sent: 312, cost: 15.60 },
		{ month: 'Mar', sent: 289, cost: 14.45 },
		{ month: 'Apr', sent: 401, cost: 20.05 }
	]
};

export const messages = writable<SMSMessage[]>(mockMessages);
export const stats = writable<SMSStats>(mockStats);

export function sendSMS(to: string, message: string): Promise<boolean> {

	api.post('/api/send-sms', { to, message })
		.then(response => {
			if (response.success && response.data) {
				const newMessage: SMSMessage = {
					id: response.data.id,
					to,
					message,
					status: response.data.status,
					timestamp: new Date(response.data.timestamp),
					cost: response.data.cost
				};
				
				messages.update(msgs => [newMessage, ...msgs]);
				stats.update(s => ({
					...s,
					totalSent: s.totalSent + 1,
					totalCost: s.totalCost + response.data.cost
				}));
				
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
				message,
				status: 'sent',
				timestamp: new Date(),
				cost: 0.05
			};
			
			messages.update(msgs => [newMessage, ...msgs]);
			stats.update(s => ({
				...s,
				totalSent: s.totalSent + 1,
				totalCost: s.totalCost + 0.05
			}));
			
			resolve(true);
		}, 1500);
	});

	// Example of how to use the API wrapper for real SMS sending:
	/*
	return api.post('/sms/send', { to, message })
		.then(response => {
			if (response.success && response.data) {
				const newMessage: SMSMessage = {
					id: response.data.id,
					to,
					message,
					status: response.data.status,
					timestamp: new Date(response.data.timestamp),
					cost: response.data.cost
				};
				
				messages.update(msgs => [newMessage, ...msgs]);
				stats.update(s => ({
					...s,
					totalSent: s.totalSent + 1,
					totalCost: s.totalCost + response.data.cost
				}));
				
				return true;
			}
			return false;
		})
		.catch(() => false);
	*/
}