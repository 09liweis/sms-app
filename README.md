 # 8n8 — SMS management UI (SvelteKit)

 This repository is a SvelteKit application for managing SMS messages via GoIP devices and persisting data to Supabase. It provides a small admin UI, conversation inbox, sending UI, and server endpoints that proxy requests to GoIP devices.

 Key features
 - User authentication via a JWT issued on login (stored in localStorage)
 - Send SMS through GoIP devices (server routes proxy requests)
 - Persist incoming and outgoing messages in Supabase
 - Admin endpoints for creating users and listing user profiles

 Repository layout (important files)
 - `package.json` — project scripts and dependencies
 - `vite.config.ts`, `svelte.config.js`, `tsconfig.json` — tooling/config
 - `src/lib/supabase.ts` — Supabase client initialization (reads `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`)
 - `src/lib/utils/api.ts` — `sendRequest` utility and `api` helpers used for HTTP requests
 - `src/lib/utils/jwt.ts` — JWT helpers used to generate and decode tokens (server-side)
 - `src/routes/api/*` — server endpoints used by the client (`/api/login`, `/api/sms`, `/api/admin`, `/api/user`, etc.)

 Prerequisites
 - Node.js (recommended: compatible with Vite/SvelteKit used in `devDependencies`)
 - A Supabase project and table schema (see notes below)
 - If you run the app against real GoIP devices, you need the devices reachable from the server and valid credentials for them

 Environment variables
 - PUBLIC_SUPABASE_URL — Supabase public URL (required by `src/lib/supabase.ts`)
 - PUBLIC_SUPABASE_ANON_KEY — Supabase anon key (required by `src/lib/supabase.ts`)
 - (Optional) API_HOST — referenced in some server code (see `src/routes/api/login/+server.ts`), used when constructing external requests

 NOTE: The project currently embeds a JWT secret in `src/lib/utils/jwt.ts` as `JWT_SECRET = 'your-secret-key'`. For production you should replace that with a secure secret pulled from environment variables (server-only) and never commit secrets to source control.

 Database / Supabase
 - The app expects at least two tables: `user_profiles` and `messages` (names referenced in code). A minimal shape used by the server:
	 - `user_profiles` — fields include `username`, `ports` (array), `ip_address`, `role`, `sms_quote`, `sms_usage`, `created_at`
	 - `messages` — fields include `ip`, `receiver`, `sender`, `message`, `port`, `type` ('sent' | 'received'), `is_new`, `created_at`

 Scripts
 - `npm run dev` — start dev server (Vite)
 - `npm run build` — build for production
 - `npm run preview` — preview production build
 - `npm run check` — run `svelte-check` for type checking
 - `npm run lint` — run ESLint

 How the server routes work (high level)
 - `POST /api/login` — server looks up the user in `user_profiles`, validates connectivity to the GoIP device, returns a JWT on success
 - `GET /api/sms` — returns conversations or messages for the authenticated user (requires Bearer token)
 - `POST /api/sms` — sends SMS via the GoIP device (proxies to the device), updates Supabase with sent messages and usage
 - `GET/POST /api/admin` — admin-only endpoints to list/create users (request must include a valid JWT)
 - `GET /api/user` — returns current user profile derived from JWT and Supabase

 Client utilities
 - `src/lib/utils/api.ts` contains `sendRequest` which includes a client-side token getter that reads `localStorage.getItem('token')` (the app stores JWT in localStorage)

 Security notes
 - The repo currently stores a placeholder `JWT_SECRET` inside the code. Move secrets to environment variables (server-only) and use `import { PRIVATE_JWT_SECRET } from '$env/static/private'` or similar in server code.
 - Keep Supabase service role keys out of the repository. `PUBLIC_*` keys are intended to be public.

 Development (quickstart)
 1. Install dependencies

 ```bash
 npm install
 ```

 2. Set required environment variables. In a local `.env` or devcontainer, provide at least:

 ```bash
 # example .env
 PUBLIC_SUPABASE_URL=https://your-project.supabase.co
 PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
 ```

 3. Start the dev server

 ```bash
 npm run dev
 ```

 4. Open the app in your browser (Vite will print the URL and port):

 ```bash
 "$BROWSER" http://localhost:5173
 ```

 Optional: Build & preview
 ```bash
 npm run build
 npm run preview
 ```

 Tests, linting & type checks
 - Linting: `npm run lint`
 - Type checking: `npm run check`

 Next steps / improvements
 - Move JWT secret into server-only env var and remove the hard-coded default in `src/lib/utils/jwt.ts`.
 - Add database migration SQL or a Supabase setup script to create `user_profiles` and `messages` tables with the expected schema.
 - Add unit/integration tests for API routes and utilities.
 - Add environment-based config for calling GoIP devices (timeouts, retry logic, host override) and improved error handling when devices are unreachable.

 Where to look in the codebase
 - Supabase client: `src/lib/supabase.ts`
 - HTTP helpers: `src/lib/utils/api.ts`
 - JWT helpers: `src/lib/utils/jwt.ts`
 - Routes: `src/routes/api/*`

 If you'd like I can also:
 - Add a `.env.example` or `README` section with recommended Supabase table schemas
 - Replace the hard-coded `JWT_SECRET` with a secure environment variable and update server code accordingly
 - Create a small SQL migration file for `user_profiles` and `messages`

 Completion summary
 - Updated this `README.md` with an accurate overview, setup steps, environment variables, and notes based on the project's code.



https://8n8.netlify.app/api/receive-sms?url=http://13.228.130.204:53258&