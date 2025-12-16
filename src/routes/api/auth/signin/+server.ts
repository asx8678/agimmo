import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { signInSchema } from '$lib/schemas/auth';
import { signInWithEmailPassword, InvalidCredentialsError } from '$lib/server/auth/service';

export const POST: RequestHandler = async ({ request, locals }) => {
	const body = await request.json().catch(() => null);
	const parsed = signInSchema.safeParse(body);
	if (!parsed.success) return json({ error: 'Invalid input' }, { status: 400 });

	try {
		const user = await signInWithEmailPassword(locals.env, parsed.data.email, parsed.data.password);
		await locals.session.setData({ userId: user.id });
		await locals.session.save();
		return json({ ok: true, user: { id: user.id, email: user.email } }, { status: 200 });
	} catch (err) {
		if (err instanceof InvalidCredentialsError) return json({ error: 'Invalid email or password' }, { status: 401 });
		return json({ error: 'Could not sign in' }, { status: 500 });
	}
};

