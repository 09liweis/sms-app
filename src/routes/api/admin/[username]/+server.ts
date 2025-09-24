import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase';
import { getAndDecodeTokenFromHeader } from '$lib/utils/jwt';

interface CreateUserRequest {
  username: string;
  ports: number[];
  ipAddress: string;
  role: 'admin' | 'user' | 'sms_only';
}

export const PUT: RequestHandler = async ({ request, params }) => {
  try {
    // Verify admin access
    const user = getAndDecodeTokenFromHeader(request);
    if (!user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const username = params.username;

    const { ports, ipAddress, role }: CreateUserRequest = await request.json();

    // Validate required fields
    if (!username || !ports || !Array.isArray(ports) || ports.length === 0 || !ipAddress || !role) {
      return json({ error: 'All fields are required' }, { status: 400 });
    }

    // Validate port range (1-64)
    const invalidPorts = ports.filter(port => port < 1 || port > 64);
    if (invalidPorts.length > 0) {
      return json({ error: 'All ports must be between 1 and 64' }, { status: 400 });
    }

    // Validate role
    if (!['admin', 'user', 'sms_only'].includes(role)) {
      return json({ error: 'Invalid role' }, { status: 400 });
    }

    // Check if username already exists
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .update({
        ports, 
        ip_address:ipAddress,
        role
      })
      .eq('username', username)
      .single();

    return json({ 
      success: true, 
      user: existingUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};