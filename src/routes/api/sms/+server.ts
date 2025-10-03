import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_HOST } from '$env/static/private';
import { getRandomInt } from '$lib/utils/helper';
import { getAndDecodeTokenFromHeader } from '$lib/utils/jwt';
import { api } from '$lib/utils/api';
import { supabase } from '$lib/supabase';

export const GET: RequestHandler = async ({ request }) => {
  try {
    const user = await getAndDecodeTokenFromHeader(request);
    // const url = `${user.ip_address}/goip_get_sms.html?username=${user.username}&password=${user.password}`
    // const {success, data} = await api.get(url);
    const {data, error} = await supabase.from('messages').select('*').eq('ip', user.ip_address).order('created_at', { ascending: false });
    if (data) {
      console.log(data);
      return json({conversations:data},{status:200});
    } else {
      console.error(error);
      return json({success:false, message: 'Opppss something went wrong'},{status:500});
    }
  } catch (error) {
    console.error(error);
    return json({success:false},{status:500});
  }
  
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const user = await getAndDecodeTokenFromHeader(request);

    const {to, message,ports} = await request.json();
    
    const url = `${API_HOST}/goip_post_sms.html?username=${user.username}&password=${user.password}`

    const body = {
      type: 'send-sms',
      task_num: 1,
      tasks: [
        {
          tid: getRandomInt(100),
          to,
          from: ports.join(','),
          sms: message,
          to_all: ports.join(',')
        }
      ]
    }
    const {success, data} = await api.post(url, body);
    console.log(data);

    return json({ success, message: 'Send SMS successful' }, { status: data.code });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: 'Opppss something went wrong' }, { status: 500 });
  }
  
};
