import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
    console.log('Received SMS:', body);
    return json({ success: true, message: 'SMS received successfully' });
};