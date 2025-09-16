import { writable } from 'svelte/store';
import { api } from '$lib/utils/api';

export interface SMSMessage {
	id: string;
	to: string;
	from?: string;
	message: string;
	status: 'sent' | 'delivered' | 'failed';
	timestamp: Date;
	cost: number;
	direction: 'inbound' | 'outbound';
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

export interface Conversation {
	phoneNumber: string;
	lastMessage: string;
	lastMessageTime: Date;
	unreadCount: number;
	messages: SMSMessage[];
}

// Mock data
const mockMessages: SMSMessage[] = [
	{
		id: '1',
		to: '+1234567890',
		from: '+1555000001',
		message: 'Welcome to 8n8! Your account has been activated.',
		status: 'delivered',
		timestamp: new Date('2024-01-15T10:30:00'),
		cost: 0.05,
		direction: 'outbound'
	},
	{
		id: '2',
		to: '+1987654321',
		from: '+1555000001',
		message: 'Your verification code is: 123456',
		status: 'delivered',
		timestamp: new Date('2024-01-15T11:45:00'),
		cost: 0.05,
		direction: 'outbound'
	},
	{
		id: '3',
		to: '+1555666777',
		from: '+1555000001',
		message: 'Reminder: Your appointment is tomorrow at 2 PM',
		status: 'sent',
		timestamp: new Date('2024-01-15T14:20:00'),
		cost: 0.05,
		direction: 'outbound'
	},
	{
		id: '4',
		to: '+1444555666',
		from: '+1555000001',
		message: 'Thank you for your purchase! Order #12345',
		status: 'failed',
		timestamp: new Date('2024-01-15T16:10:00'),
		cost: 0.00,
		direction: 'outbound'
	},
	// Add some inbound messages
	{
		id: '5',
		to: '+1555000001',
		from: '+1234567890',
		message: 'Thanks for the welcome message!',
		status: 'delivered',
		timestamp: new Date('2024-01-15T10:35:00'),
		cost: 0.00,
		direction: 'inbound'
	},
	{
		id: '6',
		to: '+1555000001',
		from: '+1987654321',
		message: 'Got the code, thanks!',
		status: 'delivered',
		timestamp: new Date('2024-01-15T11:50:00'),
		cost: 0.00,
		direction: 'inbound'
	},
	{
		id: '7',
		to: '+1555000001',
		from: '+1555666777',
		message: 'Can we reschedule to 3 PM?',
		status: 'delivered',
		timestamp: new Date('2024-01-15T14:25:00'),
		cost: 0.00,
		direction: 'inbound'
	}
];


export const messages = writable<SMSMessage[]>(mockMessages);
export const conversations = writable<Conversation[]>([]);
export const selectedConversation = writable<string | null>(null);

// Derive conversations from messages
messages.subscribe(msgs => {
	const conversationMap = new Map<string, Conversation>();
	
	msgs.forEach(msg => {
		const phoneNumber = msg.direction === 'inbound' ? msg.from! : msg.to;
		
		if (!conversationMap.has(phoneNumber)) {
			conversationMap.set(phoneNumber, {
				phoneNumber,
				lastMessage: msg.message,
				lastMessageTime: msg.timestamp,
				unreadCount: msg.direction === 'inbound' ? 1 : 0,
				messages: []
			});
		}
		
		const conversation = conversationMap.get(phoneNumber)!;
		conversation.messages.push(msg);
		
		// Update last message if this message is newer
		if (msg.timestamp > conversation.lastMessageTime) {
			conversation.lastMessage = msg.message;
			conversation.lastMessageTime = msg.timestamp;
		}
	});
	
	// Sort conversations by last message time
	const sortedConversations = Array.from(conversationMap.values())
		.sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
	
	conversations.set(sortedConversations);
});

export function sendSMS(to: string, message: string): Promise<boolean> {

	api.post('/api/sms', { to, message })
		.then(response => {
			if (response.success && response.data) {
				const newMessage: SMSMessage = {
					id: response.data.id,
					to,
					from: '+1555000001', // Your business number
					message,
					status: response.data.status,
					timestamp: new Date(response.data.timestamp),
					cost: response.data.cost,
					direction: 'outbound'
				};
				
				messages.update(msgs => [newMessage, ...msgs]);
				
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
				status: 'sent',
				timestamp: new Date(),
				cost: 0.05,
				direction: 'outbound'
			};
			
			messages.update(msgs => [newMessage, ...msgs]);
			
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
					from: '+1555000001', // Your business number
					message,
					status: response.data.status,
					timestamp: new Date(response.data.timestamp),
					cost: response.data.cost,
					direction: 'outbound'
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

export function markConversationAsRead(phoneNumber: string) {
	conversations.update(convs => 
		convs.map(conv => 
			conv.phoneNumber === phoneNumber 
				? { ...conv, unreadCount: 0 }
				: conv
		)
	);
}