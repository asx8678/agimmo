import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { superValidate, setError } from 'sveltekit-superforms/server';
import { zod4 } from 'sveltekit-superforms/adapters';

import { signInSchema } from '$lib/schemas/auth';
import { signInWithEmailPassword, InvalidCredentialsError } from '$lib/server/auth/service';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) throw redirect(303, '/dashboard');
	return {
		form: await superValidate(event, zod4(signInSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(signInSchema));
		if (!form.valid) return { form };

		try {
			const user = await signInWithEmailPassword(event.locals.env, form.data.email, form.data.password);
			await event.locals.session.setData({ userId: user.id });
			await event.locals.session.save();
		} catch (err) {
			if (err instanceof InvalidCredentialsError) return setError(form, '', 'Invalid email or password');
			return setError(form, '', 'Could not sign you in. Please try again.');
		}

		throw redirect(303, '/dashboard');
	}
};

