import type { PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';

import { getDb } from '$lib/server/db/client';
import { agiUsers } from '$lib/server/db/schema';
import { getStripe } from '$lib/server/stripe/client';

type InvoiceSummary = {
	id: string;
	number: string | null;
	status: string | null;
	amountPaid: number | null;
	amountDue: number | null;
	currency: string | null;
	hostedInvoiceUrl: string | null;
	created: number;
};

export const load: PageServerLoad = async ({ locals, url }) => {
	const env = locals.env;
	const db = getDb(env);

	const user = await db
		.select({
			id: agiUsers.id,
			email: agiUsers.email,
			stripeCustomerId: agiUsers.stripeCustomerId,
			stripeSubscriptionId: agiUsers.stripeSubscriptionId,
			stripeSubscriptionStatus: agiUsers.stripeSubscriptionStatus,
			stripePriceId: agiUsers.stripePriceId
		})
		.from(agiUsers)
		.where(eq(agiUsers.id, locals.user!.id))
		.get();

	const appUrl = env.AGI_APP_URL || url.origin;
	const stripeReady =
		Boolean(env.AGI_STRIPE_PUBLISHABLE_KEY) && Boolean(env.AGI_STRIPE_SECRET_KEY) && Boolean(env.AGI_STRIPE_PRICE_PRO);

	let invoices: InvoiceSummary[] = [];

	if (stripeReady && user?.stripeCustomerId) {
		const stripe = getStripe(env);
		const list = await stripe.invoices.list({ customer: user.stripeCustomerId, limit: 10 });
		invoices = list.data.map((inv) => ({
			id: inv.id,
			number: inv.number ?? null,
			status: inv.status ?? null,
			amountPaid: typeof inv.amount_paid === 'number' ? inv.amount_paid : null,
			amountDue: typeof inv.amount_due === 'number' ? inv.amount_due : null,
			currency: inv.currency ?? null,
			hostedInvoiceUrl: inv.hosted_invoice_url ?? null,
			created: inv.created
		}));

		if (user?.stripeSubscriptionId) {
			try {
				const sub = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
				const priceId = sub.items.data[0]?.price?.id ?? null;
				if (
					sub.status !== user.stripeSubscriptionStatus ||
					priceId !== user.stripePriceId
				) {
					await db
						.update(agiUsers)
						.set({ stripeSubscriptionStatus: sub.status, stripePriceId: priceId })
						.where(eq(agiUsers.id, user.id))
						.run();
					user.stripeSubscriptionStatus = sub.status;
					user.stripePriceId = priceId;
				}
			} catch {
				// Ignore Stripe fetch errors; UI will fall back to DB state.
			}
		}
	}

	return {
		stripe: {
			ready: stripeReady,
			publishableKey: env.AGI_STRIPE_PUBLISHABLE_KEY,
			pricePro: env.AGI_STRIPE_PRICE_PRO,
			appUrl
		},
		billing: user
			? {
					subscriptionStatus: user.stripeSubscriptionStatus,
					priceId: user.stripePriceId,
					customerId: user.stripeCustomerId
				}
			: { subscriptionStatus: null, priceId: null, customerId: null },
		invoices
	};
};

