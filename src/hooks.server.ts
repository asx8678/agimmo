import type { Handle, RequestEvent } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { sveltekitSessionHandle } from 'svelte-kit-sessions';
import KvStore from 'svelte-kit-connect-cloudflare-kv';

import { getUserById } from '$lib/server/auth/service';

declare module 'svelte-kit-sessions' {
	interface SessionData {
		userId?: string;
	}
}

let proxyPromise: Promise<{ env: App.Platform['env'] }> | undefined;

async function getEnv(event: RequestEvent): Promise<App.Platform['env']> {
	if (event.platform?.env) return event.platform.env as App.Platform['env'];
	const { getPlatformProxy } = await import('wrangler');
	proxyPromise ??= getPlatformProxy<App.Platform['env']>({ configPath: 'wrangler.jsonc' }).then((proxy) => ({
		env: proxy.env as App.Platform['env']
	}));
	return (await proxyPromise).env;
}

const handleSession: Handle = async ({ event, resolve }) => {
	const env = await getEnv(event);
	event.locals.env = env;

	const store = env.AGI_SESSIONS ? new KvStore({ client: env.AGI_SESSIONS, prefix: 'agi-' }) : undefined;

	const sessionHandle = sveltekitSessionHandle({
		secret: env.AGI_SESSION_SECRET || 'dev-insecure-session-secret',
		store,
		name: 'agi-session',
		cookie: {
			httpOnly: true,
			secure: event.url.protocol === 'https:',
			sameSite: 'lax',
			path: '/'
		}
	});

	return sessionHandle({ event, resolve });
};

const handleUser: Handle = async ({ event, resolve }) => {
	event.locals.user = null;

	const userId = event.locals.session?.data?.userId;
	if (userId) {
		const env = event.locals.env ?? (await getEnv(event));
		const user = await getUserById(env, userId);
		if (user) {
			event.locals.user = user;
		} else {
			await event.locals.session.destroy();
		}
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleSession, handleUser);
