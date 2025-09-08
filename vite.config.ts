import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server:{
		allowedHosts:['5173-09liweis-smsapp-k9jj5wvlehc.ws-us121.gitpod.io']
	}
});
