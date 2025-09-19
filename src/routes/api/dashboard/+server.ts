import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sendRequest } from '$lib/utils/api';
import { generateToken, getAndDecodeTokenFromHeader } from '$lib/utils/jwt';
import { API_HOST } from '$env/static/private';
import { supabase } from '$lib/supabase';

export const GET: RequestHandler = async ({ request }) => {
  try {

    const user = await getAndDecodeTokenFromHeader(request);
    if (!user) {
      return json({ success: false, message: 'Unauthorized' }, { status: 401  });
    }

    const dashboardData = {
      total_sent: 0,
      total_sentOk: 0,
      total_received: 0,
      total_sent_failed: 0,
      total_sending: 0,
      total_con_failed: 0
    };

    const urlParams = new URL(request.url).searchParams;
    const type = urlParams.get('type') || '3';
    const url = `${API_HOST}/goip_get_sms_stat.html?username=${user.username}&password=${user.password}&type=${type}`;

    const response = await sendRequest(url);
    const { data: {code, reason, stats}, success } = response;
    
    if (response?.data?.code === 1) {
      return json({ success: false, message: response?.data?.reason }, { status: 401 });
    }

    stats.forEach((item: { sent: number; sent_ok: number; received: number; sent_failed: number; sending: number; con_failed: number }) => {
      dashboardData.total_sent += item.sent;
      dashboardData.total_sentOk += item.sent_ok;
      dashboardData.total_received += item.received;
      dashboardData.total_sent_failed += item.sent_failed;
      dashboardData.total_sending += item.sending;
      dashboardData.total_con_failed += item.con_failed;
    });

    return json(dashboardData, { status: 200 }); 
  } catch (error) {
    console.error(error);
    return json({success: false,  message: 'Opppss something went wrong'}, { status: 500  });
  }
};
