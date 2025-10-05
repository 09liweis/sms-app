import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sendRequest } from '$lib/utils/api';
import { generateToken } from '$lib/utils/jwt';
import { API_HOST } from '$env/static/private';
import { supabase } from '$lib/supabase';
import { ERROR_MESSAGE } from '$lib/constants/text';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { username, password } = await request.json();

    const {data: curUser} = await supabase.from('user_profiles').select('*').eq('username',username).single();

    const url = `${curUser.ip_address}/goip_get_sms_stat.html?username=${username}&password=${password}`;

    const response = await sendRequest(url);
    const { data: {code, reason}, success } = response;
    console.log(response);
    
    if (code === 1) {
      return json({ success: false, message: reason }, { status: 401 });
    }
    
    const jwt = generateToken({username, password, ip_address:curUser.ip_address});

    return json({ success: true, message: 'Login successful', jwt, user:curUser }, { status: 200 }); 
  } catch (error) {
    console.error(error);
    return json({success: false,  message: ERROR_MESSAGE}, { status: 500  });
  }
};
