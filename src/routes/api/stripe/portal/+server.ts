import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { eq } from 'drizzle-orm';

import { getDb } from '$lib/server/db/client';
import { agiUsers } from '$lib/server/db/schema';
import { getStripe } from '$lib/server/stripe/client';

export const POST: RequestHandler = async ({ locals, url }) => {
	if (!locals.user) throw redirect(303, '/signin');

	const env = locals.env;
	const stripe = getStripe(env);
	const db = getDb(env);

	const user = await db
		.select({
			id: agiUsers.id,
			email: agiUsers.email,
			stripeCustomerId: agiUsers.stripeCustomerId
		})
		.from(agiUsers)
		.where(eq(agiUsers.id, locals.user.id))
		.get();

	if (!user) throw redirect(303, '/signin');

	let customerId = user.stripeCustomerId;
	if (!customerId) {
		const customer = await stripe.customers.create({
			email: user.email,
			metadata: { agi_user_id: user.id }
		});
		customerId = customer.id;
		await db.update(agiUsers).set({ stripeCustomerId: customerId }).where(eq(agiUsers.id, user.id)).run();
	}

	const returnUrl = new URL('/billing', env.AGI_APP_URL || url.origin).toString();
	const session = await stripe.billingPortal.sessions.create({
		customer: customerId,
		return_url: returnUrl
	});

	throw redirect(303, session.url);
};

