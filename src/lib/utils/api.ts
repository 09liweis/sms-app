import type { User } from "$lib/stores/auth";

export interface ApiResponse<T = any> {
	data?: T;
	error?: string;
	success: boolean;
}

export interface RequestOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	headers?: Record<string, string>;
	body?: any;
	timeout?: number;
}

function getToken() {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('token');
	}
	return null;
}

export async function sendRequest<T = any>(
	url: string,
	options: RequestOptions = {}
): Promise<ApiResponse<T>> {
	const {
		method = 'GET',
		headers = {},
		body,
		timeout = 10000
	} = options;

	// Default headers
	const defaultHeaders: Record<string, string> = {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${getToken()}`,
		...headers
	};

	// Create AbortController for timeout
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeout);

	try {
		const fetchOptions: RequestInit = {
			method,
			headers: defaultHeaders,
			signal: controller.signal
		};

		// Add body for non-GET requests
		if (body && method !== 'GET') {
			fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
		}

		const response = await fetch(url, fetchOptions);
		clearTimeout(timeoutId);

		// Handle non-JSON responses
		const contentType = response.headers.get('content-type');
		let responseData: T;

		if (contentType && contentType.includes('application/json')) {
			responseData = await response.json();
		} else {
			responseData = (await response.text()) as T;
		}

		if (!response.ok) {
			return {
				success: false,
				error: `HTTP ${response.status}: ${response.statusText}`,
				data: responseData
			};
		}

		return {
			success: true,
			data: responseData
		};

	} catch (error) {
		clearTimeout(timeoutId);

		if (error instanceof Error) {
			if (error.name === 'AbortError') {
				return {
					success: false,
					error: 'Request timeout'
				};
			}

			return {
				success: false,
				error: error.message
			};
		}

		return {
			success: false,
			error: 'An unknown error occurred'
		};
	}
}

// Convenience methods
export const api = {
	get: <T = any>(url: string, options?: Omit<RequestOptions, 'method'>) =>
		sendRequest<T>(url, { ...options, method: 'GET' }),

	post: <T = any>(url: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
		sendRequest<T>(url, { ...options, method: 'POST', body }),

	put: <T = any>(url: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
		sendRequest<T>(url, { ...options, method: 'PUT', body }),

	delete: <T = any>(url: string, options?: Omit<RequestOptions, 'method'>) =>
		sendRequest<T>(url, { ...options, method: 'DELETE' }),

	patch: <T = any>(url: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
		sendRequest<T>(url, { ...options, method: 'PATCH', body })
};