import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_HOST } from '$env/static/private';
import { getRandomInt } from '$lib/utils/helper';
import { getAndDecodeTokenFromHeader } from '$lib/utils/jwt';
import { api } from '$lib/utils/api';
import { supabase } from '$lib/supabase';

function formatCanadianPhoneNumber(phoneNumber: string): string {
  const cleanedNumber = phoneNumber.replace(/\+/g, '');
  return cleanedNumber.length < 10 ? '1' + cleanedNumber : cleanedNumber;
}

export const GET: RequestHandler = async ({ request, url }) => {
  try {
    const user = await getAndDecodeTokenFromHeader(request);
    // const url = `${user.ip_address}/goip_get_sms.html?username=${user.username}&password=${user.password}`
    // const {success, data} = await api.get(url);

    const port = url.searchParams.get('port');
    const sender = url.searchParams.get('sender');

    if (port && sender) {
      const {data, error} = await supabase.from('messages').select('*').eq('ip', user.ip_address).eq('port', port).eq('sender', sender).order('created_at', { ascending: true });
      if (error) {
        console.error(error);
        return json({success:false, message: error.message},{status:500});
      }
      return json({conversations:data},{status:200});
    }

    const {data, error} = await supabase.from('messages').select('*').eq('ip', user.ip_address).eq('type', 'received').eq('is_new', true).order('created_at', { ascending: false });
    if (data) {
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

    const sender = formatCanadianPhoneNumber(to);
    
    const url = `${user.ip_address}/goip_post_sms.html?username=${user.username}&password=${user.password}`

    const body = {
      type: 'send-sms',
      task_num: 1,
      tasks: [
        {
          tid: getRandomInt(100),
          to: sender,
          from: ports.join(','),
          sms: message,
          to_all: ports.join(',')
        }
      ]
    }

    console.log(body, url);

    const {success, data} = await api.post(url, body);
    console.log(data);
    if (success) {

      const insertMessages = sender.split(',').map(s => {
        return {
          ip: user.ip_address,
          receiver: user.username,
          sender: s,
          message,
          port: ports.join(','),
          type: 'sent'
        }
      })

      const {error: insertMessageError} = await supabase.from('messages').insert(insertMessages)
      if (insertMessageError) {
        console.error(insertMessageError);
        return json({ success: false, message: insertMessageError.message }, { status: 500  }); 
      }
    }

    return json({ success, message: 'Send SMS successful' }, { status: data.code });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: 'Opppss something went wrong' }, { status: 500 });
  }
  
};
