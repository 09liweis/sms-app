import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_HOST } from '$env/static/private';
import { getRandomInt } from '$lib/utils/helper';
import { getAndDecodeTokenFromHeader } from '$lib/utils/jwt';
import { api } from '$lib/utils/api';

export const GET: RequestHandler = async ({ request }) => {
  try {
    const user = await getAndDecodeTokenFromHeader(request);
    const url = `${API_HOST}/goip_get_tasks.html?username=${user.username}&password=${user.password}&port=4`
    const {success, data} = await api.get(url);
    console.log(data);

    if (success) {
      return json({},{status:200});
    } else {
      return json({success, message: 'Opppss something went wrong'},{status:500});
    }
  } catch (error) {
    return json({success:false},{status:500});
  }
  
}
