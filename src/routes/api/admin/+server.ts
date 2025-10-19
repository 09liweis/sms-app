import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase';
import { getAndDecodeTokenFromHeader } from '$lib/utils/jwt';

interface CreateUserRequest {
  sms_quote: number;
  username: string;
  ports: number[];
  ipAddress: string;
  role: 'admin' | 'user' | 'sms_only';
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    // Verify admin access
    const user = getAndDecodeTokenFromHeader(request);
    if (!user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username, ports, ipAddress, role, sms_quote }: CreateUserRequest = await request.json();

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
      .select('username')
      .eq('username', username)
      .single();

    if (existingUser) {
      return json({ error: 'Username already exists' }, { status: 400 });
    }

    // Create user in database
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([
        {
          username,
          ports,
          ip_address: ipAddress,
          role,
          sms_quote,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return json({ error: 'Failed to create user' }, { status: 500 });
    }

    return json({ 
      success: true, 
      user: {
        sms_quote: data.sms_quote,
        username: data.username,
        ports: data.ports,
        ipAddress: data.ip_address,
        role: data.role
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const GET: RequestHandler = async () => {
  try {
    const { data: users, error } = await supabase
      .from('user_profiles')
      .select('username, ports, ip_address, role, created_at, sms_quote')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    // Transform data for frontend
    const transformedUsers = users?.map(user => ({
      username: user.username,
      ports: user.ports,
      ipAddress: user.ip_address,
      role: user.role,
      sms_quote: user.sms_quote,
      createdAt: user.created_at
    })) || [];

    return json(transformedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};