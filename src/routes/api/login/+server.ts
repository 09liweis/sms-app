import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sendRequest } from '$lib/utils/api';
import { generateToken } from '$lib/utils/jwt';
import { API_HOST } from '$env/static/private';
import { supabase } from '$lib/supabase';
import { AUTH_SUCCESS_MESSAGE, ERROR_MESSAGE, SMS_QUOTATION_LIMIT, USER_PROFILES_TABLE } from '$lib/constants/text';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { username, password } = await request.json();

    const {data: curUser, error:curUserError} = await supabase.from(USER_PROFILES_TABLE).select('*').eq('username',username).single();

    const url = `${curUser.ip_address}/goip_get_sms_stat.html?username=${username}&password=${password}`;

    const response = await sendRequest(url);
    const { data: {code, reason}, success } = response;
    console.log(response);
    
    if (code === 1) {
      return json({ success: false, message: reason }, { status: 401 });
    }
    
    const jwt = generateToken({username, password, ip_address:curUser.ip_address});

    curUser.sms_balance = SMS_QUOTATION_LIMIT - curUser.sms_usage;

    return json({ success: true, message: AUTH_SUCCESS_MESSAGE, jwt, user:curUser }, { status: 200 }); 
  } catch (error) {
    console.error(error);
    return json({success: false,  message: ERROR_MESSAGE}, { status: 500  });
  }
};
