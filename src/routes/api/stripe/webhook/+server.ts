import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

import { getDb } from '$lib/server/db/client';
import { agiUsers } from '$lib/server/db/schema';
import { getStripe } from '$lib/server/stripe/client';

export const POST: RequestHandler = async ({ request, locals }) => {
	const env = locals.env;
	const stripe = getStripe(env);

	const signature = request.headers.get('stripe-signature');
	if (!signature) return json({ error: 'Missing Stripe signature' }, { status: 400 });

	const rawBody = await request.text();

	let event: Stripe.Event;
	try {
		event = await stripe.webhooks.constructEventAsync(rawBody, signature, env.AGI_STRIPE_WEBHOOK_SECRET);
	} catch (err) {
		return json({ error: err instanceof Error ? err.message : 'Invalid signature' }, { status: 400 });
	}

	if (
		event.type === 'customer.subscription.created' ||
		event.type === 'customer.subscription.updated' ||
		event.type === 'customer.subscription.deleted'
	) {
		const subscription = event.data.object as Stripe.Subscription;
		const customerId =
			typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id ?? null;
		const priceId = subscription.items.data[0]?.price?.id ?? null;

		if (customerId) {
			const db = getDb(env);
			await db
				.update(agiUsers)
				.set({
					stripeSubscriptionId: subscription.id,
					stripeSubscriptionStatus: subscription.status,
					stripePriceId: priceId
				})
				.where(eq(agiUsers.stripeCustomerId, customerId))
				.run();
		}
	}

	return json({ received: true }, { status: 200 });
};
