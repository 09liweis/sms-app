import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAndDecodeTokenFromHeader } from '$lib/utils/jwt';
import { supabase } from '$lib/supabase';

export const GET: RequestHandler = async ({ request }) => {
  try {
    const user = await getAndDecodeTokenFromHeader(request);
    if (user) {
      const {data, error} = await supabase.from('user_profiles').select('*').eq('username', user.username).single();
      if (error) {
        return json({ success: false, message: error.message }, { status: 500  }); 
      }

      return json({ user:data }, { status: 200 }); 
    } else {
      return json({ success: false, message: 'Unauthorized' }, { status: 401  });
    }

  } catch (error) {
    console.error(error);
    return json({success: false,  message: 'Opppss something went wrong'}, { status: 500  });
  }
};
