import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase';

export const POST: RequestHandler = async ({ request, url }) => {
  try {
    const ip = url.searchParams.get('url');
    const body = await request.text();
    const lines = body.split('\n');
    const lastLine = lines[lines.length - 1];
    const parsedBody = {
      "sender": body.match(/Sender: (\d+)/)?.[1],
      "receiver": body.match(/Receiver: "([^"]+)"/)?.[1],
      "SMSC": body.match(/SMSC: (\d+)/)?.[1],
      "SCTS": body.match(/SCTS: (\d+)/)?.[1],
      "port": body.match(/Slot: "([^"]+)"/)?.[1],
      "message": lastLine,
      ip,
      type: 'received',
      is_new: true
    };
    console.log('Parsed SMS:', parsedBody);

    const {error:updateError} = await supabase.from('messages').update({is_new:false}).eq('ip',ip).eq('is_new',true).eq('sender',parsedBody.sender).eq('port',parsedBody.port);
    if (updateError) {
      console.error('Update receive sms error: ', updateError);
      return json({ success: false, message: updateError.message }, { status: 500  }); 
    }
    const {error} = await supabase.from('messages').insert(parsedBody);
    if (error) {
      console.error('Insert receive sms error: ', error);
      return json({ success: false, message: error.message }, { status: 500  }); 
    }
    return json({ success: true, message: 'SMS received successfully', data: parsedBody });
  } catch (error) {
    console.error('Error receiving SMS:', error);
    return json({ success: false, message: 'Error receiving SMS' });
  }
};