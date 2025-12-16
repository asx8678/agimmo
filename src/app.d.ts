import type { D1Database, KVNamespace } from '@cloudflare/workers-types';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			env: App.Platform['env'];
			user: import('$lib/server/auth/service').PublicUser | null;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				AGI_DB: D1Database;
				AGI_SESSIONS: KVNamespace;

				AGI_APP_URL: string;
				AGI_PBKDF2_ITERS?: string;

				AGI_SESSION_SECRET: string;

				AGI_STRIPE_PUBLISHABLE_KEY: string;
				AGI_STRIPE_SECRET_KEY: string;
				AGI_STRIPE_WEBHOOK_SECRET: string;
				AGI_STRIPE_PRICE_PRO: string;
			};
		}
	}
}

export {};
