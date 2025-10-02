import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.text();
    const lines = body.split('\n');
    const lastLine = lines[lines.length - 1];
    const parsedBody = {
      "sender": body.match(/Sender: (\d+)/)?.[1],
      "receiver": body.match(/Receiver: "([^"]+)"/)?.[1],
      "SMSC": body.match(/SMSC: (\d+)/)?.[1],
      "SCTS": body.match(/SCTS: (\d+)/)?.[1],
      "Slot": body.match(/Slot: "([^"]+)"/)?.[1],
      "Message": lastLine
    };
    console.log('Parsed SMS:', parsedBody);
    return json({ success: true, message: 'SMS received successfully', data: parsedBody });
  } catch (error) {
    console.error('Error receiving SMS:', error);
    return json({ success: false, message: 'Error receiving SMS' });
  }
};