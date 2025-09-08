import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { email, password } = await request.json();

  // 模拟用户验证逻辑
  if (email === 'user@example.com' && password === 'password') {
    return json({ success: true, message: 'Login successful' }, { status: 200 });
  } else {
    return json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  }
};
