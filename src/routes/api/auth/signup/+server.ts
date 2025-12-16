import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { signUpSchema } from '$lib/schemas/auth';
import { signUpWithEmailPassword, UserExistsError } from '$lib/server/auth/service';

export const POST: RequestHandler = async ({ request, locals }) => {
	const body = await request.json().catch(() => null);
	const parsed = signUpSchema.safeParse(body);
	if (!parsed.success) return json({ error: 'Invalid input' }, { status: 400 });

	try {
		const user = await signUpWithEmailPassword(locals.env, parsed.data.email, parsed.data.password);
		await locals.session.setData({ userId: user.id });
		await locals.session.save();
		return json({ ok: true, user: { id: user.id, email: user.email } }, { status: 200 });
	} catch (err) {
		if (err instanceof UserExistsError) return json({ error: 'Email already in use' }, { status: 409 });
		return json({ error: 'Could not create account' }, { status: 500 });
	}
};

