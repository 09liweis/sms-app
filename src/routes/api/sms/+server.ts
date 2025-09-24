import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_HOST } from '$env/static/private';
import { getRandomInt } from '$lib/utils/helper';
import { getAndDecodeTokenFromHeader } from '$lib/utils/jwt';
import { api } from '$lib/utils/api';

export const GET: RequestHandler = async ({ request }) => {
  try {
    const user = await getAndDecodeTokenFromHeader(request);
    const url = `${API_HOST}/goip_get_sms.html?username=${user.username}&password=${user.password}`
    const {success, data} = await api.get(url);

    if (success) {
      const conversations = data.data.map((item: any[]) => {
        return {
          sent: item[0],
          timestamp: new Date(item[2] * 1000),
          from: item[3],
          to: item[4],
          message: atob(item[5]),
        }
      })
      return json({conversations},{status:200});
    } else {
      console.error(data);
      return json({success, message: 'Opppss something went wrong'},{status:500});
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
