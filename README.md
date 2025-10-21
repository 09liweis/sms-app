# 8n8 — SMS management UI (SvelteKit)

Lightweight admin UI and server for sending and receiving SMS via GoIP devices, backed by Supabase.

This README summarizes how the app is organized, the environment it expects, developer commands, and security notes derived from the code.

Repository highlights

- Framework: SvelteKit + Vite
- Supabase client: `src/lib/supabase.ts` (reads `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`)
- HTTP client helper: `src/lib/utils/api.ts` (`sendRequest` + `api` convenience methods)
- JWT helpers (server-side): `src/lib/utils/jwt.ts` (currently uses a hard-coded secret)
- Routes: `src/routes/api/*` — server endpoints used by the UI (`/api/login`, `/api/sms`, `/api/admin`, `/api/user`, `/api/receive-sms`, etc.)
- Stores: `src/lib/stores/*` (`auth.ts`, `sms.ts`) — client-side state and helpers used by components

Important environment variables

- PUBLIC_SUPABASE_URL — Supabase public URL
- PUBLIC_SUPABASE_ANON_KEY — Supabase anon public key
- (Optional) API_HOST — referenced in server code; used for constructing external device requests in some places (see `src/routes/api/login/+server.ts`)

NOTE: `src/lib/utils/jwt.ts` contains `const JWT_SECRET = 'your-secret-key'`. This is insecure for production — move to a server-only env var (e.g., `PRIVATE_JWT_SECRET`) and import via `$env/static/private`.

Database (Supabase) expectations

The server code expects two tables (names found in `src/lib/constants/text.ts`):

- `user_profiles` — used to store per-user device info and quotas. Suggested columns:
	- `username` (primary key, text)
	- `ports` (integer[] or text[])
	- `ip_address` (text)
	- `role` (text) — one of `admin`, `user`, `sms_only`
	- `sms_quote` (integer)
	- `sms_usage` (integer)
	- `created_at` (timestamptz)

- `messages` — stores incoming and outgoing SMS messages. Suggested columns:
	- `id` (uuid or bigint)
	- `ip` (text)
	- `receiver` (text)
	- `sender` (text)
	- `message` (text)
	- `port` (integer)
	- `type` (text) — `sent` | `received`
	- `is_new` (boolean)
	- `created_at` (timestamptz)

Scripts (from `package.json`)

- `npm run dev` — start development server (Vite)
- `npm run build` — build for production
- `npm run preview` — preview production build
- `npm run check` — run `svelte-check` (type checking)
- `npm run lint` — run ESLint

How the main server endpoints behave

- `POST /api/login` (see `src/routes/api/login/+server.ts`)
	- Looks up `user_profiles` by username to get `ip_address`.
	- Calls the GoIP device `goip_get_sms_stat.html` to validate credentials.
	- On success returns a JWT (issued with `generateToken`) and sanitized user data.

- `GET /api/sms` (see `src/routes/api/sms/+server.ts`)
	- Requires `Authorization: Bearer <token>` header.
	- If `port` and `sender` query params are provided, returns messages filtered by those.
	- Otherwise returns new received messages for the user's device IP.

- `POST /api/sms` (see `src/routes/api/sms/+server.ts`)
	- Requires JWT auth.
	- Validates user SMS quota (`sms_usage` vs `sms_quote`).
	- Formats recipients, proxies a `goip_post_sms.html` request to the device via server-side HTTP helper, and inserts sent messages into `messages`.

- `POST /api/receive-sms` (see `src/routes/api/receive-sms/+server.ts`)
	- Endpoint intended for GoIP devices to POST raw SMS payloads.
	- Parses the raw body, inserts a `received` message row and marks previous messages as not new.

- `GET/POST /api/admin` (see `src/routes/api/admin/+server.ts`)
	- Admin-only (uses the token); allows listing all users and creating new `user_profiles` entries with port validation and role checks.

- `GET /api/user` (see `src/routes/api/user/+server.ts`)
	- Returns the current user's profile (derived from JWT) and calculates `sms_balance`.

Client utilities and stores

- `src/lib/utils/api.ts` — `sendRequest` wraps fetch with a timeout and automatically adds `Authorization: Bearer <token>` when running in the browser. It returns a uniform `ApiResponse` shape.
- `src/lib/stores/auth.ts` — exports `user`, `isAuthenticated`, and helpers: `login`, `logout`, `isUserLogin`, `getDashboardData`.
- `src/lib/stores/sms.ts` — `sendSMS` helper (wraps `api.post('/api/sms', ...)`).

UI

Components live under `src/lib/components/` and include a login form, conversation list, conversation view, ports selector, input field and a simple dashboard. The app's routes include `/` (login), `/dashboard`, `/dashboard/admin`, and `/dashboard/send`.

Security notes and recommended changes

- Move `JWT_SECRET` out of source: replace the hard-coded `JWT_SECRET` in `src/lib/utils/jwt.ts` with a server-only env var and import via `$env/static/private`.
- Avoid storing Supabase service role keys in the repo. `PUBLIC_*` keys are okay to use in the client but do not use them for server admin operations.
- Validate and sanitize any device-proxied responses before persisting.

Local development quickstart

1. Install dependencies

```bash
npm install
```

2. Create a `.env` in the project root with at least:

```bash
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
# (optional) PRIVATE_JWT_SECRET=replace-me-for-local-testing
```

3. Start dev server

```bash
npm run dev
```

4. Open the app (Vite will print the host/port)

```bash
"$BROWSER" http://localhost:5173
```



## 用户手册

### 添加admin用户
首先在skyline添加admin用户
然后用github account去登录supabase，到website项目里面的user_profiles添加admin username，ip_address等等

### 添加永华
打开项目网站地址，用admin用户去登录，登录后去admin，根据表单添加用户


### 接受短信
将以下格式的api接口放到skyline短信转发的端口，用来保存接受到的短信
[host]/api/receive-sms?url=[ip_address:port]&

例子： https://8n8.netlify.app/api/receive-sms?url=http://13.228.130.204:53258&