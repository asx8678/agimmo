import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { superValidate, setError } from 'sveltekit-superforms/server';
import { zod4 } from 'sveltekit-superforms/adapters';

import { signUpSchema } from '$lib/schemas/auth';
import { signUpWithEmailPassword, UserExistsError } from '$lib/server/auth/service';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) throw redirect(303, '/dashboard');
	return {
		form: await superValidate(event, zod4(signUpSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(signUpSchema));
		if (!form.valid) return { form };

		try {
			const user = await signUpWithEmailPassword(event.locals.env, form.data.email, form.data.password);
			await event.locals.session.setData({ userId: user.id });
			await event.locals.session.save();
		} catch (err) {
			if (err instanceof UserExistsError) return setError(form, 'email', 'An account already exists for this email');
			return setError(form, '', 'Could not create your account. Please try again.');
		}

		throw redirect(303, '/dashboard');
	}
};

