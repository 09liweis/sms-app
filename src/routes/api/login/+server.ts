import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sendRequest } from '$lib/utils/api';
import { generateToken } from '$lib/utils/jwt';
import { API_HOST } from '$env/static/private';
import { supabase } from '$lib/supabase';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { username, password } = await request.json();

    const url = `${API_HOST}/goip_send_ussd.html?username=${username}&password=${password}`;

    const response = await sendRequest(url);
    const { data: {code, reason}, success } = response;
    console.log(response);
    
    if (code === 1) {
      return json({ success: false, message: reason }, { status: 401 });
    }

    const jwt = generateToken(username, password);

    const {data,error} = await supabase.from('user_profiles').upsert([
            { username, last_login: new Date() }
          ], { onConflict: 'username' });

    return json({ success: true, message: 'Login successful', jwt }, { status: 200 }); 
  } catch (error) {
    console.error(error);
    return json({success: false,  message: 'Opppss something went wrong'}, { status: 500  });
  }
};
