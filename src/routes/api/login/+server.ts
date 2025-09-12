import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sendRequest } from '$lib/utils/api';

export const POST: RequestHandler = async ({ request }) => {
  const { username, password } = await request.json();

  const url = `http://13.228.130.204:53230/goip_get_sms_stat.html?username=${username}&password=${password}`;

  const response = await sendRequest(url);
  console.log(response.data.stats);
  const { data: {code, reason}, success } = response;
  
  if (code === 1) {
    return json({ success: false, message: reason }, { status: 401 });
  }
  return json({ success: true, message: 'Login successful' }, { status: 200 });
};
