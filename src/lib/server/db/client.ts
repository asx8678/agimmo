import { drizzle } from 'drizzle-orm/d1';

import * as schema from './schema';

export function getDb(env: App.Platform['env']) {
	return drizzle(env.AGI_DB, { schema });
}

