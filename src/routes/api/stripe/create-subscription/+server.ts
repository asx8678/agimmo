import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

import { getDb } from '$lib/server/db/client';
import { agiUsers } from '$lib/server/db/schema';
import { getStripe } from '$lib/server/stripe/client';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

	const env = locals.env;
	const stripe = getStripe(env);

	const body = await request.json().catch(() => ({}));
	const requestedPriceId = typeof body?.priceId === 'string' ? body.priceId : env.AGI_STRIPE_PRICE_PRO;
	if (!requestedPriceId || requestedPriceId !== env.AGI_STRIPE_PRICE_PRO) {
		return json({ error: 'Invalid price' }, { status: 400 });
	}

	const db = getDb(env);
	const user = await db
		.select({
			id: agiUsers.id,
			email: agiUsers.email,
			stripeCustomerId: agiUsers.stripeCustomerId,
			stripeSubscriptionId: agiUsers.stripeSubscriptionId,
			stripeSubscriptionStatus: agiUsers.stripeSubscriptionStatus
		})
		.from(agiUsers)
		.where(eq(agiUsers.id, locals.user.id))
		.get();

	if (!user) return json({ error: 'User not found' }, { status: 404 });

	if (user.stripeSubscriptionStatus === 'active' || user.stripeSubscriptionStatus === 'trialing') {
		return json({ error: 'You already have an active subscription' }, { status: 409 });
	}

	let customerId = user.stripeCustomerId;
	if (!customerId) {
		const customer = await stripe.customers.create({
			email: user.email,
			metadata: { agi_user_id: user.id }
		});
		customerId = customer.id;
		await db.update(agiUsers).set({ stripeCustomerId: customerId }).where(eq(agiUsers.id, user.id)).run();
	}

	const subscription = await stripe.subscriptions.create({
		customer: customerId,
		items: [{ price: requestedPriceId }],
		payment_behavior: 'default_incomplete',
		payment_settings: { save_default_payment_method: 'on_subscription' },
		expand: ['latest_invoice']
	});

	const latestInvoice = subscription.latest_invoice as Stripe.Invoice | null;
	const clientSecret =
		latestInvoice?.confirmation_secret?.client_secret ??
		(latestInvoice as unknown as { payment_intent?: { client_secret?: string } })?.payment_intent?.client_secret ??
		null;

	if (!clientSecret) return json({ error: 'Missing client secret' }, { status: 500 });

	await db
		.update(agiUsers)
		.set({
			stripeSubscriptionId: subscription.id,
			stripeSubscriptionStatus: subscription.status,
			stripePriceId: requestedPriceId
		})
		.where(eq(agiUsers.id, user.id))
		.run();

	return json({ clientSecret, subscriptionId: subscription.id }, { status: 200 });
};
