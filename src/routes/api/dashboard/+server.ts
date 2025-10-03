import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sendRequest } from '$lib/utils/api';
import { getAndDecodeTokenFromHeader } from '$lib/utils/jwt';
import { API_HOST } from '$env/static/private';

export const GET: RequestHandler = async ({ request }) => {
  try {

    const user = await getAndDecodeTokenFromHeader(request);
    if (!user) {
      return json({ success: false, message: 'Unauthorized' }, { status: 401  });
    }

    const urlParams = new URL(request.url).searchParams;
    const type = urlParams.get('type') || '3';
    const url = `${API_HOST}/goip_get_sms_stat.html?username=${user.username}&password=${user.password}&type=${type}`;

    const response = await sendRequest(url);
    const { data: {code, reason, stats}, success } = response;
    
    if (response?.data?.code === 1) {
      console.error('Dashboard error: ',reason);
      return json({ success: false, message: response?.data?.reason }, { status: 401 });
    }

    return json(stats, { status: 200 }); 
  } catch (error) {
    console.error(error);
    return json({success: false,  message: 'Opppss something went wrong'}, { status: 500  });
  }
};
