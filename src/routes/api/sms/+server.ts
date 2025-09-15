import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_HOST, SEND_SMS_API } from '$env/static/private';
import { getRandomInt } from '$lib/utils/helper';
import { getAndDecodeTokenFromHeader } from '$lib/utils/jwt';
import { api } from '$lib/utils/api';

export const GET: RequestHandler = async ({ request }) => {
  try {
    const user = await getAndDecodeTokenFromHeader(request);
    const url = `${API_HOST}/goip_get_sms_stat.html?username=${user.username}&password=${user.password}`
    const {success, data} = await api.get(url);    
    return json({success, data},{status:200});
  } catch (error) {
    return json({success:false},{status:500});
  }
  
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const user = await getAndDecodeTokenFromHeader(request);

    const {to, message} = await request.json();
    
    const url = `${API_HOST}/goip_post_sms.html?username=${user.username}&password=${user.password}`

    const body = {
      type: 'send-sms',
      task_num: 1,
      tasks: [
        {
          tid: getRandomInt(100),
          to,
          sms: message
        }
      ]
    }
    const {success, data} = await api.post(url, body);

    return json({ success, message: 'Send SMS successful' }, { status: data.code });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: 'Opppss something went wrong' }, { status: 500 });
  }
  
};
