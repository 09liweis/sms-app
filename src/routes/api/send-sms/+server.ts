import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SEND_SMS_API } from '$env/static/private';
import { getRandomInt } from '$lib/utils/helper';

export const POST: RequestHandler = async ({ request }) => {
  const {to, message} = await request.json();
  console.log(to);
  const url = SEND_SMS_API

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'send-sms',
      task_num: 1,
      tasks: [
        {
          tid: getRandomInt(100),
          to,
          sms: message
        }
      ]
    })
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

  return json({ success: true, message: 'Login successful' }, { status: 200 });
};
