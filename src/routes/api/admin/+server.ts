import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Mock database for users
const users: Array<{ username: string; port: number; ipAddress: string }> = [];

export const POST: RequestHandler = async ({ request }) => {
  const { username, port, ipAddress } = await request.json();

  // Validate port range (1-64)
  if (port < 1 || port > 64) {
    return json({ error: 'Port must be between 1 and 64' }, { status: 400 });
  }

  // Check if port is already assigned
  if (users.some(user => user.port === port)) {
    return json({ error: 'Port is already in use' }, { status: 400 });
  }

  // Add user to mock database
  users.push({ username, port, ipAddress });

  return json({ success: true, username, port, ipAddress });
};

export const GET: RequestHandler = async () => {
  return json(users);
};