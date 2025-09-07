import { browser } from '$app/environment';
import { auth } from '$lib/stores/auth';

export const ssr = false;

export async function load() {
  if (browser) {
    auth.init();
  }
}