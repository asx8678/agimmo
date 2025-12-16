# Codex Agadir

Production-ready SaaS starter app for Cloudflare Workers:

- SvelteKit (TypeScript) + `@sveltejs/adapter-cloudflare`
- Tailwind CSS v4 + Flowbite Svelte UI
- Auth: email/password + KV-backed sessions (`agi-session`)
- DB: Cloudflare D1 (SQLite) via Drizzle (`agi_users`)
- Billing: Stripe subscriptions (Payment Element), invoices, Customer Portal, webhooks

## Local development

### 1) Install

```bash
pnpm install
```

### 2) Configure env vars

Copy the example and fill values:

```bash
cp .dev.vars.example .dev.vars
```

Required (local + production):

- `AGI_SESSION_SECRET` (secret)
- `AGI_STRIPE_SECRET_KEY` (secret)
- `AGI_STRIPE_WEBHOOK_SECRET` (secret)
- `AGI_STRIPE_PUBLISHABLE_KEY` (non-secret)
- `AGI_STRIPE_PRICE_PRO` (non-secret; your Stripe Price ID)
- `AGI_APP_URL` (non-secret; e.g. `http://localhost:5173`)

Optional:

- `AGI_PBKDF2_ITERS` (defaults to `100000`, capped at `100000`)

### 3) Apply D1 migrations (local)

```bash
pnpm db:migrate:local
```

### 4) Run

Vite dev server (recommended):

```bash
pnpm dev
```

Cloudflare runtime (build + `wrangler dev`):

```bash
pnpm dev:cf
```

## Cloudflare setup (manual)

This project uses the required resource names:

- Worker: `agi-codex-agadir`
- D1 database: `agi-db` (binding `AGI_DB`)
- KV namespace: `agi-sessions` (binding `AGI_SESSIONS`)

### 1) Create D1 + KV

```bash
wrangler d1 create agi-db
wrangler kv namespace create agi-sessions
```

Update `wrangler.jsonc` with the printed `database_id` and KV `id`.

### 2) Apply migrations (remote)

```bash
pnpm db:migrate:remote
```

### 3) Set Cloudflare secrets

```bash
wrangler secret put AGI_SESSION_SECRET
wrangler secret put AGI_STRIPE_SECRET_KEY
wrangler secret put AGI_STRIPE_WEBHOOK_SECRET
```

### 4) Deploy

```bash
pnpm deploy
```

## Stripe setup (manual)

### 1) Product + Price (must use `agi-` names)

- Product name: `agi-pro`
- Price nickname: `agi-pro-monthly` (recurring monthly)
- Copy the Price ID into `AGI_STRIPE_PRICE_PRO`

### 2) Customer Portal

Enable the Customer Portal in the Stripe Dashboard.

### 3) Webhook endpoint

Create a Stripe webhook endpoint pointing to:

`https://<your-worker-domain>/api/stripe/webhook`

Subscribe to these events:

- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Copy the webhook signing secret into `AGI_STRIPE_WEBHOOK_SECRET`.

## Routes

Public:

- `/` (landing)
- `/pricing` (plans)
- `/signin` (login)
- `/signup` (signup)

Authenticated:

- `/dashboard`
- `/billing`

API:

- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `POST /api/auth/signout`
- `POST /api/stripe/create-subscription`
- `POST /api/stripe/portal`
- `POST /api/stripe/webhook`
